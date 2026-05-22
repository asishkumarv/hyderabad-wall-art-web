import { API_URL } from "./constants";

export type CloudinaryResourceType = "image" | "video" | "auto";

/**
 * Uploads a file to Cloudinary via the secured backend /api/upload endpoint.
 * The backend signs the upload using the secret API key, so no unsigned preset is needed.
 * Returns the Cloudinary CDN URL for the uploaded asset.
 */
export async function uploadToCloudinary(
  file: File,
  _resourceType: CloudinaryResourceType = "auto"
): Promise<string> {
  const token = localStorage.getItem("hwa-token");

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error ?? `Upload failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.url as string;
}

/**
 * Uploads multiple files concurrently via the backend.
 * Returns an array of Cloudinary CDN URLs.
 */
export async function uploadManyToCloudinary(
  files: FileList | File[],
  resourceType: CloudinaryResourceType = "auto"
): Promise<string[]> {
  return Promise.all(Array.from(files).map((f) => uploadToCloudinary(f, resourceType)));
}
