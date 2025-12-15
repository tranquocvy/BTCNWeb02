import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import { Button } from '../ui/button';

/**
 * HeroSlide component - Slider hiển thị 1 phim lớn tại một thời điểm
 * @param {Array} movies - Mảng danh sách phim
 */
export default function HeroSlide({ movies = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  if (!movies || movies.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center rounded-lg bg-gray-900">
        <p className="text-gray-400">No movies available</p>
      </div>
    );
  }

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const currentMovie = movies[currentIndex];

  return (
    <div className="relative mx-auto w-full max-w-[1200px]">
      {/* Hero Slide Container */}
      <div className="relative rounded-xl shadow-2xl">
        {/* Background Image with Blur */}
        <div className="absolute inset-0">
          <img
            src={currentMovie.image}
            alt=""
            className="h-full w-full object-cover blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-b via-gray-10 to-gray-10" />
        </div>

        {/* Content - Centered Movie Card */}
        <div className="relative flex items-center justify-center p-8 md:p-12">
          {/* Movie Card with Fade Animation */}
          <div
            className={`transition-opacity duration-700 ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <MovieCard movie={currentMovie} variant="large" />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="absolute left-1 right-1 top-1/2 flex -translate-y-1/2 justify-between">
          <Button
            onClick={handlePrev}
            disabled={isTransitioning}
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70 hover:scale-110 disabled:opacity-50"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <Button
            onClick={handleNext}
            disabled={isTransitioning}
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70 hover:scale-110 disabled:opacity-50"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          {movies.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isTransitioning) {
                  setIsTransitioning(true);
                  setCurrentIndex(index);
                  setTimeout(() => setIsTransitioning(false), 500);
                }
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Counter */}
      <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-200">
        {currentIndex + 1} / {movies.length}
      </div>
    </div>
  );
}
