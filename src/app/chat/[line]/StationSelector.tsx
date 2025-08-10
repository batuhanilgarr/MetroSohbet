'use client'

import { useState } from 'react'
import { getStationsForLine, getLinesForStation } from '@/lib/metro-data'

interface StationSelectorProps {
  currentLine: string
  currentStation: string | null
  onStationChange: (station: string | null) => void
  onLineChange: (lineName: string) => void
  className?: string
}

export default function StationSelector({ 
  currentLine, 
  currentStation, 
  onStationChange, 
  onLineChange,
  className = '' 
}: StationSelectorProps) {
  const [showStationPicker, setShowStationPicker] = useState(false)
  const [showLinePicker, setShowLinePicker] = useState(false)
  const stations = getStationsForLine(currentLine)
  
  const handleStationSelect = (station: string | null) => {
    onStationChange(station)
    setShowStationPicker(false)
  }
  
  const handleLineSelect = (lineName: string) => {
    onLineChange(lineName)
    onStationChange(null) // İstasyon seçimini sıfırla
    setShowLinePicker(false)
  }
  
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Hat Seçici */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowLinePicker(!showLinePicker)}
          className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-between"
        >
          <span className="font-medium">🚇 {currentLine}</span>
          <span className="text-sm">▼</span>
        </button>
        
        {showLinePicker && (
          <div className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-xl border p-3 max-h-80 overflow-auto">
            <div className="mb-3 text-sm font-medium text-gray-700 border-b pb-2">
              Metro Hattı Seç
            </div>
            <div className="grid grid-cols-1 gap-2">
              {['M1A', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'Marmaray'].map((line) => (
                <button
                  key={line}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    line === currentLine 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                  onClick={() => handleLineSelect(line)}
                >
                  {line}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* İstasyon Seçici */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowStationPicker(!showStationPicker)}
          className={`w-full px-4 py-3 rounded-lg border transition-all flex items-center justify-between ${
            currentStation 
              ? 'bg-green-50 border-green-300 text-green-700' 
              : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
          }`}
        >
          <span className="font-medium">
            {currentStation ? `📍 ${currentStation}` : '📍 İstasyon Seç (Opsiyonel)'}
          </span>
          <span className="text-sm">▼</span>
        </button>
        
        {showStationPicker && (
          <div className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-xl border p-3 max-h-80 overflow-auto">
            <div className="mb-3 text-sm font-medium text-gray-700 border-b pb-2">
              {currentLine} İstasyonları
            </div>
            
            <button
              className="w-full text-left px-3 py-2 hover:bg-red-50 rounded-md text-red-600 font-medium mb-2"
              onClick={() => handleStationSelect(null)}
            >
              ❌ İstasyon Kaldır
            </button>
            
            <div className="border-t pt-2">
              <div className="grid grid-cols-1 gap-1">
                {stations.map((station) => (
                  <button
                    key={station}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      station === currentStation 
                        ? 'bg-green-100 text-green-700 font-medium' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                    onClick={() => handleStationSelect(station)}
                  >
                    {station}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Bilgi Kartı */}
      {currentStation && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-sm text-blue-800">
            <div className="font-medium mb-1">📍 {currentStation} İstasyonu</div>
            <div className="text-xs">
              Bu istasyonda bulunan kullanıcılarla sohbet ediyorsunuz.
              İstasyon değiştirmek için yukarıdaki seçiciyi kullanın.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
