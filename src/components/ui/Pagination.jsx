import React from 'react'

export default function Pagination({ page = 1, totalPages = 0, onChange, totalItems = null, pageSize = null }) {
  const showControls = totalPages && totalPages > 1
  const showSummary = typeof totalItems === 'number' && typeof pageSize === 'number'

  const handlePageChange = (newPage) => {
    if (newPage === page || newPage < 1 || newPage > totalPages) return
    onChange(newPage)
  }

  if (!showControls && !showSummary) return null

  function renderPageList() {
    const maxButtons = 7
    if (totalPages <= maxButtons) {
      return Array.from({ length: totalPages }).map((_, i) => i + 1)
    }

    if (page <= 4) {
      return [1, 2, 3, 4, 5, 'right-ellipsis', totalPages]
    }

    if (page >= totalPages - 3) {
      return [1, 'left-ellipsis', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    }

    return [1, 'left-ellipsis', page - 1, page, page + 1, 'right-ellipsis', totalPages]
  }

  const pages = showControls ? renderPageList() : []

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Summary line above controls */}
      {showSummary && totalItems > 0 && (
        <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          Showing <span className="font-semibold">{Math.min((page - 1) * pageSize + 1, totalItems)}</span> to <span className="font-semibold">{Math.min(page * pageSize, totalItems)}</span> of <span className="font-semibold">{totalItems}</span>
        </div>
      )}

      {/* Controls */}
      {showControls && (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            aria-label="First page"
            onClick={() => handlePageChange(1)}
            disabled={page <= 1}
            className="px-2 py-1 rounded-md bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {'<<'}
          </button>

          <button
            type="button"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
            className="px-3 py-1 rounded-md bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {'<' }
          </button>

          <div className="flex items-center gap-2">
            {pages.map((item, idx) => {
              if (item === 'left-ellipsis' || item === 'right-ellipsis') {
                return (
                  <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">…</span>
                )
              }

              const p = item
              return (
                <button
                  type="button"
                  key={`page-${p}`}
                  onClick={() => handlePageChange(p)}
                  className={`px-3 py-1 rounded-md ${p === page ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-white'} cursor-pointer`}
                >
                  {p}
                </button>
              )
            })}
          </div>

          <button
            type="button"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
            className="px-3 py-1 rounded-md bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {'>'}
          </button>
          <button
            type="button"
            aria-label="Last page"
            onClick={() => handlePageChange(totalPages)}
            disabled={page >= totalPages}
            className="px-2 py-1 rounded-md bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {'>>'}
          </button>
        </div>
      )}
    </div>
  )
}
