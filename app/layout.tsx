import type { Metadata } from 'next'
import './globals.css'
import JudgeGuideModal from '@/components/JudgeGuideModal'

export const metadata: Metadata = {
  title: 'NIRMAAN — Intelligent Disaster Risk & Relocation Planning Platform',
  description: 'NIRMAAN is an AI-powered GIS decision-support platform for identifying hazard-based Red Zones, assessing vulnerable habitations, and prioritizing proactive relocation planning. SIH26191 — Ministry of Home Affairs, NDRF.',
  keywords: 'disaster management, risk assessment, relocation planning, GIS, NDRF, hazard mapping, SIH26191',
  authors: [{ name: 'SIH26191 Team' }],
  robots: 'noindex,nofollow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      </head>
      <body className="antialiased">
        {children}
        <JudgeGuideModal />
      </body>
    </html>
  )
}
