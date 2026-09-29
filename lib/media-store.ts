import { createAdminClient } from "@/lib/supabase/server";

export interface MediaAsset {
  id: string;
  bucket: string;
  path: string;
  url: string;
  filename: string;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number | null;
  width: number | null;
  height: number | null;
  altText: string;
  title: string;
  folder: string;
  usageType: string;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

function fromRow(row: Record<string, unknown>): MediaAsset {
  return {
    id: row.id as string,
    bucket: (row.bucket as string) ?? "affiliate-media",
    path: row.path as string,
    url: row.url as string,
    filename: row.filename as string,
    originalFilename: (row.original_filename as string) ?? "",
    mimeType: (row.mime_type as string) ?? "",
    sizeBytes: (row.size_bytes as number) ?? null,
    width: (row.width as number) ?? null,
    height: (row.height as number) ?? null,
    altText: (row.alt_text as string) ?? "",
    title: (row.title as string) ?? "",
    folder: (row.folder as string) ?? "misc",
    usageType: (row.usage_type as string) ?? "",
    createdAt: (row.created_at as string) ?? "",
    updatedAt: (row.updated_at as string) ?? "",
    archived: (row.archived as boolean) ?? false,
  };
}

export interface CreateMediaInput {
  id: string;
  bucket: string;
  path: string;
  url: string;
  filename: string;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number | null;
  altText: string;
  title: string;
  folder: string;
  usageType: string;
}

export async function getAllMedia(): Promise<MediaAsset[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("media_assets")
    .select("*")
    .eq("archived", false)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(fromRow);
}

export async function getMediaById(id: string): Promise<MediaAsset | undefined> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("media_assets").select("*").eq("id", id).single();
  if (error) return undefined;
  return fromRow(data as Record<string, unknown>);
}

export async function getMediaByFolder(folder: string): Promise<MediaAsset[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("media_assets")
    .select("*")
    .eq("folder", folder)
    .eq("archived", false)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(fromRow);
}

export async function searchMedia(query: string): Promise<MediaAsset[]> {
  const supabase = createAdminClient();
  const q = `%${query}%`;
  const { data, error } = await supabase
    .from("media_assets")
    .select("*")
    .eq("archived", false)
    .or(`filename.ilike.${q},title.ilike.${q},alt_text.ilike.${q}`)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(fromRow);
}

export async function createMediaRecord(input: CreateMediaInput): Promise<MediaAsset> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("media_assets")
    .insert({
      id: input.id,
      bucket: input.bucket,
      path: input.path,
      url: input.url,
      filename: input.filename,
      original_filename: input.originalFilename,
      mime_type: input.mimeType,
      size_bytes: input.sizeBytes,
      alt_text: input.altText,
      title: input.title,
      folder: input.folder,
      usage_type: input.usageType,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return fromRow(data as Record<string, unknown>);
}

export async function updateMediaRecord(
  id: string,
  updates: Partial<Pick<MediaAsset, "altText" | "title" | "folder" | "usageType">>
): Promise<MediaAsset> {
  const supabase = createAdminClient();
  const row: Record<string, unknown> = {};
  if (updates.altText !== undefined) row.alt_text = updates.altText;
  if (updates.title !== undefined) row.title = updates.title;
  if (updates.folder !== undefined) row.folder = updates.folder;
  if (updates.usageType !== undefined) row.usage_type = updates.usageType;

  const { data, error } = await supabase
    .from("media_assets")
    .update(row)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return fromRow(data as Record<string, unknown>);
}

export async function archiveMedia(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("media_assets").update({ archived: true }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteMediaFileAndArchiveRecord(id: string): Promise<void> {
  const supabase = createAdminClient();
  const asset = await getMediaById(id);
  if (!asset) throw new Error("Media asset not found.");

  const { error: storageError } = await supabase.storage.from(asset.bucket).remove([asset.path]);
  if (storageError) throw new Error(`Storage delete failed: ${storageError.message}`);

  await archiveMedia(id);
}
