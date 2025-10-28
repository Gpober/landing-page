import Head from 'next/head'
import LandingPage from '@/components/LandingPage'

export default function IndexPage() {
  return (
    <>
      <Head>
        <title>Get Your Free Financial Reality Check | I AM CFO</title>
        <meta
          name="description"
          content="See exactly where your business stands financially in under 10 minutes. Real-time financial intelligence for businesses doing $2M-$25M in revenue."
        />
      </Head>
      <LandingPage />
    </>
  )
}
