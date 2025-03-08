"use client";
import React from "react";

import { useUpload } from "../utilities/runtime-helpers";

function ImageUploader({ onImagesChange, initialImages = [] }) {
  const [images, setImages] = useState(initialImages);
  const [error, setError] = useState(null);
  const [upload, { loading }] = useUpload();

  const handleImageUpload = useCallback(
    async (file) => {
      try {
        const { url, error: uploadError } = await upload({ file });
        if (uploadError) throw new Error(uploadError);
        return url;
      } catch (err) {
        setError("Failed to upload image. Please try again.");
        console.error(err);
        return null;
      }
    },
    [upload]
  );

  const addImage = useCallback(
    async (files) => {
      const newImages = [...images];

      for (const file of files) {
        const imageUrl = await handleImageUpload(file);
        if (imageUrl) {
          newImages.push({
            url: imageUrl,
            notes: "",
            file: file,
          });
        }
      }

      setImages(newImages);
      onImagesChange?.(newImages);
    },
    [images, handleImageUpload, onImagesChange]
  );

  const removeImage = useCallback(
    (index) => {
      const newImages = images.filter((_, i) => i !== index);
      setImages(newImages);
      onImagesChange?.(newImages);
    },
    [images, onImagesChange]
  );

  const updateNotes = useCallback(
    (index, notes) => {
      const newImages = [...images];
      newImages[index] = { ...newImages[index], notes };
      setImages(newImages);
      onImagesChange?.(newImages);
    },
    [images, onImagesChange]
  );

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-lg">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white font-inter">
            Upload Images
          </h3>
          <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-md hover:opacity-80 transition-opacity">
            <i className="fas fa-plus mr-2"></i>
            <span className="font-inter">Add Images</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.length) {
                  addImage(Array.from(e.target.files));
                }
              }}
              className="hidden"
            />
          </label>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-4">
            <span className="text-gray-600 dark:text-gray-400 font-inter">
              Uploading...
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3"
            >
              <div className="relative aspect-video">
                <img
                  src={image.url}
                  alt={`Upload ${index + 1}`}
                  className="rounded-lg w-full h-full object-cover"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <textarea
                value={image.notes}
                onChange={(e) => updateNotes(index, e.target.value)}
                placeholder="Add notes about this image..."
                className="w-full p-3 border border-gray-200 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white font-inter resize-none"
                rows="3"
                name={`image-notes-${index}`}
              />
            </div>
          ))}
        </div>

        {images.length === 0 && (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400 font-inter">
              No images uploaded yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ImageUploaderStory() {
  const [images, setImages] = useState([]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 font-inter">
        Image Uploader Demo
      </h2>

      <ImageUploader
        onImagesChange={setImages}
        initialImages={[
          {
            url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3",
            notes: "Sample bread image",
          },
        ]}
      />

      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 font-inter">
          Current Images Data:
        </h3>
        <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-mono">
          {JSON.stringify(images, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default ImageUploader;