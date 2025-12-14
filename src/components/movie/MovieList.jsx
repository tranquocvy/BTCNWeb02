import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import { Button } from '../ui/button';

/**
 * MovieList component - Hiển thị danh sách phim dạng grid 3 cột với pagination
 * @param {Array} movies - Mảng danh sách phim
 * @param {number} itemsPerPage - Số phim hiển thị mỗi trang (mặc định 3)
 */
export default function MovieList({ movies = [], itemsPerPage = 3 }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Chia movies thành các chunk (mỗi chunk = 1 trang)
  const pages = useMemo(() => {
    if (!movies || movies.length === 0) return [];
    
    const chunks = [];
    for (let i = 0; i < movies.length; i += itemsPerPage) {
      chunks.push(movies.slice(i, i + itemsPerPage));
    }
    return chunks;
  }, [movies, itemsPerPage]);

  const totalPages = pages.length;
  const currentMovies = pages[currentPage] || [];

  if (!movies || movies.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center rounded-lg bg-gray-900">
        <p className="text-gray-400">Không có phim nào</p>
      </div>
    );
  }

  const handlePrevious = () => {
    if (isTransitioning || currentPage === 0) return;
    setIsTransitioning(true);
    setCurrentPage((prev) => prev - 1);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handleNext = () => {
    if (isTransitioning || currentPage === totalPages - 1) return;
    setIsTransitioning(true);
    setCurrentPage((prev) => prev + 1);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  return (
    <div className="space-y-6">
      {/* Movie Grid with Slide Animation */}
      <div className="relative overflow-hidden">
        <div
          className={`grid grid-cols-1 gap-6 transition-all duration-500 md:grid-cols-2 lg:grid-cols-3 ${
            isTransitioning ? 'translate-x-8 opacity-0' : 'translate-x-0 opacity-100'
          }`}
        >
          {currentMovies.map((movie) => (
            <div key={movie.id} className="flex justify-center">
              <MovieCard movie={movie} variant="compact" />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={handlePrevious}
          disabled={currentPage === 0 || isTransitioning}
          variant="outline"
          className="flex items-center gap-2 rounded-lg bg-gray-800 px-6 py-3 text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Previous</span>
        </Button>

        <div className="text-sm text-gray-400">
          <span className="font-bold text-white">{currentPage + 1}</span> / {totalPages}
        </div>

        <Button
          onClick={handleNext}
          disabled={currentPage === totalPages - 1 || isTransitioning}
          variant="outline"
          className="flex items-center gap-2 rounded-lg bg-gray-800 px-6 py-3 text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span>Next</span>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Page Indicators */}
      <div className="flex justify-center gap-2">
        {pages.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isTransitioning && index !== currentPage) {
                setIsTransitioning(true);
                setCurrentPage(index);
                setTimeout(() => setIsTransitioning(false), 500);
              }
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentPage ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to page ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
