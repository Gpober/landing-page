import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/track-click
 * Tracks clicks from LinkedIn (or other sources) with UTM parameters
 * Called when someone lands on info.iamcfo.com with UTM params
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    
    const {
      utm_source = 'unknown',
      utm_medium = 'organic',
      utm_campaign = 'unknown',
      utm_content = 'unknown',
      user_agent,
      referrer
    } = body
    
    // Get IP from request headers
    const ip_address = request.headers.get('x-forwarded-for') || 
                       request.headers.get('x-real-ip') || 
                       'unknown'
    
    // Call Supabase function to track click
    const { data, error } = await supabase.rpc('track_linkedin_click', {
      p_utm_content: utm_content,
      p_ip_address: ip_address,
      p_user_agent: user_agent,
      p_referrer: referrer
    })
    
    if (error) {
      console.error('Error tracking click:', error)
      // Don't fail the request if tracking fails
      return NextResponse.json({ 
        success: true, 
        tracked: false,
        message: 'Click tracking failed but continuing'
      })
    }
    
    return NextResponse.json({ 
      success: true, 
      tracked: true,
      click_id: data 
    })
    
  } catch (error) {
    console.error('Error in track-click endpoint:', error)
    // Return success even if tracking fails (don't break user flow)
    return NextResponse.json({ 
      success: true, 
      tracked: false,
      message: 'Tracking error'
    })
  }
}

/**
 * GET /api/track-click (for testing)
 */
export async function GET() {
  return NextResponse.json({ 
    message: 'LinkedIn Click Tracking API',
    usage: 'POST with utm_source, utm_medium, utm_campaign, utm_content'
  })
}
