export interface Article {
  id: string;
  title: string;
  excerpt: string;
  link: string;
  pubDate: string;
  source: string;
  category: string;
  time: string;
}

export interface Club {
  name: string;
  league: string;
  val: string;
  rev: string;
  chg: string;
  bar: number;
  color: string;
}

export interface Deal {
  icon: string;
  emoji: string;
  title: string;
  val: string;
  meta: string;
}

export interface PulseItem {
  name: string;
  val: string;
  cls: 'up' | 'down';
}

export interface RevenueItem {
  label: string;
  pct: number;
  val: string;
}

export const CAT_MAP: Record<string, { label: string; bar: string }> = {
  economy:    { label: 'Economy',     bar: 'economy' },
  transfer:   { label: 'Transfers',   bar: 'transfer' },
  broadcast:  { label: 'Broadcast',   bar: 'broadcast' },
  stadium:    { label: 'Stadiums',    bar: 'stadium' },
  salary:     { label: 'Salaries',    bar: 'salary' },
  tech:       { label: 'Tech & AI',   bar: 'tech' },
  sponsorship:{ label: 'Sponsorship', bar: 'sponsorship' },
};

export const CLUBS: Club[] = [
  { name:'Real Madrid',     league:'La Liga',        val:'$6.75B', rev:'$1.07B', chg:'+14.0%', bar:100, color:'#B8960C' },
  { name:'Manchester City', league:'Premier League', val:'$5.85B', rev:'$896M',  chg:'+8.2%',  bar:87,  color:'#378ADD' },
  { name:'Barcelona',       league:'La Liga',        val:'$5.60B', rev:'$840M',  chg:'+3.1%',  bar:83,  color:'#D85A30' },
  { name:'Bayern Munich',   league:'Bundesliga',     val:'$5.10B', rev:'$854M',  chg:'+6.7%',  bar:76,  color:'#DC2626' },
  { name:'Liverpool',       league:'Premier League', val:'$4.65B', rev:'$780M',  chg:'+9.3%',  bar:69,  color:'#B91C1C' },
  { name:'Arsenal',         league:'Premier League', val:'$3.40B', rev:'$650M',  chg:'+31.0%', bar:50,  color:'#EA580C' },
  { name:'PSG',             league:'Ligue 1',        val:'$4.20B', rev:'$857M',  chg:'-2.4%',  bar:62,  color:'#1D4ED8' },
  { name:'Juventus',        league:'Serie A',        val:'$2.45B', rev:'$443M',  chg:'-1.8%',  bar:36,  color:'#374151' },
];

export const PULSE: PulseItem[] = [
  { name:'PL Total Wage Bill', val:'£4.0B ▲9%', cls:'up' },
  { name:'LaLiga Broadcast', val:'€3.0B ▲4%', cls:'up' },
  { name:'Serie A Revenue', val:'€2.8B ▲2%', cls:'up' },
  { name:'Ligue 1 Value', val:'€1.4B ▼1%', cls:'down' },
  { name:'Bundesliga CL Distrib.', val:'€380M ▲7%', cls:'up' },
  { name:'Transfer Market Vol.', val:'€7.8B ▲13%', cls:'up' },
];

export const DEALS: Deal[] = [
  { icon:'sponsor', emoji:'🤝', title:'Adidas extends Real Madrid kit deal', val:'€120M/yr', meta:'Through 2031 · Sponsorship' },
  { icon:'transfer', emoji:'⚽', title:'Rodri contract extension — Man City', val:'€24M/yr', meta:'Premier League · Salary' },
  { icon:'tv', emoji:'📺', title:'Amazon Prime EPL package renewal', val:'£300M', meta:'UK Broadcast Rights' },
  { icon:'stadium', emoji:'🏟️', title:'Tottenham Hotspur naming rights', val:'£150M', meta:'10-yr deal · Commercial' },
  { icon:'tech', emoji:'🤖', title:'AI scouting platform Series B raise', val:'€45M', meta:'DataScout AI · Tech' },
  { icon:'salary', emoji:'💰', title:'Haaland contract renewal talks', val:'€35M/yr', meta:'Man City · Wage Bill' },
];

export const REVENUE: RevenueItem[] = [
  { label:'Broadcast',   pct:43, val:'€19.4B' },
  { label:'Matchday',    pct:22, val:'€9.9B'  },
  { label:'Commercial',  pct:19, val:'€8.6B'  },
  { label:'Sponsorship', pct:10, val:'€4.5B'  },
  { label:'Digital',     pct:6,  val:'€2.7B'  },
];

export const TICKER_ITEMS = [
  { text: 'Real Madrid Valuation', val: '$6.75B ▲14%' },
  { text: '2026 World Cup Revenue', val: '$10.9B projected' },
  { text: 'Premier League Broadcast', val: '£6.7B cycle 25-29' },
  { text: 'Champions League Revenue', val: '€4.4B 24/25' },
  { text: 'Nike / Man City Kit Deal', val: '€100M/yr' },
  { text: 'Mbappé Annual Salary', val: '€72M/yr' },
  { text: 'Saudi Pro League Spend', val: "€148M Jan '26 ▼12%" },
  { text: 'Spotify Camp Nou Project', val: '€1.8B budget' },
  { text: 'EA FC 2026 Revenue', val: '$1.8B projected' },
  { text: 'Global Transfer Window', val: '€7.8B 25/26' },
  { text: 'Arsenal Valuation', val: '$3.4B ▲31%' },
  { text: 'Bundesliga Broadcast', val: '€4.48B 25–29' },
  { text: 'Adidas / Real Madrid', val: '€120M/yr to 2031' },
  { text: 'Man Utd INEOS Restructure', val: '£1.3B project' },
  { text: 'Serie A Private Equity', val: '€1.7B offer' },
  { text: 'Tottenham Naming Rights', val: '£150M 10yr deal' },
  { text: 'AI Scouting Market', val: '€2.1B by 2027' },
  { text: 'UEFA Club Revenues', val: '€30B+ projected 2026' },
];

export const FALLBACK_ARTICLES: Article[] = [
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
];

export function classifyCategory(title: string, desc?: string): string {
  const text = (title + ' ' + (desc||'')).toLowerCase();
  if (/transfer|sign|fee|move|deal|bid|buy|sell|loan|release|clause/.test(text)) return 'transfer';
  if (/broadcast|tv|right|stream|amazon|sky|bein|dazn|disney|media|channel/.test(text)) return 'broadcast';
  if (/stadium|ground|naming|arena|seat|renovation|rebuild|camp nou|wembley/.test(text)) return 'stadium';
  if (/salary|wage|contract|earn|pay|extension|renewal|bonus/.test(text)) return 'salary';
  if (/ai|tech|data|scout|software|platform|analytics|digital|app/.test(text)) return 'tech';
  if (/sponsor|kit|shirt|adidas|nike|puma|commercial|partner|brand/.test(text)) return 'sponsorship';
  return 'economy';
}

export function timeAgo(dateStr: string): string {
  if (!dateStr) return 'Recently';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const mins = Math.floor((Date.now() - d.getTime()) / 60000);
  if (mins < 2) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs/24)}d ago`;
}
