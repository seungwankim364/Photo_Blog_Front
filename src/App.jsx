import { useState, useEffect } from 'react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { UploadPage } from './components/UploadPage';

function normalizePhoto(photo, index = 0) {
  const paths = Array.isArray(photo.path)
    ? photo.path
    : photo.path
      ? [photo.path]
      : [];

  const idSource = photo.id ?? photo._id;
  const id =
    typeof idSource === 'string'
      ? idSource
      : idSource && typeof idSource.toString === 'function'
        ? idSource.toString()
        : `${paths[0] ?? 'photo'}-${photo.date ?? 'no-date'}-${index}`;

  return {
    ...photo,
    id,
    paths,
  };
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('main');
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  useEffect(() => {
    fetch('http://localhost:3000/upload')
      .then((res) => res.json())
      .then((data) => {
        const normalized = data.map((photo, index) => normalizePhoto(photo, index));
        setPhotos(normalized);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleUpload = async ({ title, description, date, files }) => {
    const uploadRequests = files.map(async (file) => {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('date', date);

      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed (${response.status})`);
      }

      const payload = await response.json();
      return payload.photo;
    });

    try {
      const uploaded = await Promise.all(uploadRequests);
      const normalizedUploaded = uploaded.map((photo, index) => normalizePhoto(photo, index));
      setPhotos((prev) => [...normalizedUploaded, ...prev]);
      setSelectedPhotoIndex(0);
      setCurrentPage('main');
    } catch (err) {
      console.error(err);
      alert('Upload failed. Please try again.');
    }
  };

  if (currentPage === 'upload') {
    return <UploadPage onUpload={handleUpload} onBack={() => setCurrentPage('main')} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="py-12 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl tracking-tight mb-2">Wani Journal</h1>
            <p className="text-sm text-gray-500">Daily moments, captured simply.</p>
          </div>
          <button
            onClick={() => setCurrentPage('upload')}
            className="text-sm text-gray-400 hover:text-black transition-colors"
          >
            + Add Photo
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-3 gap-8" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
          {photos.map((photo) => (
            <article
              key={photo.id}
              className="group cursor-pointer flex flex-col items-center"
              style={{ width: '100%' }}
              onClick={() => {
                setSelectedPhoto(photo);
                setSelectedPhotoIndex(0);
              }}
            >
              <div
                className="overflow-hidden bg-gray-50 mb-4 rounded-xl border border-gray-100"
                style={{
                  width: '100%',
                  height: '220px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ImageWithFallback
                  src={`http://localhost:3000/${photo.paths[0] ?? ''}`}
                  alt={photo.originalName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1 w-full text-center">
                <h2 className="text-base font-medium">{photo.title}</h2>
                <p className="text-xs text-gray-500">{photo.description}</p>
                <time className="text-xs text-gray-400 block">{photo.date}</time>
              </div>
            </article>
          ))}
        </div>
      </main>

      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white p-8 space-y-6 rounded-xl relative">
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute right-4 top-4 text-gray-400 hover:text-black transition-colors leading-none"
                aria-label="Close"
              >
                X
              </button>

              <div className="relative bg-gray-50 rounded-xl px-12 py-6 h-[70vh] max-h-[70vh] flex items-center justify-center">
                {selectedPhoto.paths.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setSelectedPhotoIndex((prev) =>
                          prev === 0 ? selectedPhoto.paths.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors leading-none"
                      aria-label="Previous photo"
                    >
                      {'<'}
                    </button>
                    <button
                      onClick={() =>
                        setSelectedPhotoIndex((prev) =>
                          prev === selectedPhoto.paths.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors leading-none"
                      aria-label="Next photo"
                    >
                      {'>'}
                    </button>
                  </>
                )}
                <ImageWithFallback
                  src={`http://localhost:3000/${selectedPhoto.paths[selectedPhotoIndex] ?? ''}`}
                  alt={selectedPhoto.originalName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 right-6 text-xs text-gray-500 bg-white/80 rounded px-2 py-1">
                  {selectedPhotoIndex + 1}/{Math.max(selectedPhoto.paths.length, 1)}
                </div>
              </div>

              <div className="space-y-2 text-center">
                <h2 className="text-xl font-semibold">{selectedPhoto.title}</h2>
                <p className="text-gray-600 text-sm">{selectedPhoto.description}</p>
                <time className="text-sm text-gray-400">{selectedPhoto.date}</time>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
