// src/app/news/[id]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { newsList, NewsItem } from '@/data/news'

interface Props {
  params: { id: string }
}

export async function generateStaticParams() {
  return newsList.map((n) => ({ id: n.id }))
}

export async function generateMetadata({ params }: Props) {
  const news = newsList.find((n) => n.id === params.id)
  if (!news) return {}
  return {
    title: `${news.title} · Art & Culture`,
    description: news.excerpt,
    openGraph: {
      title: news.title,
      description: news.excerpt,
      images: ['/og-news.png'],
    },
    twitter: {
      card: 'summary_large_image',
    },
  }
}

export default async function NewsPage({ params }: Props) {
  const news = newsList.find((n) => n.id === params.id) as NewsItem
  if (!news) notFound()

  return (
    <article className="max-w-3xl mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">{news.title}</h1>
      <p className="italic text-gray-700 mb-6">{news.excerpt}</p>
      <div
        className="prose prose-blue"
        dangerouslySetInnerHTML={{ __html: news.content }}
      />
      {/* Ось цей Link — і він точно працюватиме */}
      <p className="mt-8">
        <Link href="/news" className="text-blue-600 hover:underline">
          ← Повернутися до списку новин
        </Link>
      </p>
    </article>
  )
}


