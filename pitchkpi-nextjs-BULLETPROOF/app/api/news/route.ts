import { NextResponse } from 'next/server'
import { parseStringPromise } from 'xml2js'

// Static fallback data - used if RSS fails
const FALLBACK = [
  { id:'1', title:"UEFA projects European club revenues to break €30B barrier in 2025/26", excerpt:"European football is on course to break through the €30 billion revenue barrier for the first time, driven by expanded UEFA distributions, broadcast cycles and commercial deals.", source:"UEFA Finance Report", time:"1h ago", category:"economy", link:"https://www.insideworldfootball.com", pubDate: new Date().toISOString() },
  { id:'2', title:"2026 World Cup revenue projected at $10.9B — 56% jump from Qatar 2022", excerpt:"FIFA's financial projections for the 2026 World Cup show record-breaking revenue of $10.9 billion, driven by expanded 48-team format and North American market growth.", source:"FIFA Financial Report", time:"2h ago", category:"economy", link:"", pubDate: new Date().toISOString() },
  { id:'3', title:"Real Madrid becomes first football club valued above $1B in annual revenue", excerpt:"Real Madrid's revenue hit $1.07 billion in 2024/25, making it the first football club to break the billion-dollar barrier. Forbes values the club at $6.75 billion.", source:"Forbes", time:"3h ago", category:"economy", link:"", pubDate: new Date().toISOString() },
  { id:'4', title:"Arsenal valuation jumps 31% to $3.4B on Champions League revenue boost", excerpt:"Arsenal's valuation surged 31% to $3.4 billion, driven by Champions League participation and commercial growth. The club posted $650 million in revenue.", source:"Forbes 2026", time:"4h ago", category:"economy", link:"", pubDate: new Date().toISOString() },
  { id:'5', title:"Saudi PIF cuts spending — January 2026 window only €148M", excerpt:"Saudi Arabia's Public Investment Fund reduced football spending by 12% in the January 2026 window, signaling a shift toward sustainable investment models.", source:"Transfermarkt", time:"5h ago", category:"transfer", link:"", pubDate: new Date().toISOString() },
  { id:'6', title:"Premier League 2025-29 broadcast deal hits £6.7B with international growth", excerpt:"The Premier League's domestic broadcast cycle reaches £6.7B, with international rights now exceeding domestic value for the first time.", source:"The Athletic", time:"6h ago", category:"broadcast", link:"", pubDate: new Date().toISOString() },
  { id:'7', title:"Bundesliga secures €4.48B domestic broadcast deal for 2025-29", excerpt:"The Bundesliga's new four-year broadcast deal with DAZN and Sky totals €4.48 billion, with DAZN winning Saturday Konferenz rights.", source:"Inside World Football", time:"7h ago", category:"broadcast", link:"", pubDate: new Date().toISOString() },
  { id:'8', title:"Adidas extends Real Madrid kit deal to 2031 for €120M annually", excerpt:"Real Madrid have confirmed an extension with Adidas worth €120M per season through 2031, making it the world's most valuable kit deal.", source:"Marca", time:"8h ago", category:"sponsorship", link:"", pubDate: new Date().toISOString() },
  { id:'9', title:"Spotify Camp Nou renovation cost rises to €1.8B, reopening late 2026", excerpt:"FC Barcelona confirmed the total Camp Nou renovation cost has risen to €1.8B. The stadium is expected to reopen in late 2026.", source:"El País", time:"10h ago", category:"stadium", link:"", pubDate: new Date().toISOString() },
  { id:'10', title:"AI scouting market projected to hit €2.1B by 2027", excerpt:"Investment in AI-powered football scouting and analytics platforms continues to surge, with the market expected to reach €2.1 billion by 2027.", source:"TechCrunch Sports", time:"12h ago", category:"tech", link:"", pubDate: new Date().toISOString() },
]

const RSS_FEEDS = [
  'https://feeds.bbci.co.uk/sport/football/rss.xml',
  'https://www.skysports.com/rss/12040',
  'https://www.theguardian.com/football/rss',
]

const BUSINESS_KEYWORDS = /transfer|fee|salary|wage|contract|revenue|valuation|broadcast|rights|stadium|sponsor|kit|agent|deal|million|billion|invest|acquire|fund|profit|loss|debt|ipo|club sale|world cup 2026|saudi|ineos|private equity/i

function classifyCategory(title: string, desc?: string): string {
  const text = (title + ' ' + (desc || '')).toLowerCase()
  if (/transfer|sign|fee|move|deal|bid|buy|sell|loan|release|clause/.test(text)) return 'transfer'
  if (/broadcast|tv|right|stream|amazon|sky|bein|dazn|disney|media|channel/.test(text)) return 'broadcast'
  if (/stadium|ground|naming|arena|seat|renovation|rebuild|camp nou|wembley/.test(text)) return 'stadium'
  if (/salary|wage|contract|earn|pay|extension|renewal|bonus/.test(text)) return 'salary'
  if (/ai|tech|data|scout|software|platform|analytics|digital|app/.test(text)) return 'tech'
  if (/sponsor|kit|shirt|adidas|nike|puma|commercial|partner|brand/.test(text)) return 'sponsorship'
  return 'economy'
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return 'Recently'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  const mins = Math.floor((Date.now() - d.getTime()) / 60000)
  if (mins < 2) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

async function fetchRSS(url: string) {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000) // 5s timeout

    const res = await fetch(url, {
      headers: { 'User-Agent': 'PitchKPI/1.0' },
      signal: controller.signal,
    })
    clearTimeout(timeout)

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

export async function GET() {
  let articles: any[] = []

  // Try RSS feeds with timeout
  const rssResults = await Promise.allSettled(RSS_FEEDS.map(url => fetchRSS(url)))
  rssResults.forEach(r => {
    if (r.status === 'fulfilled') articles.push(...r.value)
  })

  // Filter for business relevance
  if (articles.length > 0) {
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
    articles = articles.slice(0, 12)
  }

  // If RSS fails completely, use fallback
  if (articles.length === 0) {
    articles = FALLBACK
  }

  return NextResponse.json({ 
    articles, 
    count: articles.length, 
    updated: new Date().toISOString(),
    source: articles.length > 0 && articles[0].source !== 'UEFA Finance Report' ? 'live' : 'fallback'
  })
}
