export interface Stock {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  yield?: number;
  marketCap?: string;
  peRatio?: number;
  volume?: string;
  sector: string;
}

export interface NewsItem {
  id: string;
  source: string;
  title: string;
  time: string;
  readTime: string;
  imageUrl: string;
  tag?: string;
}

export interface PortfolioHolding {
  ticker: string;
  name: string;
  price: number;
  changePercent: number;
  qty: number;
  avgPrice: number;
  totalGain: number;
}

export enum Tab {
  MARKET = 'market',
  SCREENER = 'screener',
  WATCHLIST = 'watchlist',
  PORTFOLIO = 'portfolio',
  REWARDS = 'rewards',
  SOCIAL = 'social',
  DETAIL = 'detail',
}

export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    background: string;
    surface: string;
    accent: string;
  };
  backgroundImage?: string;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  totalGain: number;
  totalGainPercent: number;
  rank: number;
  isCurrentUser?: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
  claimed: boolean;
  target: number;
  current: number;
  unit: string;
}
