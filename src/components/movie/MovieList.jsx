import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import { Button } from '../ui/button';

/**
 * MovieList component - Slider hiển thị 3 phim cùng lúc, có thể slide qua toàn bộ danh sách
 * @param {Array} movies - Mảng danh sách phim (tất cả movies)
 */
export default function MovieList({ movies = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const ITEMS_PER_SLIDE = 3;
  const totalSlides = Math.ceil(movies.length / ITEMS_PER_SLIDE);

  if (!movies || movies.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center rounded-lg bg-gray-900">
        <p className="text-gray-400">Không có phim nào</p>
      </div>
    );
  }

  const handlePrevious = () => {
    if (isTransitioning || currentIndex === 0) return;
    setIsTransitioning('prev');
    setCurrentIndex((prev) => prev - 1);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const handleNext = () => {
    if (isTransitioning || currentIndex >= totalSlides - 1) return;
    setIsTransitioning('next');
    setCurrentIndex((prev) => prev + 1);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  return (
    <div className="relative mx-auto w-full max-w-[1200px]">
      {/* Slider Container */}
      <div className="relative overflow-hidden rounded-xl bg-gray-950">
        <div className="relative overflow-hidden px-4 py-8">
          {/* Slider Track - chứa tất cả movies */}
          <div
            className="flex transition-transform duration-600 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`
            }}
          >
            {/* Render từng slide (mỗi slide có 3 phim) */}
            {Array.from({ length: totalSlides }).map((_, slideIndex) => {
              const startIdx = slideIndex * ITEMS_PER_SLIDE;
              const slideMovies = movies.slice(startIdx, startIdx + ITEMS_PER_SLIDE);
              
              return (
                <div
                  key={slideIndex}
                  className="flex min-w-full gap-0"
                  style={{ width: '100%' }}
                >
                  {slideMovies.map((movie) => (
                    <div key={movie.id} className="w-1/3 flex-shrink-0 px-3">
                      <MovieCard movie={movie} variant="compact" />
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="absolute left-4 right-4 top-1/2 flex -translate-y-1/2 justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0 || isTransitioning}
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <Button
            onClick={handleNext}
            disabled={currentIndex >= totalSlides - 1 || isTransitioning}
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isTransitioning && index !== currentIndex) {
                  setIsTransitioning(index > currentIndex ? 'next' : 'prev');
                  setCurrentIndex(index);
                  setTimeout(() => setIsTransitioning(false), 600);
                }
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Counter */}
      <div className="mt-4 text-center text-sm text-gray-400">
        {currentIndex + 1} / {totalSlides}
      </div>
    </div>
  );
}
