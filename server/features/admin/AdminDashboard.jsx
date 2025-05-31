// src/features/admin/AdminDashboard.jsx

import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { auth } from "../../config/firebaseConfig";
import Layout from "../../components/Layout";
import Button from "../../components/Button";

import AdminNavBar from "./components/AdminNavBar";
import OrdersTable from "./components/OrdersTable";
import UsersTable from "./components/UsersTable";
import AdminStationeryForm from "./components/AdminStationeryForm";
import AdminStationeryTable from "./components/AdminStationeryTable";
import EditUserModal from "./components/EditUserModal";
import UserHeader from "../../components/UserHeader";

import { getAllOrders, updateOrderStatus } from "../../api/orderApi";
import {
  getAllUsers,
  updateUserRole,
  blockUser,
  unblockUser,
  deleteUser,
  updateProfile,
  verifyMobileManual,
} from "../../api/userApi";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [pending, setPending] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [saving, setSaving] = useState(false);

  // ——— fetch orders once on mount (auth already checked globally) ———
  useEffect(() => {
    (async () => {
      try {
        await fetchOrders();
      } finally {
        setPending(false);
      }
    })();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { orders } = await getAllOrders();
      setOrders(orders);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { users } = await getAllUsers();
      setUsers(users);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const switchToUser = () => navigate("/userdashboard");

  // --- New user management handlers ---

  // Save edited user profile from modal
  const handleEditUser = async () => {
    if (!editUser) return;
    setSaving(true);
    try {
      // Call API to update profile in DB
      await updateProfile(editUser);
      // Update local users state to reflect changes
      setUsers((prev) =>
        prev.map((u) => (u.email === editUser.email ? editUser : u)),
      );
      toast.success("User profile updated");
      setEditUser(null);
    } catch (error) {
      toast.error("Failed to update user profile");
    } finally {
      setSaving(false);
    }
  };

  // Toggle user role between 'admin' and 'user'
  const handleRoleChangeWrapper = async (email, newRole) => {
    try {
      await updateUserRole(email, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.email === email ? { ...u, role: newRole } : u)),
      );
      toast.success(`User role changed to ${newRole}`);
    } catch {
      toast.error("Failed to change user role");
    }
  };

  // Block a user (not admin)
  const handleBlockUserWrapper = async (email) => {
    try {
      // Prevent blocking admin users
      const user = users.find((u) => u.email === email);
      if (user?.role === "admin") {
        toast.error("Cannot block an admin user");
        return;
      }
      await blockUser(email);
      setUsers((prev) =>
        prev.map((u) => (u.email === email ? { ...u, blocked: true } : u)),
      );
      toast.success("User blocked");
    } catch {
      toast.error("Failed to block user");
    }
  };

  // Unblock user
  const handleUnblockUserWrapper = async (email) => {
    try {
      await unblockUser(email);
      setUsers((prev) =>
        prev.map((u) => (u.email === email ? { ...u, blocked: false } : u)),
      );
      toast.success("User unblocked");
    } catch {
      toast.error("Failed to unblock user");
    }
  };

  // Verify or toggle mobile verification manually
  const handleVerifyMobileWrapper = async (email) => {
    try {
      await verifyMobileManual(email);
      // Refetch users to get updated verification status or toggle locally:
      setUsers((prev) =>
        prev.map((u) =>
          u.email === email
            ? { ...u, mobileVerified: u.mobileVerified ? 0 : 1 }
            : u,
        ),
      );
      toast.success("Mobile verification status toggled");
    } catch {
      toast.error("Failed to verify mobile");
    }
  };

  // Delete user from DB and Firebase
  const handleDeleteUserWrapper = async (email) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(email);
      setUsers((prev) => prev.filter((u) => u.email !== email));
      toast.success("User deleted");
    } catch {
      toast.error("Failed to delete user");
    }
  };

  if (pending) {
    return <div className="text-center mt-10">Checking login…</div>;
  }

  return (
    <Layout title="Admin Dashboard">
      <Toaster />
      <UserHeader />
      {/* Top-bar controls */}
      <div className="flex justify-end gap-2 mb-6">
        <Button variant="secondary" onClick={switchToUser}>
          Back to User View
        </Button>
        <Button variant="danger" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {/* Tab navigation */}
      <AdminNavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        fetchOrders={fetchOrders}
        fetchUsers={fetchUsers}
      />

      {/* Content */}
      <div className="mt-6 p-6 bg-white rounded shadow overflow-auto min-h-[60vh]">
        {activeTab === "orders" && (
          <>
            <h2 className="text-2xl font-bold mb-4">Manage Orders</h2>
            <OrdersTable
              orders={orders}
              loading={loading}
              handleStatusChange={updateOrderStatus}
            />
          </>
        )}

        {activeTab === "users" && (
          <>
            <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
            <UsersTable
              users={users}
              loading={loading}
              handleRoleChange={handleRoleChangeWrapper}
              handleBlockUser={handleBlockUserWrapper}
              handleUnblockUser={handleUnblockUserWrapper}
              handleDeleteUser={handleDeleteUserWrapper}
              handleVerifyMobile={handleVerifyMobileWrapper}
              setEditUser={setEditUser}
            />
            {editUser && (
              <EditUserModal
                editUser={editUser}
                setEditUser={setEditUser}
                handleEditUser={handleEditUser}
                saving={saving}
              />
            )}
          </>
        )}

        {activeTab === "stationery" && (
          <>
            <h2 className="text-2xl font-bold mb-4">Manage Stationery</h2>
            <AdminStationeryForm />
            <AdminStationeryTable />
          </>
        )}
      </div>
    </Layout>
  );
}
