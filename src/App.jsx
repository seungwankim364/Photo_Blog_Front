import { useState, useEffect } from 'react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { UploadPage } from './components/UploadPage';
import { AuthPage } from './components/AuthPage';
import { API_BASE_URL, buildApiUrl, parseJsonOrThrow } from './utils/api';

function normalizePhoto(photo, index = 0) {
  const paths = Array.isArray(photo.urls)
    ? photo.urls
    : photo.urls
      ? [photo.urls]
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
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('token') || '');

  useEffect(() => {
    if (!authToken) {
      setPhotos([]);
      return;
    }

    fetch(buildApiUrl('/upload'), {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then(async (res) => {
        if (res.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setAuthToken('');
          setCurrentPage('auth');
          throw new Error('Session expired. Please log in again.');
        }
        return parseJsonOrThrow(res, 'Failed to load photos');
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        const normalized = list.map((photo, index) => normalizePhoto(photo, index));
        setPhotos(normalized);
      })
      .catch((err) => {
        console.error(err);
        alert(err.message || 'Failed to load photos');
      });
  }, [authToken]);

  const handleAuthSuccess = (payload) => {
    localStorage.setItem('token', payload.token);
    localStorage.setItem('user', JSON.stringify(payload.user));
    setAuthToken(payload.token);
    setCurrentPage('main');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthToken('');
    setPhotos([]);
    setCurrentPage('main');
    setSelectedPhoto(null);
    setSelectedPhotoIndex(0);
  };

  const handleUpload = async ({ title, description, date, files }) => {
    if (!authToken) {
      setCurrentPage('auth');
      return;
    }

    const uploadRequests = files.map(async (file) => {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('date', date);

      const response = await fetch(buildApiUrl('/upload'), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (response.status === 401) {
        handleLogout();
        throw new Error('Session expired. Please log in again.');
      }

      const payload = await parseJsonOrThrow(response, 'Upload failed');
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
      alert(err.message || 'Upload failed. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!authToken) {
      setCurrentPage('auth');
      return;
    }

    try {
      const response = await fetch(buildApiUrl(`/upload/${id}`), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 401) {
        handleLogout();
        throw new Error('Session expired. Please log in again.');
      }

      await parseJsonOrThrow(response, 'Delete failed');

      setPhotos((prev) => prev.filter((photo) => photo.id !== id));

      if (selectedPhoto?.id === id) {
        setSelectedPhoto(null);
        setSelectedPhotoIndex(0);
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Delete failed. Please try again.');
    }
  };

  if (!authToken || currentPage === 'auth') {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

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
          <div className="flex flex-col items-end gap-1">
            <button
              onClick={() => setCurrentPage('upload')}
              className="text-sm text-gray-400 hover:text-black transition-colors"
            >
              + Add Photo
            </button>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-400 hover:text-black transition-colors"
            >
              - Logout
            </button>
          </div>
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
                  src={photo.urls ?? ''}
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

              <button
                onClick={() => handleDelete(selectedPhoto.id)}
                className="absolute left-4 top-4 text-sm text-red-500 hover:text-red-700 transition-colors"
              >
                Delete
              </button>

              <div className="relative bg-gray-50 rounded-xl px-12 py-6 h-[70vh] max-h-[70vh] flex items-center justify-center">
                {selectedPhoto.urls.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setSelectedPhotoIndex((prev) =>
                          prev === 0 ? selectedPhoto.urls.length - 1 : prev - 1
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
                          prev === selectedPhoto.urls.length - 1 ? 0 : prev + 1
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
                  src={selectedPhoto.urls[selectedPhotoIndex] ?? ''}
                  alt={selectedPhoto.originalName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 right-6 text-xs text-gray-500 bg-white/80 rounded px-2 py-1">
                  {selectedPhotoIndex + 1}/{Math.max(selectedPhoto.urls.length, 1)}
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
