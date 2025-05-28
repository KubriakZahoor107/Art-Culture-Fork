export interface NewsItem {
  id: string
  title: string
  excerpt: string
  content: string
}

// Демонстраційний масив новин
export const newsList: NewsItem[] = [
  {
    id: '1',
    title: 'Перша новина',
    excerpt: 'Короткий опис першої новини…',
    content: '<p>Це повний текст першої новини.</p>',
  },
  {
    id: '2',
    title: 'Друга новина',
    excerpt: 'Короткий опис другої новини…',
    content: '<p>Це повний текст другої новини.</p>',
  },
]
