'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

/**
 * Hook to automatically track page views with UTM parameters
 * Use this on your landing page: info.iamcfo.com
 */
export function useTrackUTM() {
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const utmSource = searchParams.get('utm_source')
    const utmMedium = searchParams.get('utm_medium')
    const utmCampaign = searchParams.get('utm_campaign')
    const utmContent = searchParams.get('utm_content')
    
    // Only track if we have UTM parameters
    if (utmSource || utmContent) {
      // Store in sessionStorage so we can use it when they submit form
      sessionStorage.setItem('utm_source', utmSource || 'unknown')
      sessionStorage.setItem('utm_medium', utmMedium || 'organic')
      sessionStorage.setItem('utm_campaign', utmCampaign || 'unknown')
      sessionStorage.setItem('utm_content', utmContent || 'unknown')
      
      // Track the click
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
      }).catch(err => {
        // Silently fail - don't break user experience
        console.error('Failed to track click:', err)
      })
    }
  }, [searchParams])
}

/**
 * Get stored UTM parameters (for use when creating prospect)
 */
export function getStoredUTM() {
  if (typeof window === 'undefined') return null
  
  const utmSource = sessionStorage.getItem('utm_source')
  const utmMedium = sessionStorage.getItem('utm_medium')
  const utmCampaign = sessionStorage.getItem('utm_campaign')
  const utmContent = sessionStorage.getItem('utm_content')
  
  if (!utmSource && !utmContent) return null
  
  return {
    utm_source: utmSource || 'unknown',
    utm_medium: utmMedium || 'organic',
    utm_campaign: utmCampaign || 'unknown',
    utm_content: utmContent || 'unknown',
    // Generate source string: "linkedin_oct28_cashflow"
    source: utmContent ? `${utmSource}_${utmContent}` : utmSource || 'website'
  }
}

/**
 * Clear stored UTM parameters (call after prospect is created)
 */
export function clearStoredUTM() {
  if (typeof window === 'undefined') return
  
  sessionStorage.removeItem('utm_source')
  sessionStorage.removeItem('utm_medium')
  sessionStorage.removeItem('utm_campaign')
  sessionStorage.removeItem('utm_content')
}
