import { supabase } from "../lib/supabaseClient";

const IMAGE_BUCKET = "project-images";
const FILE_BUCKET = "project-files";

function sanitizeFileName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function uploadFiles(files, bucket, folder = "general") {
  const uploaded = [];

  for (const file of Array.from(files)) {
    const filePath = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${sanitizeFileName(file.name)}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { upsert: false });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    uploaded.push({
      name: file.name,
      url: urlData.publicUrl,
      path: filePath,
    });
  }

  return uploaded;
}

export async function removeStorageItems(items, bucket) {
  const paths = (items || []).map((item) => item.path).filter(Boolean);
  if (paths.length === 0) return;

  const { error } = await supabase.storage.from(bucket).remove(paths);
  if (error) throw error;
}

export async function fetchProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createProject(payload, newImages = [], newAttachments = []) {
  const uploadedImages = newImages.length
    ? await uploadFiles(newImages, IMAGE_BUCKET, "projects")
    : [];

  const uploadedAttachments = newAttachments.length
    ? await uploadFiles(newAttachments, FILE_BUCKET, "attachments")
    : [];

  const row = {
    title: payload.title.trim(),
    description: payload.description.trim(),
    tech: payload.tech,
    is_private: Boolean(payload.is_private),
    live_url: payload.live_url?.trim() || null,
    code_url: payload.code_url?.trim() || null,
    featured: Boolean(payload.featured),
    sort_order: Number(payload.sort_order) || 0,
    images: uploadedImages,
    attachments: uploadedAttachments,
  };

  const { data, error } = await supabase
    .from("projects")
    .insert([row])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProject(
  projectId,
  payload,
  existingImages,
  removedImages,
  newImages,
  existingAttachments,
  removedAttachments,
  newAttachments
) {
  // 1. Delete removed files from storage
  if (removedImages?.length) {
    await removeStorageItems(removedImages, IMAGE_BUCKET);
  }
  if (removedAttachments?.length) {
    await removeStorageItems(removedAttachments, FILE_BUCKET);
  }

  // 2. Upload newly added files
  const addedImages = newImages?.length
    ? await uploadFiles(newImages, IMAGE_BUCKET, "projects")
    : [];

  const addedAttachments = newAttachments?.length
    ? await uploadFiles(newAttachments, FILE_BUCKET, "attachments")
    : [];

  const updatedRow = {
    title: payload.title.trim(),
    description: payload.description.trim(),
    tech: payload.tech,
    is_private: Boolean(payload.is_private),
    live_url: payload.live_url?.trim() || null,
    code_url: payload.code_url?.trim() || null,
    featured: Boolean(payload.featured),
    sort_order: Number(payload.sort_order) || 0,
    images: [...(existingImages || []), ...addedImages],
    attachments: [...(existingAttachments || []), ...addedAttachments],
  };

  const { data, error } = await supabase
    .from("projects")
    .update(updatedRow)
    .eq("id", projectId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProject(project) {
  // Clean up associated storage files first
  await removeStorageItems(project.images, IMAGE_BUCKET);
  await removeStorageItems(project.attachments, FILE_BUCKET);

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", project.id);

  if (error) throw error;
}