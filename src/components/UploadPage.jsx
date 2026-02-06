import { useState } from 'react';

export function UploadPage({ onUpload, onBack }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files || []);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && description && date && imagePreviews.length) {
      onUpload({
        title,
        description,
        imageUrls: imagePreviews,
        date
      });
      // Reset form
      setTitle('');
      setDescription('');
      setDate('');
      setImagePreviews([]);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 p-8 z-10 flex items-center justify-between">
        <h1 className="text-lg">Wani Journal</h1>
        <button
          onClick={onBack}
          className="text-sm text-gray-400 hover:text-black transition-colors"
        >
          돌아가기
        </button>
      </header>

      {/* Upload Form */}
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <h2 className="text-2xl text-center">새 사진 추가</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-3">
              <label className="block text-sm text-gray-600">사진</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                multiple
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

            {/* Title */}
            <div className="space-y-3">
              <label className="block text-sm text-gray-600">제목</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
                placeholder="사진 제목을 입력하세요"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-3">
              <label className="block text-sm text-gray-600">설명</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors resize-none"
                rows={3}
                placeholder="사진 설명을 입력하세요"
                required
              />
            </div>

            {/* Date */}
            <div className="space-y-3">
              <label className="block text-sm text-gray-600">날짜</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-gray-400 transition-colors"
                placeholder="2026.02.05"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-black text-white hover:bg-gray-800 transition-colors"
            >
              업로드
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
