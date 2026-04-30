'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  CLUBS,
  PULSE,
  DEALS,
  REVENUE,
  TICKER_ITEMS,
  FALLBACK_ARTICLES,
  CAT_MAP,
  timeAgo,
} from '@/lib/data'
import styles from './page.module.css'

interface Article {
  id: string
  title: string
  excerpt: string
  link: string
  pubDate: string
  source: string
  category: string
  time: string
}

export default function Home() {
  const [dark, setDark] = useState(false)
  const [articles, setArticles] = useState<Article[]>([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  const [liveVisible, setLiveVisible] = useState(false)
  const [lastUpdated, setLastUpdated] = useState('Fetching now…')

  // Dark mode
  useEffect(() => {
    const saved = localStorage.getItem('pkpi-dark') === '1'
    setDark(saved)
    document.documentElement.setAttribute('data-theme', saved ? 'dark' : '')
  }, [])

  const toggleDark = () => {
    const next = !dark
    setDark(next)
    localStorage.setItem('pkpi-dark', next ? '1' : '0')
    document.documentElement.setAttribute('data-theme', next ? 'dark' : '')
  }

  // Toast
  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  // Clock
  const [clock, setClock] = useState('—')
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const opts: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }
      setClock(now.toLocaleDateString('en-GB', opts).replace(',', ''))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // Fetch news
  const fetchNews = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const res = await fetch('/api/news')
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      const newArticles: Article[] = data.articles || []

      if (newArticles.length > 0) {
        const hadBefore = articles.length > 0
        setArticles(newArticles)
        setLastUpdated(`Updated ${timeAgo(new Date().toISOString())}`)
        if (silent && hadBefore && newArticles.length > articles.length) {
          setLiveVisible(true)
          setTimeout(() => setLiveVisible(false), 4000)
          showToast(`✓ ${newArticles.length - articles.length} new stories`)
        }
        if (!silent) showToast(`✓ ${newArticles.length} stories loaded`)
      } else {
        setArticles(FALLBACK_ARTICLES)
        if (!silent) showToast('Showing curated data')
      }
    } catch {
      setArticles(FALLBACK_ARTICLES)
      if (!silent) showToast('Showing curated data — live feeds updating…')
    } finally {
      if (!silent) setLoading(false)
    }
  }, [articles.length])

  // Initial load + auto-refresh
  useEffect(() => {
    fetchNews(false)
    const interval = setInterval(() => fetchNews(true), 90000)
    return () => clearInterval(interval)
  }, [fetchNews])

  // Filtered articles
  const filtered = filter === 'all' ? articles : articles.filter(a => a.category === filter)

  // Share
  const shareArticle = (title: string, platform: string) => {
    const url = 'https://pitchkpi.com'
    const text = encodeURIComponent(`${title} — via PitchKPI`)
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${text}+${url}`,
    }
    if (platform === 'copy') {
      navigator.clipboard.writeText(`${title} — ${url}`).then(() => showToast('✓ Copied to clipboard'))
      return
    }
    window.open(urls[platform], '_blank', 'width=600,height=400')
  }

  // Newsletter
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const subscribe = () => {
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address')
      return
    }
    setSubscribed(true)
    setEmail('')
    showToast('✓ Subscribed! Welcome to PitchKPI.')
  }

  return (
    <>
      {/* Announcement Bar */}
      <div className={styles.announceBar}>
        🏆 &nbsp;The Bloomberg of Football is live — <a href="#newsletter">Subscribe for the daily briefing →</a>
      </div>

      {/* Ticker */}
      <div className={styles.tickerWrap}>
        <div className={styles.tickerLabel}>Live Markets</div>
        <div style={{ overflow: 'hidden', flex: 1 }}>
          <div className={styles.tickerTrack}>
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <div key={i} className={styles.tickerItem}>
                {item.text}<span>{item.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Header */}
      <header className={styles.header}>
        <div>
          <div className={styles.logoSub}>Football Business Intelligence</div>
          <div className={styles.logoMark}>Pitch<span>KPI</span></div>
        </div>
        <nav className={styles.nav}>
          {['all', 'transfer', 'broadcast', 'sponsorship', 'stadium', 'salary', 'tech'].map((cat) => (
            <button
              key={cat}
              className={filter === cat ? styles.navActive : ''}
              onClick={() => setFilter(cat)}
            >
              {cat === 'all' ? 'Overview' : cat === 'tech' ? 'Tech & AI' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </nav>
        <div className={styles.headerRight}>
          <div className={styles.liveBadge}><div className={styles.liveDot}></div>Live</div>
          <div className={styles.dateStamp}>{clock}</div>
          <button className={styles.iconBtn} onClick={toggleDark} title="Toggle dark mode">
            {dark ? '☀️' : '🌙'}
          </button>
          <button className={styles.refreshBtn} onClick={() => fetchNews(false)}>
            <span className={styles.refreshIcon}>↻</span> Refresh
          </button>
        </div>
      </header>

      {/* Live Indicator */}
      <div className={`${styles.liveIndicator} ${liveVisible ? styles.liveIndicatorShow : ''}`}>
        ● New stories detected
      </div>

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroKpi}>
          <div className={styles.kpiLabel}>Global Football Industry</div>
          <div className={styles.kpiValue}><sup>€</sup>48.5B</div>
          <div className={`${styles.kpiChange} ${styles.up}`}>▲ 9.1% YoY</div>
          <div className={styles.kpiNote}>Projected 2025/26 market size</div>
        </div>
        <div className={styles.heroKpi}>
          <div className={styles.kpiLabel}>2026 World Cup Revenue</div>
          <div className={styles.kpiValue}><sup>$</sup>10.9B</div>
          <div className={`${styles.kpiChange} ${styles.up}`}>▲ 56% vs Qatar 2022</div>
          <div className={styles.kpiNote}>FIFA projected tournament revenue</div>
        </div>
        <div className={styles.heroKpi}>
          <div className={styles.kpiLabel}>UEFA Club Revenues</div>
          <div className={styles.kpiValue}><sup>€</sup>30.2B</div>
          <div className={`${styles.kpiChange} ${styles.up}`}>▲ 5.6% breaking €30B</div>
          <div className={styles.kpiNote}>European clubs 2025/26 projection</div>
        </div>
        <div className={styles.heroKpi}>
          <div className={styles.kpiLabel}>Sponsorship & Kits</div>
          <div className={styles.kpiValue}><sup>€</sup>5.1B</div>
          <div className={`${styles.kpiChange} ${styles.up}`}>▲ 4.2% annual</div>
          <div className={styles.kpiNote}>Elite clubs top-20</div>
        </div>
      </div>

      {/* Main Layout */}
      <div className={styles.layout}>
        <div className={styles.mainCol}>

          {/* Stat Strip */}
          <div className={styles.statStrip}>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Highest Wage Bill</div>
              <div className={styles.statValue}>€630M</div>
              <div className={styles.statSub}>PSG — 2024/25 season</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Record Transfer Fee</div>
              <div className={styles.statValue}>€180M</div>
              <div className={styles.statSub}>Mbappé — PSG → Real Madrid</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Biggest Stadium Project</div>
              <div className={styles.statValue}>€1.8B</div>
              <div className={styles.statSub}>Spotify Camp Nou, Barcelona</div>
            </div>
          </div>

          {/* Category Nav */}
          <div className={styles.catNav}>
            {['all', 'economy', 'transfer', 'broadcast', 'stadium', 'salary', 'tech', 'sponsorship'].map((cat) => (
              <button
                key={cat}
                className={`${styles.catBtn} ${filter === cat ? styles.catBtnActive : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {/* Pulse Row */}
          <div className={styles.pulseRow}>
            <div className={styles.pulseChip}><div className={`${styles.dot} ${styles.dotGreen}`}></div>Auto-updating every 90s</div>
            <div className={styles.pulseChip}><div className={`${styles.dot} ${styles.dotGold}`}></div>Free · No login required</div>
            <div className={styles.pulseChip}><div className={`${styles.dot} ${styles.dotBlue}`}></div>{lastUpdated}</div>
          </div>

          {/* News Section */}
          <div className={styles.secTitle}>
            <h2>Latest Intelligence</h2>
            <div className={styles.secTitleLine}></div>
            <div className={styles.secBadge}>{filtered.length} stories</div>
          </div>

          <div className={styles.newsGrid}>
            {loading ? (
              <div className={styles.ncLoading} style={{ gridColumn: '1/-1' }}>
                <div className={styles.ncSpinner}></div>
                Fetching live football business intelligence…
              </div>
            ) : filtered.length === 0 ? (
              <div className={styles.errorBox}>No articles found. Try another category or refresh.</div>
            ) : (
              filtered.map((a, i) => {
                const bar = CAT_MAP[a.category]?.bar || 'default'
                const featured = i === 0 && filter === 'all'
                return (
                  <div key={a.id} className={`${styles.newsCard} ${featured ? styles.newsCardFeatured : ''}`}>
                    <div className={`${styles.ncTop} ${styles[`ncTop${bar.charAt(0).toUpperCase() + bar.slice(1)}`] || styles.ncTopDefault}`}></div>
                    <div className={styles.ncBody}>
                      <div className={styles.ncCat}>{CAT_MAP[a.category]?.label || 'News'}</div>
                      <div className={`${styles.ncTitle} ${featured ? styles.ncTitleLg : ''}`}>{a.title}</div>
                      <div className={styles.ncExcerpt}>{a.excerpt}</div>
                      <div className={styles.ncMeta}>
                        <span className={styles.ncSource}>{a.source}</span>
                        <span className={styles.ncTime}>{a.time || timeAgo(a.pubDate)}</span>
                      </div>
                      <div className={styles.ncShare}>
                        <button className={styles.shareBtn} onClick={() => shareArticle(a.title, 'twitter')}>𝕏 Share</button>
                        <button className={styles.shareBtn} onClick={() => shareArticle(a.title, 'whatsapp')}>💬 WhatsApp</button>
                        <button className={styles.shareBtn} onClick={() => shareArticle(a.title, 'copy')}>⎘ Copy</button>
                        {a.link && <a className={styles.shareBtn} href={a.link} target="_blank" rel="noopener noreferrer">↗ Read</a>}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Club Table */}
          <div className={styles.secTitle}>
            <h2>Club Valuation Index</h2>
            <div className={styles.secTitleLine}></div>
            <div className={styles.secBadge}>Top 8 · Forbes 2026</div>
          </div>
          <table className={styles.mktTable}>
            <thead>
              <tr>
                <th>#</th><th>Club</th><th>League</th><th>Valuation</th><th>Revenue</th><th>Δ YoY</th><th>Index</th>
              </tr>
            </thead>
            <tbody>
              {CLUBS.map((c, i) => (
                <tr key={c.name}>
                  <td style={{ color: 'var(--ink4)', fontSize: '12px', fontFamily: "'DM Mono', monospace" }}>{String(i+1).padStart(2, '0')}</td>
                  <td>
                    <div className={styles.clubName}>
                      <div className={styles.clubDot} style={{ background: c.color }}></div>
                      {c.name}
                    </div>
                  </td>
                  <td style={{ color: 'var(--ink4)', fontSize: '12px' }}>{c.league}</td>
                  <td className={styles.valNum}>{c.val}</td>
                  <td className={styles.valNum} style={{ color: 'var(--ink3)' }}>{c.rev}</td>
                  <td className={`${styles.changeCell} ${c.chg.startsWith('-') ? styles.changeCellDown : styles.changeCellUp}`}>{c.chg}</td>
                  <td>
                    <div className={styles.valBarWrap}>
                      <div className={styles.valBar} style={{ width: `${c.bar}%` }}></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>

        {/* Sidebar */}
        <div className={styles.sideCol}>

          {/* Newsletter */}
          <div className={styles.newsletter} id="newsletter">
            <div className={styles.nlTitle}>The Daily Briefing</div>
            <div className={styles.nlSub}>Transfer fees, broadcast deals, salary leaks — every morning before 7am.</div>
            <div className={styles.nlForm}>
              <input
                className={styles.nlInput}
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && subscribe()}
              />
              <button className={styles.nlBtn} onClick={subscribe}>Subscribe Free</button>
              {subscribed && <div className={styles.nlSuccess}>✓ You&apos;re in. Welcome to PitchKPI.</div>}
            </div>
          </div>

          {/* Market Pulse */}
          <div className={styles.sideSection}>
            <h3>Market Pulse</h3>
            {PULSE.map((p) => (
              <div key={p.name} className={styles.mktPulseItem}>
                <span className={styles.mktPulseName}>{p.name}</span>
                <span className={`${styles.mktPulseVal} ${p.cls === 'up' ? styles.mktPulseValUp : styles.mktPulseValDown}`}>{p.val}</span>
              </div>
            ))}
          </div>

          {/* Deals */}
          <div className={styles.sideSection}>
            <h3>Biggest Deals</h3>
            {DEALS.map((d) => (
              <div key={d.title} className={styles.dealItem}>
                <div className={`${styles.dealIcon} ${styles[`dealIcon${d.icon.charAt(0).toUpperCase() + d.icon.slice(1)}`]}`}>{d.emoji}</div>
                <div>
                  <div className={styles.dealTitle}>{d.title}</div>
                  <div className={styles.dealVal}>{d.val}</div>
                  <div className={styles.dealMeta}>{d.meta}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Revenue */}
          <div className={styles.sideSection}>
            <h3>Revenue Mix — Top 5 Leagues</h3>
            {REVENUE.map((r) => (
              <div key={r.label} className={styles.revItem}>
                <div className={styles.revRow}>
                  <span className={styles.revLabel}>{r.label}</span>
                  <span className={styles.revVal}>{r.val}</span>
                </div>
                <div className={styles.revBarBg}>
                  <div className={styles.revBarFill} style={{ width: `${r.pct}%` }}></div>
                </div>
                <div className={styles.revPct}>{r.pct}% of total</div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>Pitch<span>KPI</span></div>
            <p>The leading football business intelligence platform. Real-time data on transfers, salaries, broadcast rights, and club finances.</p>
          </div>
          <div className={styles.footerCol}>
            <h4>Coverage</h4>
            <a href="#" onClick={(e) => { e.preventDefault(); setFilter('transfer') }}>Transfers</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setFilter('broadcast') }}>Broadcast</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setFilter('sponsorship') }}>Sponsorship</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setFilter('stadium') }}>Stadiums</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setFilter('salary') }}>Salaries</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setFilter('tech') }}>Tech & AI</a>
          </div>
          <div className={styles.footerCol}>
            <h4>Data Sources</h4>
            <a href="https://www.bbc.com/sport/football" target="_blank" rel="noopener noreferrer">BBC Sport</a>
            <a href="https://www.skysports.com/football" target="_blank" rel="noopener noreferrer">Sky Sports</a>
            <a href="https://theathletic.com" target="_blank" rel="noopener noreferrer">The Athletic</a>
            <a href="https://www.transfermarkt.com" target="_blank" rel="noopener noreferrer">Transfermarkt</a>
            <a href="https://swissramble.blogspot.com" target="_blank" rel="noopener noreferrer">Swiss Ramble</a>
          </div>
          <div className={styles.footerCol}>
            <h4>Follow</h4>
            <a href="https://twitter.com/PitchKPI" target="_blank" rel="noopener noreferrer">Twitter / X</a>
            <a href="https://linkedin.com/company/pitchkpi" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://instagram.com/pitchkpi" target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <div className={styles.footerCopy}>© 2026 PitchKPI · pitchkpi.com · All data sourced from public feeds</div>
          <div className={styles.footerSocial}>
            <a className={styles.socialBtn} href="https://twitter.com/intent/tweet?text=Check+out+PitchKPI+—+the+Bloomberg+of+football+business+%F0%9F%8F%9F&url=https://pitchkpi.com" target="_blank" rel="noopener noreferrer" title="Share on X">𝕏</a>
            <a className={styles.socialBtn} href="https://www.linkedin.com/sharing/share-offsite/?url=https://pitchkpi.com" target="_blank" rel="noopener noreferrer" title="Share on LinkedIn">in</a>
            <a className={styles.socialBtn} href="https://wa.me/?text=Check+out+PitchKPI+—+live+football+business+intelligence+https://pitchkpi.com" target="_blank" rel="noopener noreferrer" title="Share on WhatsApp">💬</a>
          </div>
        </div>
      </footer>

      {/* Toast */}
      <div className={`${styles.toast} ${toast ? styles.toastShow : ''}`}>{toast}</div>
    </>
  )
}
