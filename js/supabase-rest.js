const SUPABASE_URL = 'https://hfszwgjwistfvqmlpqli.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhmc3p3Z2p3aXN0ZnZxbWxwcWxpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTQ2MTU5NywiZXhwIjoyMDc1MDM3NTk3fQ.2Aj-SZj2kr2Zld63ZIyPxMi4EGOPFB9UQc17FyF3OZ4'
const BUCKET_NAME = 'askjdlsajd'

export async function uploadImageToSupabase(file) {
    try {
        console.log('📤 Начинаем загрузку через REST API...', file.name)

        const fileName = `product-${Date.now()}-${file.name}`
        
        const uploadResponse = await fetch(
            `${SUPABASE_URL}/storage/v1/object/${BUCKET_NAME}/${fileName}`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': file.type
                },
                body: file
            }
        )

        if (!uploadResponse.ok) {
            const error = await uploadResponse.text()
            throw new Error(`Ошибка загрузки: ${uploadResponse.status} - ${error}`)
        }

        const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${fileName}`
        
        console.log('✅ Изображение загружено через REST:', publicUrl)
        return publicUrl

    } catch (error) {
        console.error('❌ Ошибка загрузки через REST:', error)
        throw error
    }
}

export function createImagePreview(file, previewElement) {
    const reader = new FileReader()
    
    reader.onload = function(e) {
        previewElement.innerHTML = `
            <img src="${e.target.result}" alt="Preview" style="max-width: 200px; max-height: 150px; border-radius: 8px;">
            <p style="margin: 5px 0; font-size: 12px; color: #666;">${file.name}</p>
        `
    }
    
    reader.readAsDataURL(file)
}

export async function testSupabaseConnection() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
            headers: {
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'apikey': SUPABASE_KEY
            }
        })
        return response.ok
    } catch (error) {
        console.error('❌ Supabase недоступен:', error)
        return false
    }
}
