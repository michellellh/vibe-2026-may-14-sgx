import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CandlestickChart, 
  Search, 
  MoreVertical, 
  LayoutDashboard, 
  Filter, 
  Eye, 
  Wallet,
  RotateCcw,
  Percent,
  LineChart as Analytics,
  ChevronDown,
  ArrowDown,
  TrendingUp,
  ArrowUp,
  Maximize2,
  Trophy,
  Coins,
  CheckCircle2,
  Gift,
  Users,
  UserPlus,
  Medal,
  Palette,
  X
} from 'lucide-react';
import { Tab, Stock, NewsItem, PortfolioHolding, Milestone, Friend, Theme } from './types';
import { TOP_GAINERS, SCREENER_RESULTS, PORTFOLIO_HOLDINGS, WATCHLIST, NEWS_FEED, MOCK_FRIENDS, THEMES } from './constants';
import ChatBot from './components/ChatBot';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.MARKET);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [watchlistStocks, setWatchlistStocks] = useState<Stock[]>(WATCHLIST);
  const [friends, setFriends] = useState<Friend[]>(MOCK_FRIENDS);
  const [coins, setCoins] = useState(150);
  const [cashBalance, setCashBalance] = useState(500.00);
  const [currentTheme, setCurrentTheme] = useState<string>('default');
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: '1', title: 'Novice Investor', description: 'Total portfolio value reaches $10,000', reward: 50, completed: true, claimed: true, target: 10000, current: 142850, unit: '$' },
    { id: '2', title: 'Diversifier', description: 'Hold more than 5 different stocks', reward: 100, completed: false, claimed: false, target: 5, current: 2, unit: 'stocks' },
    { id: '3', title: 'High Flyer', description: 'Portfolio gains more than 10% total', reward: 200, completed: true, claimed: false, target: 10, current: 11.04, unit: '%' },
    { id: '4', title: 'Regular Trader', description: 'Open the terminal for 7 consecutive days', reward: 150, completed: false, claimed: false, target: 7, current: 3, unit: 'days' },
  ]);

  useEffect(() => {
    const theme = THEMES.find(t => t.id === currentTheme);
    if (theme) {
      const root = document.documentElement;
      root.style.setProperty('--primary', theme.colors.primary);
      root.style.setProperty('--primary-container', theme.colors.primaryContainer);
      root.style.setProperty('--surface', theme.colors.surface);
      root.style.setProperty('--surface-container', theme.colors.surfaceContainer);
      root.style.setProperty('--on-surface', theme.colors.onSurface);
      root.style.setProperty('--outline-variant', theme.colors.outline);
      root.style.setProperty('--bg-image', theme.backgroundImage || 'none');
    }
  }, [currentTheme]);

  const claimReward = (id: string) => {
    setMilestones(prev => prev.map(m => {
      if (m.id === id && m.completed && !m.claimed) {
        setCoins(c => c + m.reward);
        return { ...m, claimed: true };
      }
      return m;
    }));
  };

  const redeemCoins = (amount: number) => {
    if (coins >= amount) {
      setCoins(c => c - amount);
      setCashBalance(cb => cb + (amount / 10)); // 10 coins = $1 cash
    }
  };

  const toggleWatchlist = (stock: Stock) => {
    setWatchlistStocks(prev => {
      const isBookmarked = prev.some(s => s.ticker === stock.ticker);
      if (isBookmarked) {
        return prev.filter(s => s.ticker !== stock.ticker);
      } else {
        return [...prev, stock];
      }
    });
  };

  const handleStockClick = (stock: Stock) => {
    setSelectedStock(stock);
    setActiveTab(Tab.DETAIL);
  };

  return (
    <div className="flex flex-col min-h-screen max-w-screen-xl mx-auto w-full relative">
      <TopAppBar 
        onSearch={() => {}} 
        coins={coins} 
        onRewards={() => setActiveTab(Tab.REWARDS)} 
        onTheme={() => setShowThemeSelector(true)}
      />
      
      <main className="flex-grow pb-24 overflow-x-hidden">
        <AnimatePresence mode="wait">
          {showThemeSelector ? (
            <motion.div
              key="themes"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <ThemeSelector 
                currentTheme={currentTheme} 
                onSelect={(id) => {
                  setCurrentTheme(id);
                  setShowThemeSelector(false);
                }} 
                onClose={() => setShowThemeSelector(false)}
              />
            </motion.div>
          ) : activeTab === Tab.MARKET && (
            <motion.div
              key="market"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <MarketView 
                onStockClick={handleStockClick} 
                toggleWatchlist={toggleWatchlist}
                watchlistStocks={watchlistStocks}
              />
            </motion.div>
          )}

          {activeTab === Tab.SCREENER && (
            <motion.div
              key="screener"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ScreenerView 
                onStockClick={handleStockClick} 
                toggleWatchlist={toggleWatchlist}
                watchlistStocks={watchlistStocks}
              />
            </motion.div>
          )}

          {activeTab === Tab.PORTFOLIO && (
            <motion.div
              key="portfolio"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <PortfolioView 
                onStockClick={handleStockClick} 
                watchlistStocks={watchlistStocks}
                cashBalance={cashBalance}
              />
            </motion.div>
          )}

          {activeTab === Tab.REWARDS && (
            <motion.div
              key="rewards"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <RewardsView 
                coins={coins} 
                milestones={milestones} 
                onClaim={claimReward}
                onRedeem={redeemCoins}
              />
            </motion.div>
          )}

          {activeTab === Tab.SOCIAL && (
            <motion.div
              key="social"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <SocialView 
                friends={friends} 
                onAddFriend={() => {}} 
              />
            </motion.div>
          )}

          {activeTab === Tab.DETAIL && (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <StockDetailView 
                stock={selectedStock || SCREENER_RESULTS[0]} 
                onBack={() => setActiveTab(Tab.MARKET)} 
                toggleWatchlist={toggleWatchlist}
                isWatchlisted={watchlistStocks.some(s => s.ticker === (selectedStock?.ticker || SCREENER_RESULTS[0].ticker))}
              />
            </motion.div>
          )}

          {/* Watchlist Tab */}
          {activeTab === Tab.WATCHLIST && (
             <motion.div
              key="watchlist"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="px-4 py-6 space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-headline font-bold">Your Watchlist</h2>
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full font-mono text-[10px] font-bold">
                  {watchlistStocks.length} STOCKS
                </div>
              </div>

              {watchlistStocks.length === 0 ? (
                <div className="py-20 text-center opacity-40">
                   <Eye className="w-16 h-16 mx-auto mb-4" />
                   <p className="font-mono text-xs uppercase tracking-widest">Your list is empty</p>
                </div>
              ) : (
                <div className="bg-surface-container-low rounded-xl border border-outline-variant overflow-hidden">
                  {watchlistStocks.map((stock) => (
                    <div key={stock.ticker} onClick={() => handleStockClick(stock)} 
                         className="flex items-center justify-between p-4 hover:bg-surface-container-highest transition-colors cursor-pointer group border-b border-outline-variant last:border-none">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center border border-outline-variant/30 group-hover:border-primary transition-colors">
                          <span className="font-bold text-primary font-mono text-xs">{stock.ticker.split('.')[0]}</span>
                        </div>
                        <div>
                          <p className="font-mono text-sm font-bold text-on-surface">{stock.ticker}</p>
                          <p className="font-sans text-[11px] text-on-surface-variant font-medium">{stock.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="font-mono text-sm font-bold text-on-surface">{stock.price.toFixed(3)}</p>
                          <p className={`font-mono text-[10px] font-bold ${stock.changePercent >= 0 ? 'text-up' : 'text-down'}`}>
                            {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                          </p>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleWatchlist(stock); }}
                          className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                        >
                          <Eye className="w-5 h-5 fill-primary" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNavBar activeTab={activeTab} onTabChange={setActiveTab} />
      <ChatBot />
    </div>
  );
}

function TopAppBar({ onSearch, coins, onRewards, onTheme }: { onSearch: () => void, coins: number, onRewards: () => void, onTheme: () => void }) {
  return (
    <header className="w-full top-0 sticky z-40 bg-surface border-b border-outline-variant flex items-center justify-between px-4 h-14 backdrop-blur-md bg-opacity-80">
      <div className="flex items-center gap-2">
        <CandlestickChart className="text-primary w-6 h-6" />
        <h1 className="font-headline text-lg font-bold text-primary tracking-tight">Capital Prime</h1>
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={onTheme}
          className="hover:bg-surface-container-high transition-colors p-2 rounded-full active:scale-95"
        >
          <Palette className="text-on-surface-variant w-5 h-5" />
        </button>
        <button 
          onClick={onRewards}
          className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 transition-all rounded-full px-3 py-1 border border-primary/20 active:scale-95"
        >
          <Coins className="w-4 h-4 text-primary" />
          <span className="font-mono text-[10px] font-bold text-primary">{coins}</span>
        </button>
        <button onClick={onSearch} className="hover:bg-surface-container-high transition-colors p-2 rounded-full active:scale-95">
          <Search className="text-on-surface-variant w-5 h-5" />
        </button>
        <button className="hover:bg-surface-container-high transition-colors p-2 rounded-full active:scale-95">
          <MoreVertical className="text-on-surface-variant w-5 h-5" />
        </button>
      </div>
    </header>
  );
}

function ThemeSelector({ currentTheme, onSelect, onClose }: { currentTheme: string, onSelect: (id: string) => void, onClose: () => void }) {
  return (
    <div className="px-4 pt-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-headline font-bold">Terminal Themes</h2>
        <button onClick={onClose} className="p-2 hover:bg-surface-container rounded-full">
          <X className="w-6 h-6 text-on-surface-variant" />
        </button>
      </div>
      <p className="text-xs text-on-surface-variant font-mono uppercase tracking-widest opacity-60">Personalize your terminal workspace</p>
      
      <div className="grid grid-cols-1 gap-4">
        {THEMES.map((theme) => (
          <button 
            key={theme.id}
            onClick={() => onSelect(theme.id)}
            className={`relative overflow-hidden group h-32 rounded-2xl border-2 transition-all active:scale-[98%] text-left ${
              currentTheme === theme.id ? 'border-primary shadow-2xl' : 'border-outline-variant hover:border-on-surface-variant'
            }`}
            style={{ 
              backgroundColor: theme.colors.surface,
              backgroundImage: theme.backgroundImage,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Overlay for readability if it has a background image */}
            {theme.backgroundImage && (
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
            )}
            
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="font-headline text-lg font-bold text-white drop-shadow-md">{theme.name}</span>
                {currentTheme === theme.id && (
                  <div className="bg-primary text-on-primary rounded-full p-1 shadow-lg">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full border border-white/20" style={{ backgroundColor: theme.colors.primary }} />
                <div className="w-6 h-6 rounded-full border border-white/20" style={{ backgroundColor: theme.colors.surface }} />
                <div className="w-6 h-6 rounded-full border border-white/20" style={{ backgroundColor: theme.colors.primaryContainer }} />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function MarketView({ onStockClick, toggleWatchlist, watchlistStocks }: { 
  onStockClick: (s: Stock) => void, 
  toggleWatchlist: (s: Stock) => void,
  watchlistStocks: Stock[]
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* STI Index Banner */}
      <section className="px-4 py-6 bg-surface-container-low">
        <div className="flex justify-between items-end">
          <div>
            <span className="font-mono text-[10px] font-bold text-on-surface-variant tracking-wider uppercase">Straits Times Index (STI)</span>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="font-headline text-3xl font-bold text-on-surface">3,245.18</h2>
              <span className="font-mono text-xs font-bold text-up">+12.45 (0.38%)</span>
            </div>
          </div>
          <div className="h-10 w-24">
            <svg className="w-full h-full stroke-up fill-none stroke-2" viewBox="0 0 100 40">
              <path d="M0 35 Q 20 25, 40 30 T 80 10 T 100 5"></path>
            </svg>
          </div>
        </div>
      </section>

      {/* Market Heatmap Section */}
      <section className="px-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-headline text-xs font-bold text-primary tracking-widest uppercase">Market Heatmap</h3>
          <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-tighter">By Mkt Cap</span>
        </div>
        <div className="grid grid-cols-6 grid-rows-4 gap-1 h-64">
          <div onClick={() => onStockClick({ticker: 'DBS', name: 'DBS Group', price: 36.42, change: 0.45, changePercent: 1.2, sector: 'Finance'})} 
               className="col-span-3 row-span-4 bg-[#064e3b] border border-[#065f46] flex flex-col items-center justify-center rounded-sm cursor-pointer hover:brightness-110 active:scale-[98%] transition-all">
            <span className="font-mono font-bold text-white text-sm">DBS</span>
            <span className="font-mono text-[10px] text-up">+1.2%</span>
          </div>
          <div className="col-span-3 row-span-2 bg-[#064e3b]/60 border border-[#065f46]/40 flex flex-col items-center justify-center rounded-sm cursor-pointer hover:brightness-110 active:scale-[98%] transition-all">
            <span className="font-mono font-bold text-white text-xs">OCBC</span>
            <span className="font-mono text-[10px] text-up">+0.4%</span>
          </div>
          <div className="col-span-2 row-span-2 bg-[#7f1d1d] border border-[#991b1b] flex flex-col items-center justify-center rounded-sm cursor-pointer hover:brightness-110 active:scale-[98%] transition-all">
            <span className="font-mono font-bold text-white text-[10px]">Z74</span>
            <span className="font-mono text-[10px] text-down">-2.1%</span>
          </div>
          <div className="col-span-1 row-span-2 bg-surface-container-highest border border-outline-variant flex flex-col items-center justify-center rounded-sm">
            <span className="font-mono font-bold text-on-surface-variant text-[10px]">C31</span>
            <span className="font-mono text-[10px] text-on-surface-variant">0.0%</span>
          </div>
        </div>
      </section>

      {/* Top Movers */}
      <section className="px-4">
        <div className="flex gap-4 border-b border-outline-variant mb-4">
          <button className="pb-2 border-b-2 border-primary text-primary font-mono text-[11px] font-bold tracking-widest">GAINERS</button>
          <button className="pb-2 text-on-surface-variant font-mono text-[11px] font-bold tracking-widest opacity-50">LOSERS</button>
          <button className="pb-2 text-on-surface-variant font-mono text-[11px] font-bold tracking-widest opacity-50">VOLUME</button>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between px-2 py-1 bg-surface-container-low rounded-sm">
            <span className="font-mono text-[10px] text-on-surface-variant w-1/2 uppercase font-bold tracking-tighter">Instrument</span>
            <span className="font-mono text-[10px] text-on-surface-variant w-1/4 text-right uppercase font-bold tracking-tighter">Price</span>
            <span className="font-mono text-[10px] text-on-surface-variant w-1/4 text-right uppercase font-bold tracking-tighter">Change</span>
          </div>
          {TOP_GAINERS.map((stock) => {
            const isWatchlisted = watchlistStocks.some(s => s.ticker === stock.ticker);
            return (
              <div key={stock.ticker} 
                   className="flex items-center justify-between p-2 hover:bg-surface-container-high transition-colors border-b border-outline-variant/30 cursor-pointer group active:scale-[99%]">
                <div className="w-1/2 flex items-center gap-3" onClick={() => onStockClick(stock)}>
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleWatchlist(stock); }}
                    className={`p-1.5 rounded-full transition-all active:scale-95 ${isWatchlisted ? 'text-primary bg-primary/10' : 'text-on-surface-variant/40 hover:text-primary hover:bg-primary/5'}`}
                  >
                    <Eye className={`w-4 h-4 ${isWatchlisted ? 'fill-primary' : ''}`} />
                  </button>
                  <div>
                    <div className="font-headline text-[14px] text-on-surface font-semibold group-hover:text-primary transition-colors">{stock.name}</div>
                    <div className="font-mono text-[10px] text-on-surface-variant font-bold">{stock.ticker}</div>
                  </div>
                </div>
                <div className="w-1/4 text-right font-mono text-sm text-on-surface" onClick={() => onStockClick(stock)}>{stock.price.toFixed(3)}</div>
                <div className="w-1/4 text-right" onClick={() => onStockClick(stock)}>
                  <span className="px-2 py-0.5 bg-up/10 text-up rounded-sm font-mono text-[11px] font-bold font-tabular-nums">+{stock.changePercent}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sector Performance */}
      <section className="px-4">
        <h3 className="font-headline text-xs font-bold text-primary tracking-widest uppercase mb-4">Sector Trends</h3>
        <div className="flex overflow-x-auto gap-4 scrollbar-hide pb-2">
          <SectorCard name="FINANCIALS" change={+0.82} />
          <SectorCard name="REITs" change={-0.45} />
          <SectorCard name="TELECOM" change={-1.20} />
          <SectorCard name="INDUSTRIAL" change={+0.35} />
        </div>
      </section>
    </div>
  );
}

function SectorCard({ name, change }: { name: string, change: number }) {
  const isUp = change > 0;
  return (
    <div className="min-w-[120px] bg-surface-container p-3 border border-outline-variant rounded-sm active:scale-95 transition-transform cursor-pointer">
      <span className="font-mono text-[10px] font-bold text-on-surface-variant opacity-70">{name}</span>
      <div className={`font-mono text-[16px] font-bold mt-1 ${isUp ? 'text-up' : 'text-down'}`}>
        {isUp ? '+' : ''}{change.toFixed(2)}%
      </div>
    </div>
  );
}

function ScreenerView({ onStockClick, toggleWatchlist, watchlistStocks }: { 
  onStockClick: (s: Stock) => void,
  toggleWatchlist: (s: Stock) => void,
  watchlistStocks: Stock[]
}) {
  return (
    <div className="px-4 pt-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-headline text-2xl font-bold text-on-surface">Equity Screener</h2>
        <button className="flex items-center gap-2 px-3 py-1 bg-surface-container-high border border-outline-variant rounded-lg hover:bg-surface-container-highest transition-colors active:scale-95">
          <RotateCcw className="w-4 h-4 text-on-surface-variant" />
          <span className="font-mono text-[10px] font-bold text-on-surface-variant">RESET</span>
        </button>
      </div>

      {/* Quick Sector Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
        <Chip active label="ALL SECTORS" />
        <Chip label="REITS" />
        <Chip label="BANKS" />
        <Chip label="INDUSTRIALS" />
        <Chip label="REAL ESTATE" />
      </div>

      {/* Advanced Filters Bento */}
      <div className="grid grid-cols-2 gap-3">
        <FilterCard label="DIVIDEND YIELD" value="> 4.5%" icon={<Percent className="w-4 h-4" />} progress={60} />
        <FilterCard label="P/E RATIO" value="< 12x" icon={<Analytics className="w-4 h-4" />} progress={40} />
        <div className="col-span-2 bg-surface-container p-4 rounded-xl border border-outline-variant space-y-3">
          <div className="flex justify-between items-center">
            <label className="font-mono text-[10px] font-bold text-on-surface-variant">MARKET CAP (SGD)</label>
            <span className="font-mono text-sm font-bold text-primary">$1B — $50B</span>
          </div>
          <div className="h-1 w-full bg-outline-variant rounded-full relative">
            <div className="absolute left-[20%] top-0 h-full w-[50%] bg-primary rounded-full"></div>
            <div className="absolute left-[20%] top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full border-2 border-surface-container"></div>
            <div className="absolute left-[70%] top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full border-2 border-surface-container"></div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] font-bold text-on-surface-variant">32 STOCKS FOUND</span>
          <div className="flex items-center gap-1 cursor-pointer hover:opacity-80">
            <span className="font-mono text-[10px] font-bold text-primary">SORT BY YIELD</span>
            <ArrowDown className="w-3 h-3 text-primary" />
          </div>
        </div>

        <div className="overflow-hidden bg-surface-container rounded-xl border border-outline-variant">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high border-b border-outline-variant">
                <th className="py-3 px-4 font-mono text-[10px] font-bold text-on-surface-variant">TICKER</th>
                <th className="py-3 px-4 font-mono text-[10px] font-bold text-on-surface-variant text-right">PRICE</th>
                <th className="py-3 px-4 font-mono text-[10px] font-bold text-on-surface-variant text-right">CHG%</th>
                <th className="py-3 px-4 font-mono text-[10px] font-bold text-on-surface-variant text-right">YIELD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {SCREENER_RESULTS.map((stock) => {
                const isWatchlisted = watchlistStocks.some(s => s.ticker === stock.ticker);
                return (
                  <tr key={stock.ticker} 
                      className="hover:bg-surface-container-highest transition-colors cursor-pointer group active:opacity-80">
                    <td className="py-3 px-4" onClick={() => onStockClick(stock)}>
                      <div className="flex flex-col">
                        <span className="font-mono text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{stock.ticker}</span>
                        <span className="text-[9px] text-on-surface-variant font-headline uppercase font-medium">{stock.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right" onClick={() => onStockClick(stock)}>
                      <span className="font-mono text-sm text-on-surface">{stock.price.toFixed(2)}</span>
                    </td>
                    <td className="py-3 px-4 text-right" onClick={() => onStockClick(stock)}>
                      <span className={`font-mono text-sm ${stock.changePercent >= 0 ? 'text-up' : 'text-down'}`}>
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <span className="font-mono text-sm text-primary font-bold">{stock.yield?.toFixed(1)}%</span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleWatchlist(stock); }}
                          className={`p-1 rounded-full transition-all ${isWatchlisted ? 'text-primary bg-primary/10' : 'text-on-surface-variant/40 hover:text-primary'}`}
                        >
                          <Eye className={`w-4 h-4 ${isWatchlisted ? 'fill-primary' : ''}`} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <button className="w-full py-4 border border-dashed border-outline-variant rounded-xl flex items-center justify-center gap-2 hover:bg-surface-container transition-colors active:scale-[99%] group">
          <span className="font-mono text-[10px] font-bold text-on-surface-variant group-hover:text-on-surface transition-colors">LOAD MORE RESULTS</span>
          <ChevronDown className="w-4 h-4 text-on-surface-variant" />
        </button>
      </section>

      {/* Market Heatmap Ad */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-container/20 to-surface-container h-40 border border-outline-variant p-6 active:scale-[99%] transition-transform">
        <div className="relative z-10 space-y-2">
          <h3 className="font-headline text-lg font-bold text-on-surface">Market Heatmap</h3>
          <p className="font-sans text-xs text-on-surface-variant max-w-[200px] leading-relaxed">Visualize capital flows across Singapore's leading sectors in real-time.</p>
          <button className="font-mono text-[10px] font-bold text-primary border-b border-primary/40 pb-0.5 mt-2">LAUNCH ANALYTICS</button>
        </div>
        <div className="absolute -right-6 -bottom-6 opacity-10">
          <LayoutDashboard className="w-40 h-40 text-primary" />
        </div>
      </div>
    </div>
  );
}

function Chip({ label, active }: { label: string, active?: boolean }) {
  return (
    <button className={`shrink-0 px-4 py-2 border rounded-full font-mono text-[10px] font-bold tracking-tighter transition-all active:scale-95 ${
      active 
        ? 'bg-primary-container text-on-primary-container border-primary/20 shadow-lg' 
        : 'bg-surface-container border-outline-variant text-on-surface-variant hover:bg-surface-container-high'
    }`}>
      {label}
    </button>
  );
}

function FilterCard({ label, value, icon, progress }: { label: string, value: string, icon: React.ReactNode, progress: number }) {
  return (
    <div className="bg-surface-container p-4 rounded-xl border border-outline-variant space-y-3 active:scale-95 transition-transform cursor-pointer group">
      <label className="font-mono text-[10px] font-bold text-on-surface-variant block uppercase tracking-tighter">{label}</label>
      <div className="flex items-end justify-between">
        <span className="font-mono text-lg font-bold text-primary">{value}</span>
        <div className="text-outline-variant group-hover:text-primary transition-colors">{icon}</div>
      </div>
      <div className="h-1 w-full bg-outline-variant rounded-full relative overflow-hidden">
        <div className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
}

function PortfolioView({ onStockClick, watchlistStocks, cashBalance }: { 
  onStockClick: (s: Stock) => void,
  watchlistStocks: Stock[],
  cashBalance: number
}) {
  return (
    <div className="px-4 pt-6 space-y-6">
      {/* Portfolio Hero Summary */}
      <section className="bg-surface-container rounded-xl p-6 border border-outline-variant shadow-2xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="font-mono text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-widest">Total Portfolio Value</p>
            <h2 className="font-headline text-3xl font-bold text-on-surface tracking-tight">SGD 142,850.42</h2>
          </div>
          <div className="bg-up/20 text-up px-2 py-1 rounded text-[10px] font-bold font-mono animate-pulse">LIVE</div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="font-mono text-[10px] font-bold text-on-surface-variant uppercase opacity-70">Today's P/L</p>
            <p className="font-mono text-sm font-bold text-up">+$1,240.15 (+0.87%)</p>
          </div>
          <div className="space-y-1 border-l border-outline-variant pl-4">
            <p className="font-mono text-[10px] font-bold text-on-surface-variant uppercase opacity-70">Total P/L</p>
            <p className="font-mono text-sm font-bold text-up">+$14,200.80 (+11.04%)</p>
          </div>
        </div>

        {/* Cash Balance */}
        <div className="mt-6 pt-6 border-t border-outline-variant/30 flex justify-between items-center">
           <div className="flex items-center gap-2">
             <Wallet className="w-4 h-4 text-primary" />
             <span className="font-mono text-[10px] font-bold text-on-surface-variant uppercase">Available Cash</span>
           </div>
           <span className="font-mono text-sm font-bold text-on-surface">SGD {cashBalance.toFixed(2)}</span>
        </div>

        {/* Distribution Visualization */}
        <div className="mt-8 space-y-3">
          <div className="flex justify-between font-mono text-[10px] font-bold text-on-surface-variant opacity-80 uppercase tracking-widest">
            <span>Sector Allocation</span>
            <span>100% Deployed</span>
          </div>
          <div className="h-2 w-full flex rounded-full overflow-hidden bg-surface-container-highest">
            <div className="h-full bg-primary w-[40%]" title="REITS"></div>
            <div className="h-full bg-secondary-container w-[25%]" title="Finance"></div>
            <div className="h-full bg-on-secondary-container w-[20%]" title="Industrial"></div>
            <div className="h-full bg-outline-variant w-[15%]" title="Others"></div>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
            <AllocationLegend color="bg-primary" label="REITS" percent={40} />
            <AllocationLegend color="bg-secondary-container" label="FINANCE" percent={25} />
            <AllocationLegend color="bg-on-secondary-container" label="IND" percent={20} />
          </div>
        </div>
      </section>

      {/* Holdings Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-headline text-lg font-bold text-on-surface">Holdings</h3>
          <span className="font-mono text-[10px] font-bold text-primary cursor-pointer hover:underline uppercase tracking-wide">View All</span>
        </div>
        <div className="space-y-2">
          {PORTFOLIO_HOLDINGS.map((holding) => (
            <div key={holding.ticker} 
                 className="bg-surface-container-low p-4 rounded-lg border border-outline-variant hover:bg-surface-container-high transition-all cursor-pointer group active:scale-[99%]">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-mono text-sm font-bold text-primary group-hover:brightness-110 transition-all">{holding.ticker}</p>
                  <p className="font-sans text-[11px] text-on-surface-variant font-medium">{holding.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-bold text-on-surface">{holding.price.toFixed(2)}</p>
                  <p className={`font-mono text-[10px] font-bold ${holding.changePercent >= 0 ? 'text-up' : 'text-down'}`}>
                    {holding.changePercent >= 0 ? '+' : ''}{holding.changePercent.toFixed(2)}%
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-outline-variant/30 flex justify-between items-end">
                <div className="opacity-70">
                  <p className="font-mono text-[10px] font-bold text-on-surface-variant">QTY: {holding.qty.toLocaleString()}</p>
                  <p className="font-mono text-[10px] font-bold text-on-surface-variant">AVG: {holding.avgPrice.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className={`font-mono text-sm font-bold ${holding.totalGain >= 0 ? 'text-up' : 'text-down'}`}>
                    {holding.totalGain >= 0 ? '+' : '-'}${Math.abs(holding.totalGain).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Watchlist Summary */}
      <section className="space-y-4">
        <h3 className="font-headline text-lg font-bold text-on-surface">Watchlist</h3>
        <div className="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant">
          {watchlistStocks.map((stock) => (
            <div key={stock.ticker} onClick={() => onStockClick(stock)} 
                 className={`flex items-center justify-between p-4 hover:bg-surface-container-highest transition-colors cursor-pointer group border-b border-outline-variant last:border-none active:bg-surface-container-highest`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center border border-outline-variant/30 group-hover:border-primary transition-colors">
                  <span className="font-bold text-primary font-mono text-xs">{stock.ticker.split('.')[0]}</span>
                </div>
                <div>
                  <p className="font-mono text-sm font-bold text-on-surface">{stock.ticker}</p>
                  <p className="font-sans text-[11px] text-on-surface-variant font-medium">{stock.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-bold text-on-surface">{stock.price.toFixed(3)}</p>
                <p className={`font-mono text-[10px] font-bold ${stock.changePercent >= 0 ? 'text-up' : 'text-down'}`}>
                  {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </p>
              </div>
            </div>
          ))}
          {watchlistStocks.length === 0 && (
            <div className="p-8 text-center text-on-surface-variant font-mono text-xs opacity-50">
              No items in watchlist
            </div>
          )}
        </div>
      </section>

      {/* Market Sentiment (STI) */}
      <section className="bg-surface-container-low p-6 rounded-xl border border-outline-variant">
        <div className="flex justify-between items-center mb-6">
          <p className="font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-70">Market Sentiment (STI)</p>
          <TrendingUp className="text-primary w-4 h-4" />
        </div>
        <div className="relative h-32 w-full overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="sentimentGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'var(--color-primary)', stopOpacity: 0.3 }} />
                <stop offset="100%" style={{ stopColor: 'var(--color-primary)', stopOpacity: 0 }} />
              </linearGradient>
            </defs>
            <path d="M0,80 Q50,70 100,75 T200,40 T300,50 T400,20 L400,100 L0,100 Z" fill="url(#sentimentGradient)" />
            <path d="M0,80 Q50,70 100,75 T200,40 T300,50 T400,20" fill="transparent" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div className="flex justify-between mt-4 font-mono text-[10px] font-bold text-on-surface-variant opacity-50 px-1 uppercase tracking-tighter">
          <span>09:00</span>
          <span>12:00</span>
          <span>15:00</span>
          <span>17:00 (Close)</span>
        </div>
      </section>
    </div>
  );
}

function AllocationLegend({ color, label, percent }: { color: string, label: string, percent: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${color}`}></div>
      <span className="font-mono text-[10px] font-bold text-on-surface-variant opacity-80">{label} {percent}%</span>
    </div>
  );
}

function SocialView({ friends, onAddFriend }: { friends: Friend[], onAddFriend: () => void }) {
  const sortedFriends = [...friends].sort((a, b) => b.totalGain - a.totalGain);

  return (
    <div className="px-4 pt-6 space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-headline font-bold">Terminal Leagues</h2>
        <button 
          onClick={onAddFriend}
          className="flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-xl border border-outline-variant hover:bg-surface-container-highest transition-all active:scale-95"
        >
          <UserPlus className="w-4 h-4 text-primary" />
          <span className="font-mono text-[10px] font-bold text-on-surface-variant">ADD FRIEND</span>
        </button>
      </div>

      {/* Global/Friends Toggle */}
      <div className="flex bg-surface-container p-1 rounded-xl border border-outline-variant">
        <button className="flex-1 py-2 bg-secondary-container text-on-secondary-container rounded-lg font-mono text-[10px] font-bold uppercase transition-all">Friends</button>
        <button className="flex-1 py-2 text-on-surface-variant font-mono text-[10px] font-bold uppercase transition-all hover:bg-surface-container-high rounded-lg">Global</button>
      </div>

      {/* Top 3 Podium (Mental simulation of rank) */}
      <div className="flex items-end justify-center gap-2 pt-12 pb-6">
        {/* Rank 2 */}
        {sortedFriends[1] && (
          <div className="flex flex-col items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-full bg-surface-container-highest border-2 border-outline-variant flex items-center justify-center text-on-surface relative">
               {sortedFriends[1].avatar}
               <div className="absolute -top-2 -right-2 bg-slate-400 text-slate-950 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold italic">2nd</div>
            </div>
            <span className="font-mono text-[10px] font-bold max-w-[60px] truncate">{sortedFriends[1].name.split(' ')[0]}</span>
          </div>
        )}
        
        {/* Rank 1 */}
        {sortedFriends[0] && (
          <div className="flex flex-col items-center gap-2 -mt-4">
            <Medal className="w-8 h-8 text-yellow-500 mb-1 animate-bounce" />
            <div className="w-16 h-16 rounded-full bg-primary/10 border-4 border-primary flex items-center justify-center text-primary text-xl font-bold relative shadow-lg shadow-primary/20">
               {sortedFriends[0].avatar}
               <div className="absolute -top-3 -right-3 bg-yellow-500 text-yellow-950 w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold italic border-2 border-surface">1st</div>
            </div>
            <span className="font-headline font-bold text-sm tracking-tight">{sortedFriends[0].name.split(' ')[0]}</span>
          </div>
        )}

        {/* Rank 3 */}
        {sortedFriends[2] && (
          <div className="flex flex-col items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-full bg-surface-container-highest border-2 border-outline-variant/50 flex items-center justify-center text-on-surface relative">
               {sortedFriends[2].avatar}
               <div className="absolute -top-2 -right-2 bg-amber-700 text-amber-100 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold italic">3rd</div>
            </div>
            <span className="font-mono text-[10px] font-bold max-w-[60px] truncate">{sortedFriends[2].name.split(' ')[0]}</span>
          </div>
        )}
      </div>

      {/* Leaderboard Table */}
      <section className="bg-surface-container rounded-2xl border border-outline-variant overflow-hidden">
        <div className="bg-surface-container-high px-4 py-3 border-b border-outline-variant flex justify-between items-center">
          <span className="font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Rankings</span>
          <span className="font-mono text-[10px] font-bold text-primary uppercase tracking-widest">Earnings (SGD)</span>
        </div>
        <div className="divide-y divide-outline-variant/30">
          {sortedFriends.map((friend, idx) => (
            <div key={friend.id} className={`flex items-center justify-between p-4 transition-colors ${friend.isCurrentUser ? 'bg-primary/5' : 'hover:bg-surface-container-highest'}`}>
              <div className="flex items-center gap-4">
                <span className={`font-mono font-bold text-sm w-4 ${idx === 0 ? 'text-primary' : 'text-on-surface-variant'}`}>{idx + 1}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${friend.isCurrentUser ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface-variant opacity-60'}`}>
                  {friend.avatar}
                </div>
                <div>
                   <span className={`font-headline text-sm font-bold ${friend.isCurrentUser ? 'text-primary' : 'text-on-surface'}`}>{friend.name}</span>
                   {friend.isCurrentUser && <span className="ml-2 text-[8px] font-mono bg-primary/20 text-primary px-1.5 py-0.5 rounded tracking-widest font-bold">ME</span>}
                </div>
              </div>
              <div className="text-right">
                <div className={`font-mono text-sm font-bold ${friend.totalGain >= 0 ? 'text-up' : 'text-down'}`}>
                  ${friend.totalGain.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div className={`font-mono text-[9px] font-bold opacity-60 ${friend.totalGainPercent >= 0 ? 'text-up' : 'text-down'}`}>
                  {friend.totalGainPercent >= 0 ? '+' : ''}{friend.totalGainPercent.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Social Tip */}
      <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex gap-3">
        <Users className="w-5 h-5 text-primary shrink-0" />
        <p className="text-[11px] text-on-surface-variant leading-relaxed">
          Invite friends to earn <span className="text-primary font-bold">50 Terminal Coins</span> for every successful referral! Top the weekly leaderboard to win an exclusive "Whale" badge.
        </p>
      </div>
    </div>
  );
}

function RewardsView({ coins, milestones, onClaim, onRedeem }: { 
  coins: number, 
  milestones: Milestone[], 
  onClaim: (id: string) => void,
  onRedeem: (amount: number) => void
}) {
  return (
    <div className="px-4 pt-6 space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-headline font-bold">Investor Rewards</h2>
        <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-xl border border-primary/20">
          <Coins className="w-5 h-5 text-primary" />
          <span className="font-mono text-lg font-bold text-primary">{coins}</span>
        </div>
      </div>

      {/* Redemption Card */}
      <section className="bg-surface-container rounded-xl p-6 border border-outline-variant relative overflow-hidden group">
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            <h3 className="font-headline font-bold">Redeem for Cash</h3>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">Exchange your hard-earned Terminal Coins for actual investment cash to buy more shares.</p>
          <div className="flex gap-2">
            <button 
              onClick={() => onRedeem(100)}
              disabled={coins < 100}
              className="flex-1 bg-primary text-on-primary h-10 rounded-lg font-mono text-[10px] font-bold uppercase transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
            >
              100 Coins → $10
            </button>
            <button 
              onClick={() => onRedeem(500)}
              disabled={coins < 500}
              className="flex-1 bg-primary text-on-primary h-10 rounded-lg font-mono text-[10px] font-bold uppercase transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
            >
              500 Coins → $50
            </button>
          </div>
        </div>
        <Coins className="absolute -right-8 -bottom-8 w-32 h-32 text-primary opacity-5 group-hover:scale-110 transition-transform duration-700" />
      </section>

      {/* Milestones List */}
      <section className="space-y-4">
        <h3 className="font-headline text-lg font-bold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Milestones
        </h3>
        <div className="space-y-3">
          {milestones.map((m) => {
            const progress = Math.min(100, (m.current / m.target) * 100);
            return (
              <div key={m.id} className="bg-surface-container-low p-5 rounded-xl border border-outline-variant space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-headline font-bold text-on-surface">{m.title}</h4>
                    <p className="text-[11px] text-on-surface-variant mt-1 leading-snug">{m.description}</p>
                  </div>
                  {m.claimed ? (
                    <div className="bg-up/10 text-up px-3 py-1 rounded-full flex items-center gap-1.5 font-mono text-[10px] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      CLAIMED
                    </div>
                  ) : m.completed ? (
                    <button 
                      onClick={() => onClaim(m.id)}
                      className="bg-primary text-on-primary px-4 py-1.5 rounded-lg font-mono text-[10px] font-bold shadow-lg shadow-primary/20 active:scale-95 transition-transform"
                    >
                      CLAIM {m.reward} COINS
                    </button>
                  ) : (
                    <div className="bg-surface-container-highest text-on-surface-variant/40 px-3 py-1 rounded-full font-mono text-[10px] font-bold">
                      {m.reward} COINS
                    </div>
                  )}
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between font-mono text-[9px] font-bold uppercase tracking-wider opacity-60">
                    <span>Progress</span>
                    <span>{m.current.toLocaleString()}{m.unit} / {m.target.toLocaleString()}{m.unit}</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className={`h-full ${m.completed ? 'bg-up' : 'bg-primary'}`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function StockDetailView({ stock, onBack, toggleWatchlist, isWatchlisted }: { 
  stock: Stock, 
  onBack: () => void,
  toggleWatchlist: (s: Stock) => void,
  isWatchlisted: boolean
}) {
  return (
    <div className="flex flex-col gap-4 pt-4 px-4">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-2">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-surface-container transition-colors active:scale-95">
          <RotateCcw className="w-5 h-5 -rotate-90" />
        </button>
        <div>
          <span className="font-mono text-[10px] font-bold text-primary tracking-widest opacity-80">SGX: {stock.ticker}</span>
          <h2 className="font-headline text-xl font-bold leading-tight">{stock.name}</h2>
        </div>
      </div>

      {/* Price Summary */}
      <div className="flex justify-between items-end mb-4">
        <div>
           <div className="font-headline text-[36px] font-bold tracking-tight text-on-surface leading-none">{stock.price.toFixed(2)}</div>
           <div className={`flex items-center text-sm font-mono font-bold mt-1 ${stock.changePercent >= 0 ? 'text-up' : 'text-down'}`}>
             {stock.changePercent >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
             {Math.abs(stock.change).toFixed(2)} ({Math.abs(stock.changePercent).toFixed(2)}%)
           </div>
        </div>
        <div className="bg-surface-container px-3 py-1.5 rounded-lg border border-outline-variant/30 font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
          High Price
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-surface-container border border-outline-variant rounded-xl p-4 h-[320px] relative overflow-hidden flex flex-col shadow-inner">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
            {['1D', '1W', '1M', '1Y', 'ALL'].map((p, idx) => (
              <button key={p} className={`px-3 py-1 rounded-full font-mono text-[10px] font-bold transition-all ${
                idx === 0 ? 'bg-primary text-on-primary font-bold' : 'text-on-surface-variant/70 hover:text-on-surface'
              }`}>
                {p}
              </button>
            ))}
          </div>
          <button className="p-1.5 rounded-lg hover:bg-surface-container-highest transition-colors active:scale-90">
             <Maximize2 className="text-on-surface-variant w-4 h-4" />
          </button>
        </div>
        
        <div className="flex-grow w-full relative">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 200">
            {/* Grid */}
            <line stroke="currentColor" strokeWidth="0.5" x1="0" x2="400" y1="40" y2="40" className="text-outline-variant/20" />
            <line stroke="currentColor" strokeWidth="0.5" x1="0" x2="400" y1="120" y2="120" className="text-outline-variant/20" />
            
            {/* Candlesticks (Mock) */}
            <g className="opacity-80">
              <Candle x={20} y={150} h={40} up />
              <Candle x={50} y={130} h={30} up />
              <Candle x={80} y={140} h={20} />
              <Candle x={110} y={100} h={50} up />
              <Candle x={140} y={80} h={30} up />
              <Candle x={170} y={90} h={15} />
              <Candle x={200} y={50} h={60} up />
              <Candle x={230} y={70} h={20} up />
              <Candle x={260} y={85} h={25} />
              <Candle x={290} y={40} h={50} up />
              <Candle x={320} y={30} h={30} up />
              <Candle x={350} y={35} h={20} up />
            </g>
          </svg>
          
          <div className="absolute top-8 right-8 bg-surface-container-highest/90 backdrop-blur border border-outline-variant p-2.5 rounded-lg shadow-2xl">
            <div className="font-mono text-[9px] font-bold text-on-surface-variant mb-0.5 opacity-70 uppercase tracking-widest">Vol 1.2M</div>
            <div className="font-mono text-[14px] font-bold text-primary">${stock.price.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 my-2">
        <button 
          onClick={() => toggleWatchlist(stock)}
          className={`flex-1 border h-12 flex items-center justify-center gap-2 transition-all rounded-xl active:scale-95 group ${
            isWatchlisted 
              ? 'bg-primary/10 border-primary text-primary' 
              : 'bg-surface-container border-outline-variant text-on-surface hover:bg-surface-container-high'
          }`}
        >
          <Eye className={`w-5 h-5 transition-colors ${isWatchlisted ? 'fill-primary' : 'text-on-surface-variant group-hover:text-primary'}`} />
          <span className="font-mono text-[11px] font-bold tracking-widest uppercase">
            {isWatchlisted ? 'Watching' : 'Watchlist'}
          </span>
        </button>
        <button className="flex-1 bg-primary-container text-on-primary-container h-12 flex items-center justify-center gap-2 hover:brightness-110 transition-all rounded-xl active:scale-95 shadow-lg shadow-primary-container/20">
          <Wallet className="w-5 h-5 text-on-primary-container" />
          <span className="font-mono text-[11px] font-bold tracking-widest uppercase">Trade</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <section className="grid grid-cols-2 gap-3">
        <MetricItem label="MARKET CAP" value="S$92.41B" />
        <MetricItem label="P/E RATIO" value="9.14" />
        <MetricItem label="DIV YIELD" value="5.42%" />
        <MetricItem label="BETA (5Y)" value="0.86" />
      </section>

      {/* News Section */}
      <section className="mt-4 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-headline text-lg font-bold">Financial News</h3>
          <span className="font-mono text-primary text-[10px] font-bold hover:underline cursor-pointer uppercase tracking-widest">View All</span>
        </div>
        <div className="space-y-6">
          {NEWS_FEED.map((news) => (
            <div key={news.id} className="flex gap-4 items-start pb-6 border-b last:border-none border-outline-variant/30 hover:opacity-90 cursor-pointer group">
              <div className="flex-grow min-w-0">
                <span className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded-sm tracking-wider ${news.tag === 'ANALYSIS' ? 'bg-tertiary-container text-on-tertiary-container' : 'text-primary'}`}>
                  {news.source}
                </span>
                <h4 className="font-sans text-sm font-semibold text-on-surface leading-snug mt-1.5 group-hover:text-primary transition-colors line-clamp-2">
                  {news.title}
                </h4>
                <p className="text-on-surface-variant text-[10px] mt-2 font-medium opacity-60">
                  {news.time} • {news.readTime}
                </p>
              </div>
              <div className="w-20 h-20 bg-surface-container-highest rounded-xl overflow-hidden flex-shrink-0 border border-outline-variant/30 group-hover:border-primary transition-colors">
                <img 
                  className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 active:scale-110" 
                  src={news.imageUrl} 
                  alt="" 
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Candle({ x, y, h, up }: { x: number, y: number, h: number, up?: boolean }) {
  const color = up ? 'text-up' : 'text-down';
  return (
    <g className={color}>
      {/* Wick */}
      <line stroke="currentColor" strokeWidth="1" x1={x + 4} x2={x + 4} y1={y - 10} y2={y + h + 10} />
      {/* Body */}
      <rect x={x} y={y} width="8" height={Math.max(2, h)} fill="currentColor" strokeWidth="0" rx="1" />
    </g>
  );
}

function MetricItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="bg-surface-container p-4 border border-outline-variant rounded-xl hover:bg-surface-container-high transition-colors active:scale-95 cursor-pointer">
      <div className="font-mono text-on-surface-variant/70 text-[10px] font-bold mb-1 uppercase tracking-widest">{label}</div>
      <div className="font-mono text-on-surface text-lg font-bold">{value}</div>
    </div>
  );
}

function BottomNavBar({ activeTab, onTabChange }: { activeTab: Tab, onTabChange: (t: Tab) => void }) {
  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-2 py-2 pb-safe bg-surface-container border-t border-outline-variant z-50 shadow-2xl backdrop-blur-lg">
      <NavItem 
        icon={<LayoutDashboard className="w-6 h-6" />} 
        label="Market" 
        active={activeTab === Tab.MARKET} 
        onClick={() => onTabChange(Tab.MARKET)} 
      />
      <NavItem 
        icon={<Filter className="w-6 h-6" />} 
        label="Screener" 
        active={activeTab === Tab.SCREENER} 
        onClick={() => onTabChange(Tab.SCREENER)} 
      />
      <NavItem 
        icon={<Eye className="w-6 h-6" />} 
        label="Watchlist" 
        active={activeTab === Tab.WATCHLIST} 
        onClick={() => onTabChange(Tab.WATCHLIST)} 
      />
      <NavItem 
        icon={<Wallet className="w-6 h-6" />} 
        label="Portfolio" 
        active={activeTab === Tab.PORTFOLIO} 
        onClick={() => onTabChange(Tab.PORTFOLIO)} 
      />
      <NavItem 
        icon={<Users className="w-6 h-6" />} 
        label="Social" 
        active={activeTab === Tab.SOCIAL} 
        onClick={() => onTabChange(Tab.SOCIAL)} 
      />
    </nav>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all scale-95 active:scale-90 relative ${
        active ? 'bg-secondary-container text-on-secondary-container px-6' : 'text-on-surface-variant hover:text-on-surface'
      }`}
    >
      <div className={`${active ? 'scale-110' : ''} transition-transform duration-300`}>
        {icon}
      </div>
      <span className="font-mono text-[10px] font-bold mt-1 uppercase tracking-tighter">{label}</span>
      {active && (
        <motion.div 
          layoutId="tab-active" 
          className="absolute inset-0 bg-primary/10 rounded-2xl -z-10" 
          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
        />
      )}
    </button>
  );
}
