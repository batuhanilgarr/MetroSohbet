import { supabase } from './supabase'

export interface ImageUploadResult {
  url: string
  path: string
  error?: string
}

export const imageUpload = {
  // Resim yükleme
  uploadImage: async (file: File): Promise<ImageUploadResult> => {
    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { url: '', path: '', error: 'Dosya boyutu 5MB\'dan küçük olmalıdır' }
    }

    // Dosya tipi kontrolü
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return { url: '', path: '', error: 'Sadece JPEG, PNG, GIF ve WebP formatları desteklenir' }
    }

    try {
      // Benzersiz dosya adı oluştur
      const timestamp = Date.now()
      const randomId = Math.random().toString(36).substring(2, 15)
      const fileExtension = file.name.split('.').pop()
      const fileName = `chat-images/${timestamp}-${randomId}.${fileExtension}`

      // Supabase Storage'a yükle
      const { data, error } = await supabase.storage
        .from('metrosohbet-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        return { url: '', path: '', error: error.message }
      }

      // Public URL oluştur
      const { data: urlData } = supabase.storage
        .from('metrosohbet-images')
        .getPublicUrl(fileName)

      return {
        url: urlData.publicUrl,
        path: fileName
      }
    } catch (error) {
      return { url: '', path: '', error: 'Resim yüklenemedi' }
    }
  },

  // Resim silme
  deleteImage: async (path: string): Promise<{ error?: string }> => {
    try {
      const { error } = await supabase.storage
        .from('metrosohbet-images')
        .remove([path])

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error) {
      return { error: 'Resim silinemedi' }
    }
  },

  // Resim boyutlandırma (client-side)
  resizeImage: (file: File, maxWidth: number = 1200, maxHeight: number = 900): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const img = new Image()

      img.onload = () => {
        // Boyutları hesapla
        let { width, height } = img
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        
        if (ratio < 1) {
          width *= ratio
          height *= ratio
        }

        // Canvas'ı ayarla
        canvas.width = width
        canvas.height = height

        // Resmi çiz
        ctx.drawImage(img, 0, 0, width, height)

        // Blob'a çevir (daha yüksek kalite)
        canvas.toBlob((blob) => {
          const resizedFile = new File([blob!], file.name, {
            type: file.type,
            lastModified: Date.now()
          })
          resolve(resizedFile)
        }, file.type, 0.9)
      }

      img.src = URL.createObjectURL(file)
    })
  }
}
