import React, { useEffect, useState } from "react";
import { ImagePlus } from "lucide-react";

type User = {
  displayName: string;
  bio: string;
  avatar: string;
};

type Props = {
  user: User;
  onClose: () => void;
  onSave: (data: FormData) => void;
};

const EditProfile: React.FC<Props> = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState({
    displayName: user.displayName || "",
    bio: user.bio || "",
    avatar: user.avatar || "",
    avatarFile: null as File | null,
  });

  // 🔥 Fix: prevent memory leak from URL.createObjectURL
  const previewUrl =
    form.avatarFile ? URL.createObjectURL(form.avatarFile) : form.avatar;

  useEffect(() => {
    return () => {
      if (form.avatarFile) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [form.avatarFile, previewUrl]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm((prev) => ({
      ...prev,
      avatarFile: file,
    }));
  };

  const handleSubmit = () => {
    const formData = new FormData();

    if (form.displayName) {
      formData.append("displayName", form.displayName);
    }

    if (form.bio) {
      formData.append("bio", form.bio);
    }

    if (form.avatarFile) {
      formData.append("avatar", form.avatarFile);
    }

    onSave(formData);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 text-white w-96 rounded-2xl shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <h2 className="text-xl font-semibold mb-6 text-center">
          Edit Profile
        </h2>

        {/* AVATAR PREVIEW */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={previewUrl}
            alt="avatar"
            className="w-20 h-20 rounded-full border-2 border-gray-600 object-cover"
          />
        </div>

        {/* DISPLAY NAME */}
        <label className="text-sm text-gray-400">Display Name</label>
        <input
          name="displayName"
          value={form.displayName}
          onChange={handleChange}
          placeholder="Display Name"
          className="w-full mt-1 mb-4 px-3 py-2 rounded-lg bg-zinc-800 border border-gray-700 focus:outline-none focus:border-blue-500"
        />

        {/* BIO */}
        <label className="text-sm text-gray-400">Bio</label>
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          placeholder="Write something about you..."
          className="w-full mt-1 mb-4 px-3 py-2 rounded-lg bg-zinc-800 border border-gray-700 focus:outline-none focus:border-blue-500 resize-none h-24"
        />

        {/* AVATAR UPLOAD */}
        <label className="text-sm text-gray-400">
          Upload Profile Picture
        </label>

        <div className="flex mt-2 mb-5 items-center gap-3">
          <input
            id="avatarUpload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <label
            htmlFor="avatarUpload"
            className="cursor-pointer p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition"
          >
            <ImagePlus className="w-5 h-5 text-gray-300" />
          </label>
        </div>

        {/* BUTTONS */}
        <div className="flex mt-10 gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="flex-1 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;