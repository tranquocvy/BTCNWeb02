import { Star } from 'lucide-react';

/**
 * MovieCard component - Hiển thị thông tin cơ bản của phim
 * @param {Object} movie - Đối tượng phim từ API
 * @param {string} variant - Kiểu hiển thị: 'large' (cho hero/top5) hoặc 'compact' (cho popular/top-rate)
 */
export default function MovieCard({ movie, variant = 'compact' }) {
  if (!movie) return null;

  const isLarge = variant === 'large';

  return (
    <div
      className={`group relative overflow-hidden rounded-lg bg-gray-900 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:z-10 ${
        isLarge ? 'max-w-md' : 'max-w-xs'
      }`}
    >
      {/* Movie Poster */}
      <div className={`relative overflow-hidden ${isLarge ? 'h-96' : 'h-72'}`}>
        <img
          src={movie.image}
          alt={movie.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-yellow-500/90 px-3 py-1 backdrop-blur-sm">
          <Star className="h-4 w-4 fill-current text-white" />
          <span className="text-sm font-bold text-white">{movie.rate}</span>
        </div>
      </div>

      {/* Movie Info */}
      <div className={`p-4 ${isLarge ? 'space-y-3' : 'space-y-2'}`}>
        {/* Title & Year */}
        <div>
          <h3
            className={`font-bold text-white line-clamp-2 ${
              isLarge ? 'text-xl' : 'text-lg'
            }`}
          >
            {movie.title}
          </h3>
          <p className="text-sm text-gray-400">{movie.year}</p>
        </div>

        {/* Genres */}
        {movie.genres && movie.genres.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {movie.genres.slice(0, isLarge ? 3 : 2).map((genre, index) => (
              <span
                key={index}
                className="rounded-full bg-gray-800 px-3 py-1 text-xs font-medium text-gray-300"
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        {/* Short Description - Show on hover for compact, always for large */}
        {isLarge && movie.short_description && (
          <p className="text-sm text-gray-400 line-clamp-3">
            {movie.short_description}
          </p>
        )}

        {/* Short Description - Compact variant: show on hover only */}
        {!isLarge && movie.short_description && (
          <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:max-h-40 group-hover:opacity-100">
            <p className="mt-2 text-xs text-gray-400 line-clamp-3">
              {movie.short_description}
            </p>
          </div>
        )}

        {/* Box Office - Large variant: show on hover only */}
        {isLarge && movie.box_office_revenue && (
          <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:max-h-20 group-hover:opacity-100">
            <p className="text-xs text-gray-500">
              Box Office: <span className="font-semibold text-gray-300">{movie.box_office_revenue}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
