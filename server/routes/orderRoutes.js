const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const auth = require("../middleware/auth");
const router = express.Router();

// ============================================
// 1. CREATE ORDER (WITH VARIANT + STOCK FIXES)
// ============================================
router.post("/", auth, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalPrice } = req.body;

    // Process items with variant support
    const orderItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);

        // Handle variant stock reduction
        if (item.variant) {
          const variant = product.variants.find(
            (v) =>
              v.color === item.variant.color && v.size === item.variant.size,
          );
          if (!variant || variant.stock < item.quantity) {
            throw new Error(
              `Insufficient stock for ${product.name} (${item.variant.color}/${item.variant.size})`,
            );
          }
          variant.stock -= item.quantity; // Reduce variant stock
        } else {
          if (product.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${product.name}`);
          }
          product.stock -= item.quantity; // Reduce base product stock
        }

        await product.save();

        return {
          name: product.name,
          productId: product._id,
          variant: item.variant || null, // Track color/size
          quantity: item.quantity,
          price: product.price,
          image: product.images[0],
        };
      }),
    );

    // Create order (preserve all original fields)
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      status: "processing",
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ============================================
// 2. UPDATE ORDER STATUS (ADMIN FIX)
// ============================================
router.patch("/:id/status", auth, async (req, res) => {
  try {
    // Admin check
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { status } = req.body;
    const validStatuses = ["processing", "completed", "cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    ).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// 3. GET USER ORDERS (WITH VARIANT DETAILS)
// ============================================
router.get("/my-orders", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort("-createdAt")
      .populate("orderItems.productId", "name images");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// 4. GET ALL ORDERS (ADMIN - WITH USER DETAILS)
// ============================================
router.get("/", auth, async (req, res) => {
  try {
    // Admin check
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const orders = await Order.find()
      .sort("-createdAt")
      .populate("user", "name email")
      .populate("orderItems.productId", "name");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
