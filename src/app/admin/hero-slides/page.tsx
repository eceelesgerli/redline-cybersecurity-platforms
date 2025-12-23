'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Plus, Trash2, Edit2, GripVertical, Save, X, Upload } from 'lucide-react';

interface Slide {
  _id: string;
  imageUrl: string;
  cloudinaryId: string;
  title: string;
  order: number;
  isActive: boolean;
}

export default function HeroSlidesPage() {
  const router = useRouter();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const res = await fetch('/api/hero-slides');
      const data = await res.json();
      setSlides(data.slides || []);
    } catch (error) {
      console.error('Error fetching slides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('title', newTitle);
      formData.append('order', String(slides.length));

      const res = await fetch('/api/hero-slides', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        await fetchSlides();
        setShowUploadForm(false);
        setNewTitle('');
        setSelectedFile(null);
        setPreviewUrl(null);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;

    try {
      const res = await fetch(`/api/hero-slides/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchSlides();
      } else {
        alert('Failed to delete slide');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete slide');
    }
  };

  const handleUpdateTitle = async (id: string) => {
    try {
      const formData = new FormData();
      formData.append('title', editTitle);

      const res = await fetch(`/api/hero-slides/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (res.ok) {
        await fetchSlides();
        setEditingId(null);
        setEditTitle('');
      } else {
        alert('Failed to update slide');
      }
    } catch (error) {
      console.error('Error updating:', error);
      alert('Failed to update slide');
    }
  };

  const startEditing = (slide: Slide) => {
    setEditingId(slide._id);
    setEditTitle(slide.title);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyber-red"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Hero Slides</h1>
          <p className="text-gray-600 mt-1">Manage the carousel images on the homepage</p>
        </div>
        <button
          onClick={() => setShowUploadForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Slide
        </button>
      </div>

      {/* Upload Form Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Add New Slide</h2>
              <button
                onClick={() => {
                  setShowUploadForm(false);
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  setNewTitle('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {previewUrl ? (
                    <div className="relative">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        width={300}
                        height={200}
                        className="mx-auto rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <span className="text-gray-500">Click to upload image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Title (Optional)</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="input-field"
                  placeholder="Enter slide title"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadForm(false);
                    setSelectedFile(null);
                    setPreviewUrl(null);
                    setNewTitle('');
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedFile || uploading}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Slides Grid */}
      {slides.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
          <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">No Slides Yet</h3>
          <p className="text-gray-500 mb-4">Upload images to display in the hero carousel</p>
          <button
            onClick={() => setShowUploadForm(true)}
            className="btn-primary"
          >
            Add First Slide
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slides.map((slide, index) => (
            <div
              key={slide._id}
              className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-cyber-red transition-colors"
            >
              <div className="relative h-48">
                <Image
                  src={slide.imageUrl}
                  alt={slide.title || `Slide ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  #{index + 1}
                </div>
              </div>

              <div className="p-4">
                {editingId === slide._id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="input-field flex-1 !py-2"
                      placeholder="Enter title"
                    />
                    <button
                      onClick={() => handleUpdateTitle(slide._id)}
                      className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditTitle('');
                      }}
                      className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="font-medium truncate">
                      {slide.title || 'Untitled'}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditing(slide)}
                        className="p-2 text-gray-500 hover:text-cyber-red transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(slide._id)}
                        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-bold mb-2">Tips:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Recommended image size: 800x600 pixels</li>
          <li>• Supported formats: JPG, PNG, WebP</li>
          <li>• Images are automatically optimized for web</li>
          <li>• Maximum 5 slides recommended for best performance</li>
        </ul>
      </div>
    </div>
  );
}
