import { NextResponse } from 'next/server'
import { parseStringPromise } from 'xml2js'
import { Article, classifyCategory, timeAgo } from '@/lib/data'

const RSS_FEEDS = [
  'https://feeds.bbci.co.uk/sport/football/rss.xml',
  'https://www.skysports.com/rss/12040',
  'https://www.theguardian.com/football/rss',
]

const BUSINESS_KEYWORDS = /transfer|fee|salary|wage|contract|revenue|valuation|broadcast|rights|stadium|sponsor|kit|agent|deal|million|billion|€|£|\$|invest|acquire|fund|profit|loss|debt|ipo|club sale|world cup 2026|saudi|ineos|private equity/i

async function fetchRSS(url: string): Promise<Article[]> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'PitchKPI/1.0' },
      next: { revalidate: 60 }
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const xml = await res.text()
    const parsed = await parseStringPromise(xml, { explicitArray: false })
    const channel = parsed.rss?.channel
    if (!channel || !channel.item) return []

    const items = Array.isArray(channel.item) ? channel.item : [channel.item]
    const source = channel.title || 'RSS Feed'

    return items.slice(0, 5).map((item: any) => {
      const title = item.title || ''
      const desc = (item.description || '').replace(/<[^>]+>/g, '').substring(0, 200)
      const link = item.link || ''
      const pubDate = item.pubDate || new Date().toISOString()

      return {
        id: `${source}-${title.substring(0, 30)}`,
        title,
        excerpt: desc,
        link,
        pubDate,
        source,
        category: classifyCategory(title, desc),
        time: timeAgo(pubDate),
      }
    })
  } catch (err) {
    console.warn(`RSS fetch failed for ${url}:`, err)
    return []
  }
}

async function fetchGNews(): Promise<Article[]> {
  try {
    const queries = [
      'football transfer fee 2026',
      'football club revenue 2026',
      'football broadcast rights 2026'
    ]
    const q = queries[Math.floor(Math.random() * queries.length)]
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&lang=en&country=any&max=6&apikey=pub_free`

    const res = await fetch(url, { next: { revalidate: 120 } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const data = await res.json()
    if (!data.articles) return []

    return data.articles.map((a: any) => ({
      id: `gnews-${a.title?.substring(0, 30)}`,
      title: a.title,
      excerpt: a.description || '',
      link: a.url,
      pubDate: a.publishedAt,
      source: a.source?.name || 'GNews',
      category: classifyCategory(a.title, a.description),
      time: timeAgo(a.publishedAt),
    }))
  } catch (err) {
    console.warn('GNews fetch failed:', err)
    return []
  }
}

export async function GET() {
  let articles: Article[] = []

  // Fetch RSS feeds in parallel
  const rssResults = await Promise.allSettled(RSS_FEEDS.map(url => fetchRSS(url)))
  rssResults.forEach(r => {
    if (r.status === 'fulfilled') articles.push(...r.value)
  })

  // Fetch GNews
  try {
    const gnews = await fetchGNews()
    articles.push(...gnews)
  } catch {}

  // Filter for business relevance
  articles = articles.filter(a => BUSINESS_KEYWORDS.test(a.title + ' ' + a.excerpt))

  // Deduplicate
  const seen = new Set<string>()
  articles = articles.filter(a => {
    const key = a.title.toLowerCase().substring(0, 40)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  // Sort by date
  articles.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())

  // Limit
  articles = articles.slice(0, 12)

  return NextResponse.json({ articles, count: articles.length, updated: new Date().toISOString() })
}
