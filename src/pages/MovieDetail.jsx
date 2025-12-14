import React from 'react'
import { useParams } from 'react-router-dom'

export default function MovieDetail() {
  const { id } = useParams()

  return (
    <div className="py-12">
      <h1 className="text-4xl font-bold text-center">Movie Detail</h1>
      <p className="mt-4 text-center">Movie ID: {id}</p>
    </div>
  )
}
