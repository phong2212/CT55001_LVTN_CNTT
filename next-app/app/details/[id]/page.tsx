'use client'
import React from 'react'

const DetailsPage = ({ params }: { params: { id: string } }) => {
  return (
    <div>DetailsPage of {params.id}</div>
  )
}

export default DetailsPage