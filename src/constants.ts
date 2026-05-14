import { Stock, NewsItem, PortfolioHolding, Friend } from './types';

export const TOP_GAINERS: Stock[] = [
  { ticker: 'S50', name: 'Samudera Ship', price: 1.340, change: 0.104, changePercent: 8.42, sector: 'Shipping' },
  { ticker: 'G13', name: 'Genting Sing', price: 0.895, change: 0.040, changePercent: 4.67, sector: 'Hospitality' },
  { ticker: 'BN4', name: 'Keppel Ltd', price: 6.720, change: 0.210, changePercent: 3.22, sector: 'Industrial' },
  { ticker: 'BS6', name: 'Yangzijiang', price: 1.940, change: 0.040, changePercent: 2.11, sector: 'Shipping' },
];

export const SCREENER_RESULTS: Stock[] = [
  { ticker: 'D05.SI', name: 'DBS Group', price: 36.42, change: 0.45, changePercent: 1.24, yield: 5.2, sector: 'Finance' },
  { ticker: 'M44U.SI', name: 'Mapletree Pan Asia', price: 1.28, change: -0.01, changePercent: -0.78, yield: 6.8, sector: 'REITs' },
  { ticker: 'C31.SI', name: 'CapitaLand Inv', price: 2.91, change: 0.01, changePercent: 0.34, yield: 4.1, sector: 'Real Estate' },
  { ticker: 'A17U.SI', name: 'Ascendas REIT', price: 2.68, change: -0.03, changePercent: -1.12, yield: 5.9, sector: 'REITs' },
  { ticker: 'U11.SI', name: 'UOB Limited', price: 30.15, change: 0.00, changePercent: 0.00, yield: 5.5, sector: 'Finance' },
];

export const PORTFOLIO_HOLDINGS: PortfolioHolding[] = [
  { ticker: 'DBS', name: 'DBS Group Holdings Ltd', price: 34.82, changePercent: 0.42, qty: 1200, avgPrice: 31.20, totalGain: 4344.00 },
  { ticker: 'M44U', name: 'Mapletree Log Tr', price: 1.48, changePercent: -1.33, qty: 15000, avgPrice: 1.62, totalGain: -2100.00 },
];

export const WATCHLIST: Stock[] = [
  { ticker: 'C6L', name: 'Singapore Airlines', price: 6.420, change: 0.07, changePercent: 1.12, sector: 'Aviation' },
  { ticker: 'BN4', name: 'Keppel Ltd.', price: 6.780, change: -0.02, changePercent: -0.29, sector: 'Industrial' },
  { ticker: 'ME8U', name: 'Mapletree Pan Asia', price: 1.280, change: 0.00, changePercent: 0.00, sector: 'REITs' },
];

export const NEWS_FEED: NewsItem[] = [
  {
    id: '1',
    source: 'STRAITS TIMES',
    title: 'DBS Q3 net profit rises 15% to S$2.63b, beating market estimates.',
    time: '2 hours ago',
    readTime: '4 min read',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvlUCC4S5WQ3VPVJNnqRq3Lk1Q5YWUjiWPjENl_Vi52ZOIPX3LMTCpYzMP6pWdJ0qmPnNBy5SK-q31XGeGUD2DoxL1nMa0LccqIGTgrl70f_6SODnxp8FAfXIQBiWw7Zqtj7RrvtZKNiNBIMu9it1ZbeQaTiVtwNrEx-fYlukeFRgbVcK1fw6SqHkDO32SI8wtkf9xL0l6s4BUAVyBWLz6Tkc7XKxkKIsnoioW0PY9xIstTkOKDyNMj_YY0u3FnSQb1xfB_zlG36I'
  },
  {
    id: '2',
    source: 'SGX OBSERVER',
    title: 'Singapore Banks resilient amid global interest rate volatility.',
    time: '5 hours ago',
    readTime: '6 min read',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqJwluoSkhtesQec8_41-dvNDotMsVPeviCEADtfUJC8vrgqJHav0j0tN1vafmc6wmHyPKVemQ-37iAWw_eBGlaEarDlhQZxXTjPdKq2h7kokJpbkYVSQB43qRsCDIP01DwYTMRQKibZ7i0KUqLfvCJoJqEBIAtCeKM4HiNq5gnJzYJ5Dwvbm-ApWNpoFBdriAoPYrPLJYMD001s2YvPY2ZOXKovv3VhZ6BGd0BKUD8jugxLpcN_MCYQimkVg8bP6Zyv1E73snmjk'
  },
  {
    id: '3',
    source: 'ANALYSIS',
    title: 'What the new ESG framework means for SGX blue-chip stocks.',
    time: 'Yesterday',
    readTime: '8 min read',
    tag: 'ANALYSIS',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBnuNq11GlDeu1vgSg-AG7wl0F59wOzXfAU8w4FmwO4oaeR0HpwV9tCCfmfLeY3aM1RigA_X2w2bleSfOiNWAehHCPv1iiaqbJD-Gu8FalngvjO6M_bFG602syC17MyXv04hko_QoxhN4G9QnBGiYqtbwrIlvCvKJ7sB8y8D7SuvCc2HzPhnet9Mh1dxMSYc6bDYrM6tLZXDAdnd8Rhz18vyAvxsGnGsMQy3h0vvesxJ6gDvTEzt9F9fUj8D7EMdkwBOobESTiL9w'
  }
];

export const MOCK_FRIENDS: Friend[] = [
  { id: 'me', name: 'You (Michelle)', avatar: 'M', totalGain: 14200.80, totalGainPercent: 11.04, rank: 2, isCurrentUser: true },
  { id: '1', name: 'Jun Jie', avatar: 'JJ', totalGain: 25400.50, totalGainPercent: 15.20, rank: 1 },
  { id: '2', name: 'Sarah Tan', avatar: 'ST', totalGain: 8200.00, totalGainPercent: 5.40, rank: 3 },
  { id: '3', name: 'Marcus L.', avatar: 'ML', totalGain: -1200.30, totalGainPercent: -2.10, rank: 4 },
];

export const THEMES: any[] = [
  {
    id: 'default',
    name: 'Terminal Blue',
    colors: {
      primary: '#b7c4ff',
      primaryContainer: '#2e62ff',
      surface: '#0b1326',
      surfaceContainer: '#171f33',
      onSurface: '#dae2fd',
      outline: '#434656'
    }
  },
  {
    id: 'cyberpunk',
    name: 'Neon Nights',
    colors: {
      primary: '#ff00ff',
      primaryContainer: '#660066',
      surface: '#0a0a0a',
      surfaceContainer: '#1a1a1a',
      onSurface: '#00ffff',
      outline: '#3a3a3a'
    },
    backgroundImage: 'url(https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop)'
  },
  {
    id: 'nature',
    name: 'Forest Alpha',
    colors: {
      primary: '#4ade80',
      primaryContainer: '#064e3b',
      surface: '#022c22',
      surfaceContainer: '#064e3b',
      onSurface: '#ecfdf5',
      outline: '#065f46'
    },
    backgroundImage: 'url(https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071&auto=format&fit=crop)'
  },
  {
    id: 'midnight',
    name: 'Pure Noir',
    colors: {
      primary: '#ffffff',
      primaryContainer: '#333333',
      surface: '#000000',
      surfaceContainer: '#111111',
      onSurface: '#ffffff',
      outline: '#222222'
    }
  }
];
