import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import LoadingSkeleton from '../components/movie/LoadingSkeleton'
import { getPerson } from '../services/api/endpoints/person'
import { Briefcase, Calendar, Trophy, Ruler, Cake, BookOpen, Film } from 'lucide-react'

export default function PersonDetail() {
  const { id } = useParams()
  const [person, setPerson] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    async function fetchPerson() {
      if (!id) return
      setLoading(true)
      try {
        const data = await getPerson(id)
        if (!mounted) return
        setPerson(data)
      } catch (err) {
        if (!mounted) return
        setError(err.message || String(err))
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchPerson()
    return () => { mounted = false }
  }, [id])

  if (loading) return <div className="max-w-[1000px] mx-auto px-4 py-8"><LoadingSkeleton variant="large" /></div>
  if (error) return <div className="max-w-[1000px] mx-auto px-4 py-8 text-red-400">Error: {error}</div>
  if (!person) return <div className="max-w-[1000px] mx-auto px-4 py-8 text-gray-400">No person found</div>

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          {person.image && (
            <img src={person.image} alt={person.name || 'Person'} className="w-full rounded-lg object-cover" />
          )}
        </div>

        <div className="md:w-2/3">
          <h1 className="text-4xl font-bold text-white mb-4">{person.name || person.full_name}</h1>
          
          <div className="space-y-2 mb-6 space-y-6">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-yellow-400" />
              <span className="text-base text-gray-200">{person.role || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Ruler className="w-5 h-5 text-yellow-400" />
              <span className="text-base text-gray-200">{person.height || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Cake className="w-5 h-5 text-yellow-400" />
              <span className="text-base text-gray-200">Born: {person.birth_date ? new Date(person.birth_date).toLocaleDateString() : 'N/A'}</span>
            </div>
            {person.death_date && (
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-base text-gray-200">Died: {new Date(person.death_date).toLocaleDateString()}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-base text-yellow-400 font-semibold">{person.awards || 'N/A'}</span>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 text-gray-300 leading-relaxed">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-semibold">Summary</h2>
            </div>
            { person.summary ? (
              person.summary.split('\n\n').map((para, i) => (
                <p key={i} className="text-base mb-3">{para}</p>
              ))
            ) : (
              <p className="text-base mb-3 text-gray-400">N/A</p>
            ) }
          </div>
        </div>
      </div>

      {/* Known For */}
      {person.known_for && person.known_for.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-4">
            <Film className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-semibold text-white">Known For</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {person.known_for.map((m) => (
              <Link to={`/movie/${m.id}`} key={m.id} className="group bg-[#111213] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
                <div className="w-full h-52 bg-gray-800 overflow-hidden">
                  {m.image ? (
                    <img src={m.image} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                  )}
                </div>
                <div className="p-3">
                  <div className="text-white font-semibold text-sm truncate">{m.title}</div>
                  <div className="text-gray-400 text-xs mt-1">{m.year || 'N/A'}</div>
                  <div className="text-gray-300 text-xs mt-2">Role: <span className="font-medium">{m.role || 'N/A'}</span></div>
                  {m.character && <div className="text-gray-400 text-xs mt-1 truncate">as {m.character}</div>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
