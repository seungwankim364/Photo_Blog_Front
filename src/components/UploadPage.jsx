import { useState } from 'react';

export function UploadPage({ onUpload, onBack }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);

    if (!files.length) {
      setImagePreviews([]);
      return;
    }

    const previews = await Promise.all(
      files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
          })
      )
    );

    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !date || !selectedFiles.length) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onUpload({
        title,
        description,
        date,
        files: selectedFiles,
      });

      setTitle('');
      setDescription('');
      setDate('');
      setSelectedFiles([]);
      setImagePreviews([]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 p-8 z-10 flex items-center justify-between">
        <h1 className="text-lg">Wani Journal</h1>
        <button
          onClick={onBack}
          className="text-sm text-gray-400 hover:text-black transition-colors"
          disabled={isSubmitting}
        >
          Back
        </button>
      </header>

      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <h2 className="text-2xl text-center">Upload Photo</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label className="block text-sm text-gray-600">Photos</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                multiple
                disabled={isSubmitting}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 file:cursor-pointer"
                required
              />

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={`${preview}-${index}`}
                      className="w-full aspect-square overflow-hidden bg-gray-50"
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label className="block text-sm text-gray-600">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
                placeholder="Enter photo title"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm text-gray-600">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors resize-none"
                rows={3}
                placeholder="Enter a short description"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm text-gray-600">Date</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
                placeholder="2026.02.11"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-70"
            >
              {isSubmitting ? 'Uploading...' : 'Upload'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
