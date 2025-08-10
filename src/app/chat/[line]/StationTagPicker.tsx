'use client'

import { useState } from 'react'
import { getStationsForLine } from '@/lib/metro-data'

interface StationTagPickerProps {
  value?: string | null
  onChange: (v: string | null) => void
  lineName: string
  className?: string
}

export default function StationTagPicker({ value, onChange, lineName, className = '' }: StationTagPickerProps) {
  const [open, setOpen] = useState(false)
  const stations = getStationsForLine(lineName)
  
  return (
    <div className={`relative inline-block ${className}`}>
      <button 
        type="button" 
        onClick={() => setOpen((s) => !s)} 
        className="hidden text-xs px-3 py-2 rounded-md border bg-white hover:bg-gray-50 transition-colors flex items-center gap-2"
      >
        <span className="text-blue-600">📍</span>
        {value ? value : 'İstasyon seç'}
      </button>
      
      {open && (
        <div className="absolute z-20 mt-1 w-64 bg-white rounded-md shadow-lg border p-3 max-h-80 overflow-auto">
          <div className="mb-2 text-sm font-medium text-gray-700 border-b pb-2">
            {lineName} İstasyonları
          </div>
          
          <button 
            className="w-full text-left text-xs px-2 py-2 hover:bg-gray-50 rounded text-red-600 font-medium" 
            onClick={() => { onChange(null); setOpen(false) }}
          >
            ❌ İstasyon kaldır
          </button>
          
          <div className="my-2 border-t" />
          
          <div className="grid grid-cols-1 gap-1">
            {stations.map((station) => (
              <button 
                key={station} 
                className={`w-full text-left text-sm px-3 py-2 hover:bg-blue-50 rounded transition-colors ${
                  value === station ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'
                }`}
                onClick={() => { onChange(station); setOpen(false) }}
              >
                {station}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


