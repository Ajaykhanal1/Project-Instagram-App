import { X, Upload } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import Cropper from "react-easy-crop";
import { jwtDecode } from "jwt-decode";

type Props = {
  onClose: () => void;
};

type MediaFile = {
  file: File;
  url: string;
  type: "image" | "video";
};

const Post = ({ onClose }: Props) => {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState("");

  const [media, setMedia] = useState<MediaFile | null>(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  /* ================= TOKEN ================= */
  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);

    if (t) {
      const decoded: any = jwtDecode(t);
      setUserId(decoded.id);
    }
  }, []);

  /* ================= FILE ================= */
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMedia({
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" : "image",
    });
  };

  /* ================= UPLOAD ================= */
  const handleUpload = async () => {
    if (!media || !token || !userId) return;

    const formData = new FormData();
    formData.append("file", media.file);
    formData.append("userId", userId);
    formData.append("type", media.type);

    try {
      const res = await fetch("http://localhost:5000/api/posts/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      console.log("Uploaded:", data);

      setMedia(null);
      onClose();
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md h-150 bg-[#111] text-white rounded-2xl p-4 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">Create Post</h2>
          <X className="cursor-pointer" onClick={onClose} />
        </div>

        {/* INPUT */}
        <input
          ref={fileRef}
          type="file"
          hidden
          accept="image/*,video/*"
          onChange={handleFile}
        />

        {/* UPLOAD AREA */}
        {!media && (
          <div
            onClick={() => fileRef.current?.click()}
            className="flex-1 border border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-[#1a1a1a] transition"
          >
            <Upload size={45} />
            <p className="text-sm text-gray-400 mt-2">
              Click to upload image or video
            </p>
          </div>
        )}

        {/* PREVIEW */}
        {media && (
          <div className="flex flex-col flex-1">

            {/* MEDIA BOX */}
            <div className=" relative flex-1 bg-black rounded-xl overflow-hidden">

              {media.type === "image" && (
                <Cropper
                  image={media.url}
                  crop={crop}
                  zoom={zoom}
                  aspect={2 / 3}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                />
              )}

              {media.type === "video" && (
                <video
                  src={media.url}
                  className="w-full h-110 object-cover"
                  controls
                />
              )}
            </div>

            {/* ACTIONS */}
            <div className="flex justify-between items-center mt-4">

              <button
                onClick={() => setMedia(null)}
                className="text-gray-400 hover:text-white"
              >
                Change
              </button>

              <button
                onClick={handleUpload}
                className="bg-blue-600 cursor-pointer hover:bg-blue-700 px-5 py-2 rounded-lg"
              >
                Post
              </button>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Post;