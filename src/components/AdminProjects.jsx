import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../services/projectService";

const EMPTY_FORM = {
  title: "",
  description: "",
  techInput: "",
  is_private: false,
  live_url: "",
  code_url: "",
  featured: false,
  sort_order: 0,
};

export default function AdminProjects() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);

  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const [existingAttachments, setExistingAttachments] = useState([]);
  const [removedAttachments, setRemovedAttachments] = useState([]);
  const [newAttachments, setNewAttachments] = useState([]);

  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const loadData = async () => {
    try {
      const list = await fetchProjects();
      setProjects(list);
    } catch (err) {
      setStatusMsg(`Failed to load projects: ${err.message}`);
    }
  };

  useEffect(() => {
    if (session) loadData();
  }, [session]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setExistingImages([]);
    setRemovedImages([]);
    setNewImages([]);
    setExistingAttachments([]);
    setRemovedAttachments([]);
    setNewAttachments([]);
  };

  const startEdit = (project) => {
    setEditingId(project.id);
    setForm({
      title: project.title || "",
      description: project.description || "",
      techInput: (project.tech || []).join(", "),
      is_private: Boolean(project.is_private),
      live_url: project.live_url || "",
      code_url: project.code_url || "",
      featured: Boolean(project.featured),
      sort_order: project.sort_order ?? 0,
    });
    setExistingImages(project.images || []);
    setRemovedImages([]);
    setNewImages([]);
    setExistingAttachments(project.attachments || []);
    setRemovedAttachments([]);
    setNewAttachments([]);
    setStatusMsg("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const markExistingImageForRemoval = (img) => {
    setExistingImages((prev) => prev.filter((item) => item.path !== img.path));
    setRemovedImages((prev) => [...prev, img]);
  };

  const markExistingAttachmentForRemoval = (file) => {
    setExistingAttachments((prev) => prev.filter((item) => item.path !== file.path));
    setRemovedAttachments((prev) => [...prev, file]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg("");

    const payload = {
      ...form,
      tech: form.techInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      if (editingId) {
        await updateProject(
          editingId,
          payload,
          existingImages,
          removedImages,
          newImages,
          existingAttachments,
          removedAttachments,
          newAttachments
        );
        setStatusMsg("Project updated successfully.");
      } else {
        await createProject(payload, newImages, newAttachments);
        setStatusMsg("Project created successfully.");
      }

      resetForm();
      await loadData();
    } catch (err) {
      setStatusMsg(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (project) => {
    const confirmed = window.confirm(
      `Delete "${project.title}" and all its uploaded images/files?`
    );
    if (!confirmed) return;

    setSaving(true);
    setStatusMsg("");
    try {
      await deleteProject(project);
      if (editingId === project.id) resetForm();
      setStatusMsg(`Deleted "${project.title}".`);
      await loadData();
    } catch (err) {
      setStatusMsg(`Delete failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) return <div className="p-8">Loading session...</div>;

  if (!session) {
    return (
      <form onSubmit={handleLogin} className="max-w-md mx-auto my-12 p-6 border rounded space-y-4">
        <h2 className="text-xl font-bold">Admin Sign In</h2>
        {authError && <p className="text-red-600 text-sm">{authError}</p>}
        <input
          type="email"
          placeholder="Admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="w-full py-2 bg-black text-white rounded">
          Sign In
        </button>
      </form>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Portfolio Admin Panel</h1>
          <p className="text-sm text-gray-600">{session.user.email}</p>
        </div>
        <button
          type="button"
          onClick={() => supabase.auth.signOut()}
          className="px-4 py-2 border rounded"
        >
          Sign Out
        </button>
      </div>

      {statusMsg && (
        <div className="p-3 border rounded bg-gray-100 text-sm">{statusMsg}</div>
      )}

      {/* Create / Edit Form */}
      <form onSubmit={handleSubmit} className="p-6 border rounded space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {editingId ? "Edit Project" : "Add New Project"}
          </h2>
          {editingId && (
            <button type="button" onClick={resetForm} className="text-sm underline">
              Cancel Edit
            </button>
          )}
        </div>

        <input
          type="text"
          placeholder="Project Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />

        <textarea
          placeholder="Project Description"
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          placeholder="Tech stack (comma-separated, e.g. React, Supabase, Node.js)"
          value={form.techInput}
          onChange={(e) => setForm({ ...form, techInput: e.target.value })}
          className="w-full p-2 border rounded"
        />

        <div className="grid md:grid-cols-3 gap-4">
          <input
            type="url"
            placeholder="Live URL (optional)"
            value={form.live_url}
            onChange={(e) => setForm({ ...form, live_url: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="url"
            placeholder="Code URL (optional)"
            value={form.code_url}
            onChange={(e) => setForm({ ...form, code_url: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Sort order"
            value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
            className="p-2 border rounded"
          />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_private}
              onChange={(e) => setForm({ ...form, is_private: e.target.checked })}
            />
            Internal / Private System
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            Featured Project
          </label>
        </div>

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Current Images</p>
            <div className="flex flex-wrap gap-3">
              {existingImages.map((img) => (
                <div key={img.path} className="border p-2 rounded space-y-1">
                  <img src={img.url} alt={img.name} className="w-28 h-20 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => markExistingImageForRemoval(img)}
                    className="text-xs text-red-600 underline"
                  >
                    Remove Image
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload New Images */}
        <div className="space-y-1">
          <label className="block text-sm font-medium">Upload Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setNewImages(e.target.files)}
          />
        </div>

        {/* Existing Text / Document Files */}
        {existingAttachments.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Current Files</p>
            <ul className="space-y-1 text-sm">
              {existingAttachments.map((file) => (
                <li key={file.path} className="flex items-center gap-3">
                  <a href={file.url} target="_blank" rel="noreferrer" className="underline">
                    {file.name}
                  </a>
                  <button
                    type="button"
                    onClick={() => markExistingAttachmentForRemoval(file)}
                    className="text-xs text-red-600 underline"
                  >
                    Delete File
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Upload Text / Document Files */}
        <div className="space-y-1">
          <label className="block text-sm font-medium">
            Upload Text / Case Study Files (.txt, .md, .pdf, .doc, .docx, .json)
          </label>
          <input
            type="file"
            accept=".txt,.md,.pdf,.doc,.docx,.json,.csv"
            multiple
            onChange={(e) => setNewAttachments(e.target.files)}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 bg-blue-600 text-white rounded"
        >
          {saving ? "Saving..." : editingId ? "Update Project" : "Create Project"}
        </button>
      </form>

      {/* Existing Projects List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Saved Projects ({projects.length})</h2>
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-4 border rounded flex flex-wrap items-center justify-between gap-4"
          >
            <div>
              <h3 className="font-bold">{project.title}</h3>
              <p className="text-xs text-gray-600">
                {(project.images || []).length} images · {(project.attachments || []).length} files
                {project.is_private ? " · Private" : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => startEdit(project)}
                className="px-3 py-1 border rounded text-sm"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(project)}
                className="px-3 py-1 border border-red-500 text-red-600 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}