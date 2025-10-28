'use client'

import { useState, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { useTrackUTM, getStoredUTM, clearStoredUTM } from '@/hooks/useTrackUTM'

function LandingPageContent() {
  useTrackUTM()
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    revenue: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const utmData = getStoredUTM()
      
      const prospectData = {
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        company: formData.company,
        phone: formData.phone || null,
        revenue_estimate: formData.revenue || null,
        source: utmData?.source || 'website',
        email_sent: false,
        replied: false,
        demo_booked: false,
        became_client: false,
        sequence_step: 0
      }

      await supabase.from('prospects').insert(prospectData)

      if (utmData && utmData.utm_content !== 'unknown') {
        await supabase.rpc('link_prospect_to_click', {
          p_prospect_email: formData.email,
          p_utm_content: utmData.utm_content
        })
      }

      clearStoredUTM()
      window.location.href = 'https://calendly.com/gpober/30min'
    } catch (error) {
      console.error('Error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg"></div>
            <span className="text-2xl font-bold text-gray-900">I AM CFO</span>
          </div>
          <a href="https://calendly.com/gpober/30min" target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3 rounded-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
            Book Free Demo
          </a>
        </div>
      </header>

      {/* Hero with Video */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                You've Built a $2M+ Business. It's Time to Operate Like a CFO.
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                I AM CFO syncs with QuickBooks to give you live cash flow visibility, AI-powered analysis, and automated reporting — no spreadsheets, no waiting.
              </p>
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg mb-8 shadow-lg">
                <p className="text-white font-semibold text-lg flex items-center gap-2">
                  🎉 2025 Special: $299 Setup Fee WAIVED All Year
                </p>
              </div>
              <a href="https://calendly.com/gpober/30min" target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 py-4 rounded-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                Book Free Cash Flow Demo →
              </a>
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
              <iframe width="100%" height="100%" src="https://www.youtube.com/embed/ZLEk7ybKMwk" title="I AM CFO Demo" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="absolute inset-0"></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-gray-50 py-12 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600 font-medium mb-8">
            Trusted by 100+ businesses doing $2M-$25M in revenue
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-70 grayscale hover:grayscale-0 transition-all">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 w-32 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
            You're Making Money... But Have No Idea Where It's Going
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '💸', title: 'Cash Flow Chaos', text: 'One location is printing money. Another is bleeding cash. You won\'t know until it\'s too late because your books are 45 days behind.' },
              { icon: '📊', title: 'QuickBooks Lies', text: 'Your P&L says you\'re profitable. Your bank account says otherwise. Something\'s wrong but your bookkeeper can\'t explain it.' },
              { icon: '🤷', title: 'No Real CFO Guidance', text: 'Your accountant files taxes. Your bookkeeper records transactions. Nobody is actually managing your money strategically.' }
            ].map((pain, i) => (
              <div key={i} className="bg-red-50 border-l-4 border-red-500 p-8 rounded-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{pain.icon} {pain.title}</h3>
                <p className="text-gray-700 text-lg">{pain.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QB vs I AM CFO Comparison */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">QuickBooks vs. I AM CFO</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-700">Standard QuickBooks</h3>
                <p className="text-gray-500">What you're probably using now</p>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Operating Activities', value: '$45,230' },
                  { label: 'Investing Activities', value: '-$12,500' },
                  { label: 'Financing Activities', value: '$8,900' }
                ].map((item, i) => (
                  <div key={i} className="bg-gray-50 p-4 rounded border border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{item.label}</span>
                      <span className="text-gray-900 font-mono">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                <p className="text-red-800 font-semibold">❌ The Problem:</p>
                <p className="text-red-700 text-sm mt-2">These numbers tell you nothing actionable. Where's your A/R aging? Which expenses are killing you? You're flying blind.</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-2xl p-8 border-2 border-blue-500">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-blue-600">I AM CFO Dashboard</h3>
                <p className="text-gray-600">Real-time, actionable insights</p>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Collections (A/R)', value: '$125,450', trend: '↑ 12%', color: 'text-green-600', note: '$45K past 30 days - Follow up needed' },
                  { label: 'Payments (A/P)', value: '$87,230', trend: '↓ 5%', color: 'text-red-600', note: '$22K due this week' },
                  { label: 'Payroll', value: '$156,780', trend: '→ Stable', color: 'text-gray-600', note: 'Next payroll: $32K on Friday' }
                ].map((item, i) => (
                  <div key={i} className="bg-blue-50 p-4 rounded border border-blue-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">{item.label}</p>
                        <p className="text-2xl font-bold text-blue-600">{item.value}</p>
                      </div>
                      <span className={`${item.color} font-semibold`}>{item.trend}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{item.note}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
                <p className="text-green-800 font-semibold">✓ The Solution:</p>
                <p className="text-green-700 text-sm mt-2">Every number is actionable. You know exactly what to do next. Make decisions in minutes, not weeks.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">What If You Could See Everything, In Real-Time, For $699/Month?</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6">One Dashboard. All Your Locations. Updated Live.</h3>
              <ul className="space-y-4 text-lg">
                {['Real-time P&L by location (not 45 days old)', 'Cash flow that actually makes sense', 'A/R and A/P you can trust', 'Payroll tracking across all locations', 'KPIs that matter (not vanity metrics)'].map((item, i) => (
                  <li key={i} className="flex items-start space-x-3">
                    <span className="text-2xl">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white text-gray-900 p-10 rounded-xl shadow-2xl">
              <div className="text-center mb-8">
                <div className="text-6xl font-bold text-blue-600">$699</div>
                <div className="text-gray-600 text-xl">/month</div>
                <div className="mt-2 text-sm text-green-600 font-semibold">$299 setup fee WAIVED for 2025! 🎉</div>
              </div>
              <ul className="space-y-3 mb-8">
                {['Real-time financial dashboard', 'Multi-location tracking', 'Monthly CFO strategy calls', 'QuickBooks integration', 'Cancel anytime'].map((item, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <span className="text-green-500 text-xl">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a href="https://calendly.com/gpober/30min" target="_blank" rel="noopener noreferrer" className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-bold py-4 rounded-lg transition-all shadow-lg hover:shadow-xl">
                Get Started →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">What Business Owners Are Saying</h2>
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-10 rounded-2xl shadow-xl">
            <div className="text-yellow-400 text-3xl mb-4">★★★★★</div>
            <p className="text-2xl text-gray-800 mb-6 italic leading-relaxed">
              "I AM CFO saved us 10+ hours every week on financial reporting. Now I can see our cash position in real-time across all our properties. It's like having a full-time CFO without the $150K salary."
            </p>
            <div className="border-t border-gray-300 pt-6">
              <p className="font-bold text-gray-900 text-lg">Sarah Chen</p>
              <p className="text-gray-600">CEO, Terra2 Properties | $4.2M Annual Revenue</p>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to Stop Flying Blind?</h2>
            <p className="text-xl text-gray-600">Book a free 30-minute strategy call to see how I AM CFO can transform your financial visibility.</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                  <input type="text" required value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                  <input type="text" required value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Company *</label>
                <input type="text" required value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Annual Revenue</label>
                <select value={formData.revenue} onChange={(e) => setFormData({ ...formData, revenue: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select range</option>
                  <option value="$2M-$5M">$2M - $5M</option>
                  <option value="$5M-$10M">$5M - $10M</option>
                  <option value="$10M-$25M">$10M - $25M</option>
                  <option value="$25M+">$25M+</option>
                </select>
              </div>
              <button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg transition-all disabled:cursor-not-allowed shadow-lg hover:shadow-xl">
                {submitting ? 'Submitting...' : 'Book Your Free Strategy Call →'}
              </button>
              <p className="text-center text-sm text-gray-500">✓ No credit card required  ✓ Cancel anytime  ✓ $299 setup fee WAIVED (2025 only)</p>
            </form>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-green-500 to-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to See Your Numbers Live?</h2>
          <p className="text-xl mb-8 opacity-90">Book your free 15-minute demo and see your actual QuickBooks data in real-time.</p>
          <a href="https://calendly.com/gpober/30min" target="_blank" rel="noopener noreferrer" className="inline-block bg-white text-green-600 hover:bg-gray-100 font-bold text-lg px-10 py-4 rounded-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
            Book Your Demo Now →
          </a>
          <p className="mt-6 text-sm opacity-80">✓ No credit card required  ✓ Cancel anytime  ✓ $299 setup fee WAIVED (2025 only)</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg"></div>
              <span className="text-2xl font-bold">I AM CFO</span>
            </div>
            <p className="text-gray-400 mb-6">Real-time financial intelligence for multi-location businesses.</p>
          </div>
          <div className="flex justify-center space-x-6 mb-6">
            <a href="/privacy-policy.html" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms.html" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
            <a href="https://calendly.com/gpober/30min" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Book a Call</a>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-gray-400 text-sm">
            <p>&copy; 2024 I AM CFO. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function LandingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><div className="text-xl">Loading...</div></div>}>
      <LandingPageContent />
    </Suspense>
  )
}
