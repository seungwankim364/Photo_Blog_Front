import { useState } from 'react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { UploadPage } from './components/UploadPage';

const initialPhotos = [
  {
    id: 1,
    title: 'Minimal Architecture',
    description: 'Calm lines and soft light.',
    imageUrls: [
      'https://images.unsplash.com/photo-1755678300059-11157219ba3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwYXJjaGl0ZWN0dXJlJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzcwMjE2OTUxfDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    date: '2026.02.03'
  },
  {
    id: 2,
    title: 'Mountain Light',
    description: 'A quiet ridge in the afternoon.',
    imageUrls: [
      'https://images.unsplash.com/photo-1600257729950-13a634d32697?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBsYW5kc2NhcGUlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzcwMjAxMTczfDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    date: '2026.02.02'
  },
  {
    id: 3,
    title: 'Coffee Break',
    description: 'A slow moment with a warm cup.',
    imageUrls: [
      'https://images.unsplash.com/photo-1599070638980-a609b4ec10fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBjdXAlMjBtaW5pbWFsfGVufDF8fHx8MTc3MDI1ODQ0NHww&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    date: '2026.02.01'
  },
  {
    id: 4,
    title: 'Ocean Sunset',
    description: 'Evening waves and fading light.',
    imageUrls: [
      'https://images.unsplash.com/photo-1604580826271-aa59d10b875a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvY2VhbiUyMHdhdmVzJTIwc3Vuc2V0fGVufDF8fHx8MTc3MDI2MjU2OHww&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    date: '2026.01.30'
  },
  {
    id: 5,
    title: 'City Street',
    description: 'Everyday movement and rhythm.',
    imageUrls: [
      'https://images.unsplash.com/photo-1762436933065-fe6d7f51d4f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc3RyZWV0JTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzcwMjcyNzk0fDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    date: '2026.01.28'
  },
  {
    id: 6,
    title: 'Forest Calm',
    description: 'Still air under tall trees.',
    imageUrls: [
      'https://images.unsplash.com/photo-1641975156937-9ed56d1a426f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3Jlc3QlMjB0cmVlcyUyMG5hdHVyZXxlbnwxfHx8fDE3NzAyNjkyNzR8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    date: '2026.01.25'
  }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState('main');
  const [photos, setPhotos] = useState(initialPhotos);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const handleUpload = (newPhoto) => {
    const photo = {
      ...newPhoto,
      id: Date.now()
    };
    setPhotos([photo, ...photos]);
    setSelectedPhotoIndex(0);
    setCurrentPage('main');
  };

  if (currentPage === 'upload') {
    return <UploadPage onUpload={handleUpload} onBack={() => setCurrentPage('main')} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
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

      {/* Photo Grid */}
      <main className="max-w-5xl mx-auto px-4 py-16">
        <div
          className="grid grid-cols-3 gap-8"
          style={{ marginLeft: 'auto', marginRight: 'auto' }}
        >
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
                style={{ width: '100%', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <ImageWithFallback
                  src={photo.imageUrls[0]}
                  alt={photo.title}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ width: '100%', height: '100%' }}
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

      {/* Modal */}
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
                {selectedPhoto.imageUrls.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setSelectedPhotoIndex((prev) =>
                          prev === 0 ? selectedPhoto.imageUrls.length - 1 : prev - 1
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
                          prev === selectedPhoto.imageUrls.length - 1 ? 0 : prev + 1
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
                  src={selectedPhoto.imageUrls[selectedPhotoIndex]}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-contain"
                />
                <div className="absolute bottom-4 right-6 text-xs text-gray-500 bg-white/80 rounded px-2 py-1">
                  {selectedPhotoIndex + 1}/{selectedPhoto.imageUrls.length}
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
