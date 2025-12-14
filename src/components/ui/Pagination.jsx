import React from 'react'

export default function Pagination({ page = 1, totalPages = 0, onChange }) {
  if (!totalPages || totalPages <= 1) return null

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

  const pages = renderPageList()

  return (
    <div className="flex items-center justify-center gap-3">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        aria-label="Previous page"
        className="px-3 py-1 rounded-md bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {'<'}
      </button>

      <div className="flex items-center gap-2">
        {pages.map((item, idx) => {
          if (item === 'left-ellipsis' || item === 'right-ellipsis') {
            return (
              <span key={item + idx} className="px-2 text-gray-400">…</span>
            )
          }

          const p = item
          return (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={`px-3 py-1 rounded-md ${p === page ? 'bg-blue-600 text-white' : 'bg-gray-800 text-white'} cursor-pointer`}
            >
              {p}
            </button>
          )
        })}
      </div>

      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className="px-3 py-1 rounded-md bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {'>'}
      </button>
    </div>
  )
}
