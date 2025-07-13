'use client';
import { useState } from 'react';

export default function UploadPage() {
  const [slug, setSlug] = useState(null);
  const [error, setError] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    setError(null);
    const file = e.target.zip.files[0];
    const slugName = e.target.slug.value || 'model';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('slug', slugName);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      setSlug(data.slug);
    } else {
      setError(data.error || 'Upload failed');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Upload 3D Model ZIP</h1>
      <form onSubmit={handleUpload}>
        <input type="text" name="slug" placeholder="model-name" required />
        <input type="file" name="zip" accept=".zip" required />
        <button type="submit">Upload</button>
      </form>
      {slug && (
        <p>
          ✅ Model extracted to: <code>/models/{slug}/</code>
        </p>
      )}
      {error && (
        <p style={{ color: 'red' }}>
          ❌ Error: {error}
        </p>
      )}
    </div>
  );
}