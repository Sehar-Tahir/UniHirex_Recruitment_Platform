const BASE_URL = import.meta.env.VITE_API_URL;

export async function uploadFile(file, uploadType, token) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/upload/${uploadType}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Upload failed");
  }

  return data.url;
}