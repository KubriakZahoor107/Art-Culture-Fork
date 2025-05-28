export const metadata = {
  title: 'Головна • Art & Culture',
  description: 'Ласкаво просимо на сайт Art & Culture',
}

export default function HomePage() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Ласкаво просимо на Art & Culture</h1>
      <p>Це демонстраційний блог на Next.js із SSR.</p>
      <ul>
        <li><a href="/news/1">Перша новина</a></li>
        <li><a href="/news/2">Друга новина</a></li>
      </ul>
    </main>
  )
}
