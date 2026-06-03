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

type CropArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const Post = ({ onClose }: Props) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [userId, setUserId] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);

  const [media, setMedia] = useState<MediaFile | null>(null);
  const [posts, setPosts] = useState<any[]>([]);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<CropArea | null>(null);

  /* ======================
     GET USER FROM TOKEN
  ====================== */
  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);

    if (t) {
      const decoded: any = jwtDecode(t);
      setUserId(decoded.id);
    }
  }, []);

  /* ======================
     FETCH USER POSTS
  ====================== */
  useEffect(() => {
    if (!userId || !token) return;

    fetch(`http://localhost:5000/api/posts/posts/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setPosts)
      .catch(console.error);
  }, [userId, token]);

  /* ======================
     FILE SELECT
  ====================== */
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMedia({
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" : "image",
    });
  };

  /* ======================
     CROPPER CALLBACK
  ====================== */
  const onCropComplete = (_: any, areaPixels: CropArea) => {
    setCroppedArea(areaPixels);
  };

  /* ======================
     UPLOAD POST
  ====================== */
  const handleUpload = async () => {
    if (!media || !userId || !token) return;

    const formData = new FormData();
    formData.append("file", media.file);
    formData.append("userId", userId);
    formData.append("type", media.type);

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
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/80 z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-105 h-150 bg-gray-900 text-white rounded-xl p-4"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Create Post</h2>
          <X className="cursor-pointer" onClick={onClose} />
        </div>

        {/* FILE INPUT */}
        <input
          ref={fileInputRef}
          type="file"
          hidden
          accept="image/*,video/*"
          onChange={handleFile}
        />

        {/* UPLOAD AREA */}
        {!media && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="h-105 border border-dashed border-gray-600 flex items-center justify-center rounded-lg cursor-pointer hover:bg-gray-800"
          >
            <Upload size={40} />
          </div>
        )}

        {/* PREVIEW */}
        {media && (
          <>
            {/* FIXED PREVIEW BOX */}
            <div className="relative w-full h-105 bg-black rounded-lg overflow-hidden">

              {/* IMAGE CROPPER */}
              {media.type === "image" && (
                <Cropper
                  image={media.url}
                  crop={crop}
                  zoom={zoom}
                  aspect={2 / 3}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              )}

              {/* VIDEO PREVIEW */}
              {media.type === "video" && (
                <video
                  src={media.url}
                  className="w-full h-full object-cover"
                  controls
                />
              )}
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end mt-4">
              <button
                onClick={handleUpload}
                className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded"
              >
                Save
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Post;