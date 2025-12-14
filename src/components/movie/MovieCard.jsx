import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * MovieCard component - Hiển thị thông tin cơ bản của phim
 * @param {Object} movie - Đối tượng phim từ API
 * @param {string} variant - Kiểu hiển thị: 'large' (cho top5) hoặc 'compact' (cho popular/top-rate)
 */
export default function MovieCard({ movie, variant = 'compact' }) {
  if (!movie) return null;

  const isLarge = variant === 'large';

  return (
    <Link to={`/movie/${movie.id}`} className="group block">
      <div
        className={`relative overflow-visible transition-all duration-300 hover:scale-110 hover:z-30 ${
          isLarge ? 'w-full max-w-md h-[610px]' : 'w-full max-w-xs h-[480px]'
        }`}
      >
      <div className="relative h-full w-full overflow-hidden rounded-lg bg-gray-900 shadow-lg transition-all duration-300 hover:shadow-2xl">
        {/* Movie Poster - Full height */}
        <div className="relative h-full overflow-hidden">
          <img
            src={movie.image}
            alt={movie.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent group-hover:opacity-0 transition-opacity duration-300" />

          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-yellow-500/90 px-3 py-1 backdrop-blur-sm">
            <Star className="h-4 w-4 fill-current text-white" />
            <span className="text-sm font-bold text-white">{movie.rate}</span>
          </div>
        </div>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="relative h-full w-full rounded-lg bg-gradient-to-t from-gray-900/80 via-transparent to-transparent flex flex-col justify-end p-4 pointer-events-auto">
          {/* Title & Year */}
          <h3 className={`font-bold text-white line-clamp-2 ${isLarge ? 'text-xl' : 'text-lg'}`}>
            {movie.title}
          </h3>
          <p className="text-sm text-gray-300 mt-1">Year: {movie.year}</p>

          {/* Genres */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {movie.genres.slice(0, 3).map((genre, index) => (
                <span
                  key={index}
                  className="rounded-full bg-gray-800/80 px-3 py-1 text-xs font-medium text-gray-200"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {/* Short Description */}
          { movie.short_description && (
            <p className="mt-3 text-xs text-gray-200 line-clamp-3">
              {movie.short_description}
            </p>
          )}

          {/* Box Office - Large variant */}
          {isLarge && movie.box_office_revenue && (
            <p className="mt-3 text-sm text-gray-200">
              Box Office: <span className="font-semibold text-green-400">{movie.box_office_revenue}</span>
            </p>
          )}
        </div>
      </div>
      </div>
    </Link>
  );
}
