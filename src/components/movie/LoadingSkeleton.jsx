export default function LoadingSkeleton({ variant = 'compact' }) {
  const isLarge = variant === 'large'

  return (
    <div
      className={`animate-pulse ${isLarge ? 'w-full max-w-md h-[610px]' : 'w-full max-w-xs h-[480px]'}`}
    >
      <div className="h-full w-full rounded-lg overflow-hidden bg-gray-800">
        {/* Poster area */}
        <div className={`${isLarge ? 'h-96' : 'h-72'} w-full bg-gray-700`} />

        {/* Info area */}
        <div className="p-4">
          <div className="h-5 w-3/4 rounded bg-gray-700 mb-3" />
          <div className="h-4 w-1/4 rounded bg-gray-700 mb-4" />

          <div className="flex gap-2 mb-3">
            <div className="h-6 w-20 rounded bg-gray-700" />
            <div className="h-6 w-16 rounded bg-gray-700" />
          </div>

          <div className="h-12 w-full rounded bg-gray-700" />
        </div>
      </div>
    </div>
  )
}
