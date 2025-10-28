import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      utm_source = 'unknown',
      utm_medium = 'organic',
      utm_campaign = 'unknown',
      utm_content = 'unknown',
      user_agent,
      referrer
    } = body
    
    const ip_address = request.headers.get('x-forwarded-for') || 
                       request.headers.get('x-real-ip') || 
                       'unknown'
    
    const { data, error } = await supabase.rpc('track_linkedin_click', {
      p_utm_content: utm_content,
      p_ip_address: ip_address,
      p_user_agent: user_agent,
      p_referrer: referrer
    })
    
    if (error) {
      console.error('Error tracking click:', error)
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
    return NextResponse.json({ 
      success: true, 
      tracked: false,
      message: 'Tracking error'
    })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'LinkedIn Click Tracking API',
    usage: 'POST with utm_source, utm_medium, utm_campaign, utm_content'
  })
}
