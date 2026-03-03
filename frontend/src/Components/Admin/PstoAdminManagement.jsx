import React, { useState, useEffect } from "react";
import { api } from "../../api/axiosConfig";
import { FiUserPlus, FiUsers, FiSave, FiRefreshCw } from "react-icons/fi";

const PROVINCES = ["Oriental Mindoro", "Occidental Mindoro", "Palawan", "Romblon", "Marinduque"];

const PstoAdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    username: "",
    password: "",
    province: "Marinduque",
  });

  const fetchAdmins = () => {
    setLoading(true);
    setError("");
    api
      .get("/api/auth/admin/psto")
      .then((res) => {
        if (res.data.success) setAdmins(res.data.admins || []);
      })
      .catch((err) => setError(err.response?.data?.message || "Failed to load PSTO admins."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreate = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.username.trim() || !form.password) {
      setError("Username and password are required.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setCreating(true);
    api
      .post("/api/auth/admin/create-psto", {
        username: form.username.trim(),
        password: form.password,
        province: form.province,
      })
      .then((res) => {
        if (res.data.success) {
          setSuccess("PSTO admin created successfully.");
          setForm({ username: "", password: "", province: "Marinduque" });
          fetchAdmins();
        }
      })
      .catch((err) => setError(err.response?.data?.message || "Failed to create PSTO admin."))
      .finally(() => setCreating(false));
  };

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
        <FiUsers className="text-cyan-600" />
        PSTO Admin Management
      </h1>
      <p className="text-slate-600 mb-6">
        Create PSTO admin accounts. Each PSTO admin can only view feedback from their assigned province.
      </p>

      {/* Create form */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <FiUserPlus className="text-cyan-600" />
          Create PSTO Admin
        </h2>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm">
            {success}
          </div>
        )}
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="e.g. marinduque_admin"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="Min. 6 characters"
                minLength={6}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Province</label>
              <select
                value={form.province}
                onChange={(e) => setForm((p) => ({ ...p, province: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              >
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={creating}
            className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-70"
          >
            <FiSave className="w-4 h-4" />
            {creating ? "Creating..." : "Create PSTO Admin"}
          </button>
        </form>
      </div>

      {/* List of PSTO admins */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Existing PSTO Admins</h2>
          <button
            type="button"
            onClick={fetchAdmins}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:text-cyan-600 border border-slate-300 rounded-lg hover:border-cyan-400"
          >
            <FiRefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : admins.length === 0 ? (
          <p className="text-slate-500">No PSTO admins yet. Create one above.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-600">
                  <th className="py-3 px-2">Username</th>
                  <th className="py-3 px-2">Province</th>
                  <th className="py-3 px-2">Role</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((a) => (
                  <tr key={a._id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-2 font-medium text-slate-800">{a.username}</td>
                    <td className="py-3 px-2 text-slate-600">{a.province || "—"}</td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 text-xs">
                        PSTO Admin
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PstoAdminManagement;
