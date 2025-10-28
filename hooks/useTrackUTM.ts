'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export function useTrackUTM() {
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const utmSource = searchParams.get('utm_source')
    const utmMedium = searchParams.get('utm_medium')
    const utmCampaign = searchParams.get('utm_campaign')
    const utmContent = searchParams.get('utm_content')
    
    if (utmSource || utmContent) {
      sessionStorage.setItem('utm_source', utmSource || 'unknown')
      sessionStorage.setItem('utm_medium', utmMedium || 'organic')
      sessionStorage.setItem('utm_campaign', utmCampaign || 'unknown')
      sessionStorage.setItem('utm_content', utmContent || 'unknown')
      
      fetch('/api/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          utm_content: utmContent,
          user_agent: navigator.userAgent,
          referrer: document.referrer
        })
      }).catch(err => console.error('Failed to track click:', err))
    }
  }, [searchParams])
}

export function getStoredUTM() {
  if (typeof window === 'undefined') return null
  
  const utmSource = sessionStorage.getItem('utm_source')
  const utmContent = sessionStorage.getItem('utm_content')
  
  if (!utmSource && !utmContent) return null
  
  return {
    utm_source: utmSource || 'unknown',
    utm_medium: sessionStorage.getItem('utm_medium') || 'organic',
    utm_campaign: sessionStorage.getItem('utm_campaign') || 'unknown',
    utm_content: utmContent || 'unknown',
    source: utmContent ? `${utmSource}_${utmContent}` : utmSource || 'website'
  }
}

export function clearStoredUTM() {
  if (typeof window === 'undefined') return
  
  sessionStorage.removeItem('utm_source')
  sessionStorage.removeItem('utm_medium')
  sessionStorage.removeItem('utm_campaign')
  sessionStorage.removeItem('utm_content')
}
