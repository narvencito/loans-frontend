import { useState } from "react";

interface Props {
  value: string[];
  onChange: (urls: string[]) => void;
}

const cloudName = "tu_cloud_name";
const uploadPreset = "tu_upload_preset";

const ImageUploader = ({ value, onChange }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setLoading(true);
    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.secure_url) uploadedUrls.push(data.secure_url);
    }

    onChange([...value, ...uploadedUrls]);
    setLoading(false);
  };

  const handleRemove = (url: string) => {
    onChange(value.filter((u) => u !== url));
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Imágenes</label>
      <input type="file" multiple accept="image/*" onChange={handleUpload} disabled={loading} />
      <div className="flex gap-2 flex-wrap">
        {value.map((url) => (
          <div key={url} className="relative w-24 h-24">
            <img src={url} alt="preview" className="object-cover w-full h-full rounded" />
            <button
              type="button"
              onClick={() => handleRemove(url)}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;