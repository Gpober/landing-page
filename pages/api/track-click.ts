import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

type ResponseData = { success?: boolean; tracked?: boolean; click_id?: unknown; message?: string; usage?: string }

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method === 'POST') {
    try {
      const {
        utm_source = 'unknown',
        utm_medium = 'organic',
        utm_campaign = 'unknown',
        utm_content = 'unknown',
        user_agent,
        referrer,
      } = req.body || {}

      const ip_address =
        (Array.isArray(req.headers['x-forwarded-for'])
          ? req.headers['x-forwarded-for'][0]
          : req.headers['x-forwarded-for']) ||
        req.headers['x-real-ip'] ||
        req.socket.remoteAddress ||
        'unknown'

      const { data, error } = await supabase.rpc('track_linkedin_click', {
        p_utm_content: utm_content,
        p_ip_address: ip_address,
        p_user_agent: user_agent,
        p_referrer: referrer,
      })

      if (error) {
        console.error('Error tracking click:', error)
        return res.status(200).json({
          success: true,
          tracked: false,
          message: 'Click tracking failed but continuing',
        })
      }

      return res.status(200).json({
        success: true,
        tracked: true,
        click_id: data,
      })
    } catch (error) {
      console.error('Error in track-click endpoint:', error)
      return res.status(200).json({
        success: true,
        tracked: false,
        message: 'Tracking error',
      })
    }
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      message: 'LinkedIn Click Tracking API',
      usage: 'POST with utm_source, utm_medium, utm_campaign, utm_content',
    })
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({
    success: true,
    tracked: false,
    message: 'Method Not Allowed',
  })
}
