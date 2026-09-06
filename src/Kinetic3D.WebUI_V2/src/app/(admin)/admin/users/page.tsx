"use client";

import React, { useState, useEffect } from "react";
import { adminUsersApi } from "@/lib/api";
import type { AdminUserDto } from "@/types/api";
import {
  Users,
  Search,
  Filter,
  Shield,
  Sparkles,
  Edit2,
  Check,
  X,
  CreditCard,
  ShoppingBag,
  Calendar,
} from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserDto[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPro: 0,
    totalAdmins: 0,
    totalCreditsIssued: 0,
  });
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<AdminUserDto | null>(null);
  const [newRole, setNewRole] = useState("Customer");
  const [newCredits, setNewCredits] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchUsers = () => {
    setLoading(true);
    adminUsersApi
      .getAll(search, roleFilter)
      .then((res) => {
        setUsers(res.users);
        setStats(res.stats);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleOpenEdit = (user: AdminUserDto) => {
    setEditingUser(user);
    setNewRole(user.role);
    setNewCredits(user.credits);
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    setIsUpdating(true);
    try {
      await adminUsersApi.updateRole(editingUser.id, newRole, newCredits);
      setSuccessMessage(`Đã cập nhật tài khoản ${editingUser.email} thành công!`);
      setTimeout(() => setSuccessMessage(""), 3000);
      setEditingUser(null);
      fetchUsers();
    } catch {
      alert("Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
            <Users className="text-orange-500" />
            Quản Lý Người Dùng &amp; Tài Khoản
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Theo dõi danh sách khách hàng, số dư Credits tạo mẫu 3D, lịch sử đơn hàng và phân quyền hệ thống.
          </p>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <Check size={16} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
          <p className="text-xs text-neutral-400 font-mono">TỔNG TÀI KHOẢN</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-white font-mono">{stats.totalUsers}</span>
            <span className="text-xs text-neutral-500">Người dùng</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
          <p className="text-xs text-neutral-400 font-mono">THÀNH VIÊN PRO / WORKSHOP</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-orange-400 font-mono">{stats.totalPro}</span>
            <span className="text-xs text-neutral-500">Tài khoản</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
          <p className="text-xs text-neutral-400 font-mono">QUẢN TRỊ VIÊN</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-sky-400 font-mono">{stats.totalAdmins}</span>
            <span className="text-xs text-neutral-500">Admin</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
          <p className="text-xs text-neutral-400 font-mono">TỔNG CREDITS ĐÃ PHÁT HÀNH</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-emerald-400 font-mono">
              {stats.totalCreditsIssued.toLocaleString()}
            </span>
            <span className="text-xs text-neutral-500">Tokens</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên hoặc email..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={14} className="text-neutral-500" />
          <span className="text-xs text-neutral-400">Lọc vai trò:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="Customer">Khách hàng (Customer)</option>
            <option value="Pro">Pro Workshop</option>
            <option value="Studio">Studio Enterprise</option>
            <option value="Admin">Quản trị viên (Admin)</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950 text-neutral-400 uppercase font-mono border-b border-neutral-800">
              <tr>
                <th className="px-6 py-4">Người dùng</th>
                <th className="px-6 py-4">Vai trò</th>
                <th className="px-6 py-4">Số dư Credits</th>
                <th className="px-6 py-4">Đơn hàng / Chi tiêu</th>
                <th className="px-6 py-4">Ngày tạo</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 text-neutral-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                    Đang tải danh sách người dùng...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                    Không tìm thấy người dùng nào phù hợp.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isRoleAdmin = u.role.toLowerCase() === "admin";
                  const isRolePro = u.role.toLowerCase() === "pro" || u.role.toLowerCase() === "studio";

                  return (
                    <tr key={u.id} className="hover:bg-neutral-800/50 transition-colors">
                      {/* Name & Email */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-white uppercase shrink-0 overflow-hidden">
                            {u.avatarUrl ? (
                              <img src={u.avatarUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              u.displayName?.[0] || u.email[0]
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm leading-tight">{u.displayName}</p>
                            <p className="text-neutral-400 font-mono text-[11px] mt-0.5">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-mono text-[10px] font-bold ${
                            isRoleAdmin
                              ? "bg-sky-500/10 text-sky-400 border border-sky-500/30"
                              : isRolePro
                              ? "bg-orange-500/10 text-orange-400 border border-orange-500/30"
                              : "bg-neutral-800 text-neutral-300 border border-neutral-700"
                          }`}
                        >
                          {isRoleAdmin ? <Shield size={10} /> : isRolePro ? <Sparkles size={10} /> : null}
                          {u.role}
                        </span>
                      </td>

                      {/* Credits */}
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-black text-sm">
                          <Sparkles size={13} />
                          <span>{u.credits.toLocaleString()}</span>
                        </div>
                      </td>

                      {/* Orders & Spent */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-white flex items-center gap-1">
                            <ShoppingBag size={12} className="text-neutral-500" />
                            {u.ordersCount} đơn hàng
                          </span>
                          <span className="text-[11px] font-mono text-neutral-400 mt-0.5">
                            {u.totalSpent.toLocaleString("vi-VN")}₫
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 font-mono text-neutral-400 text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString("vi-VN")}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(u)}
                          className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs transition-colors inline-flex items-center gap-1.5"
                        >
                          <Edit2 size={12} />
                          <span>Chỉnh sửa</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-white shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <h3 className="font-bold text-lg leading-tight">Chỉnh Sửa Người Dùng</h3>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">{editingUser.email}</p>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Role Selector */}
              <div>
                <label className="block text-xs text-neutral-400 mb-1.5">Vai trò hệ thống</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="Customer">Khách hàng (Customer)</option>
                  <option value="Pro">Pro Workshop</option>
                  <option value="Studio">Studio Enterprise</option>
                  <option value="Admin">Quản trị viên (Admin)</option>
                </select>
              </div>

              {/* Credits Adjuster */}
              <div>
                <label className="block text-xs text-neutral-400 mb-1.5">Số dư Token Credits</label>
                <input
                  type="number"
                  value={newCredits}
                  onChange={(e) => setNewCredits(parseInt(e.target.value) || 0)}
                  min={0}
                  className="w-full px-3 py-2.5 text-xs font-mono bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
                <p className="text-[10px] text-neutral-500 mt-1">
                  Cộng/trừ token trực tiếp vào tài khoản khách hàng để trải nghiệm Studio.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={isUpdating}
                onClick={handleSaveEdit}
                className="px-6 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-all disabled:opacity-50"
              >
                {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
