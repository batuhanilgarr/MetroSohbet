'use client'

import { useState, useEffect, useCallback } from 'react'
import { debounce } from 'lodash'

interface ValidationResult {
  ok: boolean
  reason?: string
  message?: string
  suggestions?: string[]
}

interface NicknameInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (value: string) => void
  onCancel: () => void
  initialValue?: string
}

export default function NicknameInput({ value, onChange, onSubmit, onCancel, initialValue = '' }: NicknameInputProps) {
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Debounced validation function
  const validateNickname = useCallback(
    debounce(async (nickname: string) => {
      if (!nickname.trim()) {
        setValidationResult(null)
        return
      }

      setIsValidating(true)
      try {
        const response = await fetch('/api/nickname/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nickname })
        })
        
        const result = await response.json()
        setValidationResult(result)
      } catch (error) {
        setValidationResult({
          ok: false,
          reason: 'network',
          message: 'Bağlantı hatası'
        })
      } finally {
        setIsValidating(false)
      }
    }, 300),
    []
  )

  // Validate on value change
  useEffect(() => {
    validateNickname(value)
  }, [value, validateNickname])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validationResult?.ok && value.trim()) {
      onSubmit(value.trim())
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion)
    setShowSuggestions(false)
  }

  const getStatusIcon = () => {
    if (isValidating) return '⏳'
    if (!validationResult) return '💭'
    if (validationResult.ok) return '✅'
    return '❌'
  }

  const getStatusColor = () => {
    if (isValidating) return 'text-yellow-600'
    if (!validationResult) return 'text-gray-400'
    if (validationResult.ok) return 'text-green-600'
    return 'text-red-600'
  }

  const getStatusMessage = () => {
    if (isValidating) return 'Kontrol ediliyor...'
    if (!validationResult) return 'Nickname girin'
    return validationResult.message || 'Bilinmeyen durum'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Sohbete katılmak için bir kullanıcı adı seç</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kullanıcı Adı
            </label>
            <div className="relative">
              <input
                type="text"
                value={value}
                onChange={(e) => {
                  const v = e.target.value
                  if (v.length <= 20 && /^\w*$/.test(v)) {
                    onChange(v)
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                placeholder="ornek_kullanici"
                autoFocus
              />
              <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-lg ${getStatusColor()}`}>
                {getStatusIcon()}
              </div>
            </div>
            
            {/* Status message */}
            <div className={`mt-2 text-sm ${getStatusColor()}`}>
              {getStatusMessage()}
            </div>

            {/* Character count */}
            <div className="mt-1 text-xs text-gray-500 text-right">
              {value.length}/20
            </div>
          </div>

          {/* Suggestions */}
          {validationResult?.suggestions && validationResult.suggestions.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Öneriler
              </label>
              <div className="flex flex-wrap gap-2">
                {validationResult.suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Format requirements */}
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            <p className="font-medium mb-1">Gereksinimler:</p>
            <ul className="space-y-1">
              <li>• 3-20 karakter uzunluğunda</li>
              <li>• Sadece harf, rakam ve alt çizgi (_)</li>
              <li>• Yasaklı kelimeler içeremez</li>
              <li>• Engellenmiş kullanıcı adları kullanılamaz</li>
            </ul>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={!validationResult?.ok || !value.trim() || isValidating}
              className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isValidating ? 'Kontrol...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
