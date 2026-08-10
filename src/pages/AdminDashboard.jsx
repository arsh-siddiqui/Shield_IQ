import { useMemo, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip as RTooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import AppLayout from "../components/layout/AppLayout";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import SearchBar from "../components/ui/SearchBar";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";
import Pagination from "../components/ui/Pagination";
import { useToast } from "../context/ToastContext";
import useDebounce from "../hooks/useDebounce";
import { fetchAdminStats, fetchAdminAnalytics, fetchAdminUsers, updateAdminUserRemote, deleteAdminUserRemote } from "../services/adminService";
import { fetchArticles, createArticleRemote, updateArticleRemote, deleteArticleRemote } from "../services/articleService";

const tabs = [
  { id: "users", label: "Users" },
  { id: "articles", label: "Articles" },
];

const PAGE_SIZE = 4;

const emptyUser = { name: "", email: "", accountRole: "Student", status: "Active" };
const emptyArticle = { title: "", category: "Bank Fraud", status: "Draft", views: "0" };

// Colors for the pie chart
const riskColors = {
  High: "#EF4444",
  Medium: "#F59E0B",
  Low: "#10B981"
};

export default function AdminDashboard() {
  const [tab, setTab] = useState("users");
  const [searchInput, setSearchInput] = useState("");
  const search = useDebounce(searchInput, 200);
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formValues, setFormValues] = useState(emptyUser);
  const [deleteTarget, setDeleteTarget] = useState(null); // { kind, id, label }

  const { toast } = useToast();

  // Data states
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [s, a, u, art] = await Promise.all([
        fetchAdminStats(),
        fetchAdminAnalytics(),
        fetchAdminUsers({ limit: 1000 }), // simplified for admin view
        fetchArticles({ limit: 1000 })
      ]);
      setStats(s);
      setAnalytics(a);
      setUsers(u);
      setArticles(art);
    } catch (err) {
      toast("Failed to load admin data.", "danger");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredUsers = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()));
  const filteredArticles = articles.filter((a) => a.title.toLowerCase().includes(search.toLowerCase()));

  const activeList = tab === "users" ? filteredUsers : filteredArticles;
  const totalPages = Math.max(1, Math.ceil(activeList.length / PAGE_SIZE));
  const pagedList = useMemo(
    () => activeList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [activeList, page]
  );

  const switchTab = (t) => {
    setTab(t);
    setPage(1);
    setSearchInput("");
  };

  const openAdd = () => {
    setEditingId(null);
    setFormValues(tab === "users" ? emptyUser : emptyArticle);
    setFormOpen(true);
  };

  const openEdit = (item) => {
    setEditingId(item._id || item.id);
    setFormValues(item);
    setFormOpen(true);
  };

  const submitForm = async () => {
    try {
      if (tab === "users") {
        if (!formValues.name) {
          toast("Name is required.", "warning");
          return;
        }
        if (editingId) {
          await updateAdminUserRemote(editingId, formValues);
          toast("User updated.", "success");
        } else {
          toast("Please use the registration page to add users.", "warning");
          return;
        }
      } else {
        if (!formValues.title) {
          toast("Title is required.", "warning");
          return;
        }
        if (editingId) {
          await updateArticleRemote(editingId, formValues);
          toast("Article updated.", "success");
        } else {
          await createArticleRemote(formValues);
          toast("Article added.", "success");
        }
      }
      setFormOpen(false);
      loadData();
    } catch (err) {
      toast("Failed to save changes.", "danger");
    }
  };

  const confirmDelete = async () => {
    try {
      if (deleteTarget.kind === "users") {
        await deleteAdminUserRemote(deleteTarget.id);
      } else {
        await deleteArticleRemote(deleteTarget.id);
      }
      toast(`${deleteTarget.kind === "users" ? "User" : "Article"} deleted.`, "success");
      setDeleteTarget(null);
      loadData();
    } catch (err) {
      toast(err.response?.data?.message || "Failed to delete.", "danger");
    }
  };

  // Derived Stats
  const displayStats = [
    { label: "Total Users", value: stats?.totalUsers || 0, change: "--", icon: "Users" },
    { label: "Published Articles", value: stats?.publishedArticles || 0, change: "--", icon: "FileText" },
    { label: "Simulations", value: stats?.totalSimulations || 0, change: "--", icon: "Gamepad2" },
    { label: "Scans Today", value: stats?.scansToday || 0, change: "--", icon: "Activity" }
  ];

  // Derived Analytics
  let monthlyData = [];
  if (analytics?.userGrowth && analytics?.scanGrowth) {
    const months = new Set([
      ...analytics.userGrowth.map(u => u._id),
      ...analytics.scanGrowth.map(s => s._id)
    ]);
    monthlyData = Array.from(months).sort().map(month => {
      const ug = analytics.userGrowth.find(u => u._id === month);
      const sg = analytics.scanGrowth.find(s => s._id === month);
      return { month, users: ug?.count || 0, scans: sg?.count || 0 };
    });
  }

  const riskPieData = (analytics?.riskDistribution || []).map(r => ({
    name: r._id || "Unknown",
    value: r.count,
    color: riskColors[r._id] || "#94A3B8"
  }));

  if (loading && !stats) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64 text-ink-faint">Loading admin dashboard...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Admin Dashboard</h1>
          <p className="text-sm text-ink-light mt-1">Manage users, content, and monitor platform health.</p>
        </div>
        <Badge tone="primary" icon={Icons.ShieldCheck}>Admin Access</Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {displayStats.map((s, i) => {
          const Icon = Icons[s.icon] || Icons.BarChart3;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
                    <Icon className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-secondary">{s.change}</span>
                </div>
                <div className="text-xl font-extrabold text-ink">{s.value}</div>
                <div className="text-xs text-ink-light mt-1">{s.label}</div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2 p-6">
          <h3 className="font-bold text-ink mb-4">Growth Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#94A3B8" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#94A3B8" }} />
                <RTooltip contentStyle={{ borderRadius: 12, border: "1px solid #F1F5F9", fontSize: 12 }} />
                <Line type="monotone" dataKey="users" stroke="#2563EB" strokeWidth={2.5} dot={false} name="Users" animationDuration={1200} />
                <Line type="monotone" dataKey="scans" stroke="#14B8A6" strokeWidth={2.5} dot={false} name="Scans" animationDuration={1200} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-ink mb-4">Scan Risk Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskPieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3} animationDuration={1200}>
                  {riskPieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <RTooltip contentStyle={{ borderRadius: 12, border: "1px solid #F1F5F9", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* CRUD tables */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex gap-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => switchTab(t.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  tab === t.id ? "bg-primary text-white" : "bg-slate-100 text-ink-light"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <SearchBar
              value={searchInput}
              onChange={(v) => {
                setSearchInput(v);
                setPage(1);
              }}
              placeholder={`Search ${tab}...`}
              className="w-full sm:w-56"
            />
            {tab !== "users" && (
              <Button size="sm" icon={Icons.Plus} onClick={openAdd}>
                Add
              </Button>
            )}
          </div>
        </div>

        {tab === "users" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-ink-faint uppercase border-b border-slate-100">
                  <th className="pb-3 font-semibold">Name</th>
                  <th className="pb-3 font-semibold">Role</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pagedList.map((u) => (
                  <tr key={u._id}>
                    <td className="py-3">
                      <div className="font-medium text-ink">{u.name}</div>
                      <div className="text-xs text-ink-faint">{u.email}</div>
                    </td>
                    <td className="py-3 text-ink-light">{u.accountRole || u.role}</td>
                    <td className="py-3">
                      <Badge tone={u.status === "Active" ? "success" : "danger"}>{u.status || "Active"}</Badge>
                    </td>
                    <td className="py-3 text-right">
                      <button onClick={() => openEdit(u)} className="p-2 rounded-lg hover:bg-slate-100 text-ink-faint mr-1">
                        <Icons.Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ kind: "users", id: u._id, label: u.name })}
                        className="p-2 rounded-lg hover:bg-red-50 text-danger"
                      >
                        <Icons.Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {pagedList.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-ink-faint">No users match your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-ink-faint uppercase border-b border-slate-100">
                  <th className="pb-3 font-semibold">Title</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pagedList.map((a) => (
                  <tr key={a._id}>
                    <td className="py-3 font-medium text-ink">{a.title}</td>
                    <td className="py-3 text-ink-light">{a.category}</td>
                    <td className="py-3">
                      <Badge tone={a.status === "Published" ? "success" : "neutral"}>{a.status}</Badge>
                    </td>
                    <td className="py-3 text-right">
                      <button onClick={() => openEdit(a)} className="p-2 rounded-lg hover:bg-slate-100 text-ink-faint mr-1">
                        <Icons.Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ kind: "articles", id: a._id, label: a.title })}
                        className="p-2 rounded-lg hover:bg-red-50 text-danger"
                      >
                        <Icons.Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {pagedList.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-ink-faint">No articles match your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </Card>

      {/* Add / Edit modal */}
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editingId ? "Edit" : "Add"} size="sm">
        {tab === "users" ? (
          <div className="space-y-4">
            <Input label="Name" value={formValues.name || ""} onChange={(e) => setFormValues((v) => ({ ...v, name: e.target.value }))} />
            <div>
              <span className="block text-sm font-medium text-ink mb-1.5">Account Role</span>
              <div className="grid grid-cols-3 gap-2">
                {["Student", "Professional", "Business"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setFormValues((v) => ({ ...v, accountRole: r }))}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                      formValues.accountRole === r ? "border-primary bg-primary-50 text-primary" : "border-slate-200 text-ink-light"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="block text-sm font-medium text-ink mb-1.5">Status</span>
              <div className="grid grid-cols-2 gap-2">
                {["Active", "Suspended"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFormValues((v) => ({ ...v, status: s }))}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                      formValues.status === s ? "border-primary bg-primary-50 text-primary" : "border-slate-200 text-ink-light"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <Button className="w-full mt-2" onClick={submitForm}>
              {editingId ? "Save Changes" : "Add User"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Input label="Title" value={formValues.title || ""} onChange={(e) => setFormValues((v) => ({ ...v, title: e.target.value }))} />
            <Input label="Category" value={formValues.category || ""} onChange={(e) => setFormValues((v) => ({ ...v, category: e.target.value }))} />
            <div>
              <span className="block text-sm font-medium text-ink mb-1.5">Status</span>
              <div className="grid grid-cols-2 gap-2">
                {["Draft", "Published"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setFormValues((v) => ({ ...v, status: s }))}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                      formValues.status === s ? "border-primary bg-primary-50 text-primary" : "border-slate-200 text-ink-light"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <Button className="w-full mt-2" onClick={submitForm}>
              {editingId ? "Save Changes" : "Add Article"}
            </Button>
          </div>
        )}
      </Modal>

      {/* Delete confirmation modal */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Confirm Delete" size="sm">
        {deleteTarget && (
          <div>
            <p className="text-sm text-ink-light leading-relaxed mb-6">
              Are you sure you want to delete <span className="font-semibold text-ink">{deleteTarget.label}</span>? This can't be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button variant="danger" className="flex-1" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </AppLayout>
  );
}
