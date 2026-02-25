import React from 'react'

const Spinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="w-12 h-12 border-4 border-zinc-700 border-t-white rounded-full animate-spin"></div>
    </div>
  )
}

export default Spinner