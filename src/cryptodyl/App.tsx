// File: src/cryptodyl/App.tsx
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BrowserRouter as Router,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import {
  bgGridImage,
  bgHeroImage,
  bgSectionImage,
  categoryCasinosImage,
  categoryEventsImage,
  categoryPassiveIncomeImage,
  cryptodylHeroImage,
  cryptodylLogoImage,
} from '@/lib/assets';

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */
interface Post {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  authorAvatar: string;
  date: string;
  views: number;
  comments: number;
  category: string;
}

interface User {
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  joined: string;
}

type PostDraft = Omit<Post, 'id'>;

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */
const HERO_IMAGE = cryptodylHeroImage;
const POST_STORAGE_KEY = 'cryptodyl_posts';
const ADMIN_STORAGE_KEY = 'cryptodyl_admin';
const USERS_STORAGE_KEY = 'cryptodyl_users';
const LOGGED_IN_USER_KEY = 'cryptodyl_logged_in_user';

const DEFAULT_AVATAR =
  'https://cryptodyl.com/images/1775422489.png';

const CATEGORIES = [
  {
    slug: 'casinos',
    name: 'Casinos',
    image: categoryCasinosImage,
    description: 'Best crypto casino reviews, bonuses, and betting guides.',
  },
  {
    slug: 'events',
    name: 'Events',
    image: categoryEventsImage,
    description: 'Crypto events, giveaways, and community celebrations.',
  },
  {
    slug: 'passive-crypto-earning',
    name: 'Passive Crypto Earning',
    image: categoryPassiveIncomeImage,
    description: 'Guides to earning passive income with crypto platforms.',
  },
];

const initialPosts: Post[] = [
  {
    id: 1,
    title: 'Thunderpick Casino Review 2025 – Best Crypto Casino Bonus Up to $2000',
    excerpt: 'Discover Thunderpick, one of the best crypto casinos in 2025. Claim a 100% bonus up to $2000 with fast payouts.',
    content: `The crypto casino space is more competitive than ever in 2025, but one platform is dominating the scene right now: Thunderpick.\n\nFrom massive casino bonuses and esports betting to lightning-fast crypto payouts, Thunderpick has quickly become one of the most talked-about crypto gambling platforms online.\n\n## Claim a 100% Bonus Up to $2000\n\nRight now, new Thunderpick users can unlock a 100% Welcome Bonus Up To $2000. That means your deposit instantly gets doubled.\n\nBonus Examples:\n- Deposit $100 → Get $200 to play with\n- Deposit $500 → Get $1000\n- Deposit $2000 → Start with $4000\n\n## Why Thunderpick Is Blowing Up\n\nThunderpick isn't just another gambling website. It combines crypto casinos, sports betting, esports betting, and VIP rewards into one complete platform.\n\nFeatures Players Love:\n- Huge casino game selection\n- Sports betting with competitive odds\n- Massive esports betting markets\n- Daily competitions and leaderboard rewards\n- Regular giveaways and promotions\n- Fast crypto deposits and withdrawals\n- VIP rank system with extra rewards\n- VPN friendly access\n- Provably fair gaming system\n\nThe platform is designed for crypto users who want speed, privacy, rewards, and nonstop action.\n\n## Supported Cryptocurrencies\n\nThunderpick supports many of the most popular cryptocurrencies including: BTC, ETH, BNB, USDT, XRP, DOGE, LTC, BCH, TRX.\n\n## Final Verdict\n\nIf you're searching for the best crypto casino in 2025, Thunderpick is absolutely worth checking out. The current 100% bonus up to $2000 gives new users a huge advantage.`,
    image: 'https://cryptodyl.com/uploads/1778517620.jpg',
    author: 'Dylan',
    authorAvatar: DEFAULT_AVATAR,
    date: '2 days ago',
    views: 76,
    comments: 2,
    category: 'casinos',
  },
  {
    id: 2,
    title: 'CryptoDyl Is Back — Celebrate With a 2x $2.5 BNB Giveaway!',
    excerpt: 'CryptoDyl is officially back after a short break. Celebrate with a 2x $2.5 BNB giveaway event.',
    content: "We are thrilled to announce CryptoDyl's return. To celebrate, we are running a giveaway where 2 lucky winners will each receive $2.5 worth of BNB. Stay tuned for more crypto content and passive income guides.",
    image: 'https://cryptodyl.com/uploads/1778179992.jpg',
    author: 'Dylan',
    authorAvatar: DEFAULT_AVATAR,
    date: '5 days ago',
    views: 32,
    comments: 0,
    category: 'events',
  },
  {
    id: 3,
    title: 'The Ultimate Grass.io Passive Income Guide (2026) – Earn Crypto by Sharing Bandwidth',
    excerpt: 'Learn how to earn passive income with Grass.io crypto in 2026. Complete beginner guide to maximizing earnings.',
    content: 'Grass.io is one of the leading platforms for earning passive crypto income by sharing unused internet bandwidth. In this 2026 guide, learn step-by-step setup, optimal node configuration, security tips, and how to withdraw your earnings efficiently. Start earning today with minimal effort.',
    image: 'https://cryptodyl.com/uploads/1775555063.png',
    author: 'Dylan',
    authorAvatar: DEFAULT_AVATAR,
    date: '1 month ago',
    views: 118,
    comments: 2,
    category: 'passive-crypto-earning',
  },
  {
    id: 4,
    title: 'Ultimate Guide to Honeygain: How to Start Earning Passive Income (2026)',
    excerpt: 'Start earning passive income with Honeygain. Learn how it works, maximize earnings, and get the best tips.',
    content: 'Honeygain allows you to monetize your internet connection by sharing bandwidth with businesses. This comprehensive 2026 guide covers installation on all devices, referral strategies, payout methods, and how to earn up to $50 monthly passively. Perfect for beginners looking to generate crypto income.',
    image: 'https://cryptodyl.com/uploads/1775426310.png',
    author: 'Dylan',
    authorAvatar: DEFAULT_AVATAR,
    date: '1 month ago',
    views: 184,
    comments: 3,
    category: 'passive-crypto-earning',
  },
];

const initialUsers: User[] = [
  {
    username: 'Dylan',
    displayName: 'Dylan',
    avatar: DEFAULT_AVATAR,
    bio: 'Crypto enthusiast, passive income explorer, and content creator sharing the best crypto guides since 2024.',
    joined: 'January 2024',
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const val = localStorage.getItem(key);
    return val ? (JSON.parse(val) as T) : fallback;
  } catch {
    return fallback;
  }
}

function readPosts(): Post[] {
  return readStorage<Post[]>(POST_STORAGE_KEY, initialPosts);
}

function readUsers(): User[] {
  return readStorage<User[]>(USERS_STORAGE_KEY, initialUsers);
}

function readAdmin(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
}

function readLoggedInUser(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(LOGGED_IN_USER_KEY);
}

function createDraft(post?: Post): PostDraft {
  return post
    ? {
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image,
      author: post.author,
      authorAvatar: post.authorAvatar,
      date: post.date,
      views: post.views,
      comments: post.comments,
      category: post.category,
    }
    : {
      title: '',
      excerpt: '',
      content: '',
      image: HERO_IMAGE,
      author: 'Dylan',
      authorAvatar: DEFAULT_AVATAR,
      date: 'Just now',
      views: 0,
      comments: 0,
      category: 'casinos',
    };
}

/* ------------------------------------------------------------------ */
/*  Motion presets                                                     */
/* ------------------------------------------------------------------ */
const pageMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 12 },
};

/* ------------------------------------------------------------------ */
/*  Components                                                         */
/* ------------------------------------------------------------------ */

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

/* -- Navbar -------------------------------------------------------- */
function Navbar({
  isAdmin,
  loggedUser,
  onLogout,
  onSearchOpen,
}: {
  isAdmin: boolean;
  loggedUser: string | null;
  onLogout: () => void;
  onSearchOpen: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`site-navbar glass ${scrolled ? 'nav-scrolled' : ''}`}
    >
      <div className="flex h-full w-full items-center justify-between gap-4 px-8">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 text-white transition hover:opacity-85"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[linear-gradient(135deg,#0a1530,#0b1a40_55%,#1a0a05)] shadow-lg">
            <img src={cryptodylLogoImage} alt="" className="h-6 w-6 object-contain" />
          </div>
          <div className="leading-none">
            <div className="text-base font-semibold tracking-tight">CryptoDyl</div>
          </div>
        </Link>

        {/* Hamburger */}
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white md:hidden"
          aria-label="Toggle menu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/popular">Popular</NavLink>
          <NavLink to="/categories">Categories</NavLink>
          <NavLink to="/archives">Archives</NavLink>
          <button
            onClick={onSearchOpen}
            className="nav-link rounded-xl px-4 py-2 text-sm text-white/60 transition hover:bg-white/10 hover:text-white font-medium"
          >
            Search
          </button>

          <div className="ml-4 flex items-center gap-3 pl-4 border-l border-white/10">
            {loggedUser && (
              <Link
                to={`/profile/${loggedUser}`}
                className="text-sm text-zinc-400 transition hover:text-white"
              >
                {loggedUser}
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className="text-sm font-medium text-accent transition hover:opacity-80"
              >
                Admin
              </Link>
            )}
            {loggedUser ? (
              <button
                onClick={onLogout}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-black transition hover:opacity-90"
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10 bg-[#0a0e1a] md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 pb-4 pt-2">
              <MobileNavLink to="/" onClick={() => setMobileOpen(false)}>Home</MobileNavLink>
              <MobileNavLink to="/popular" onClick={() => setMobileOpen(false)}>Popular</MobileNavLink>
              <MobileNavLink to="/categories" onClick={() => setMobileOpen(false)}>Categories</MobileNavLink>
              <MobileNavLink to="/archives" onClick={() => setMobileOpen(false)}>Archives</MobileNavLink>
              <button onClick={() => { onSearchOpen(); setMobileOpen(false); }} className="w-full rounded-xl px-4 py-3 text-left text-sm text-zinc-400 transition hover:bg-white/10 hover:text-white">Search</button>
              <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-2">
                {loggedUser && <MobileNavLink to={`/profile/${loggedUser}`} onClick={() => setMobileOpen(false)}>{loggedUser}</MobileNavLink>}
                {isAdmin && <MobileNavLink to="/admin" onClick={() => setMobileOpen(false)}>Admin Panel</MobileNavLink>}
                {loggedUser ? (
                  <button onClick={() => { onLogout(); setMobileOpen(false); }} className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10">Logout</button>
                ) : (
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="w-full rounded-full bg-accent px-4 py-2.5 text-center text-sm font-medium text-black transition hover:opacity-90">Login</Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link
      to={to}
      className={`nav-link rounded-xl px-4 py-2 text-sm transition font-medium ${active
        ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]'
        : 'text-white/60 hover:bg-white/10 hover:text-white'
        }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ to, children, onClick }: { to: string; children: React.ReactNode; onClick?: () => void }) {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`w-full rounded-xl px-4 py-3 text-sm transition ${active ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/10 hover:text-white'
        }`}
    >
      {children}
    </Link>
  );
}

/* -- Search Modal --------------------------------------------------- */
function SearchModal({
  open,
  onClose,
  posts,
}: {
  open: boolean;
  onClose: () => void;
  posts: Post[];
}) {
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const results = q.trim()
    ? posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(q.toLowerCase()),
    )
    : [];

  function handleSelect(id: number) {
    setQ('');
    onClose();
    navigate(`/posts/${id}`);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: -10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: -10 }}
            className="w-full max-w-xl rounded-2xl p-6 shadow-2xl glass"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              autoFocus
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search guides..."
              className="w-full rounded-full border border-white/10 bg-black/50 px-5 py-3 text-white placeholder:text-zinc-500 outline-none focus:border-accent"
            />
            <div className="mt-4 space-y-2 max-h-80 overflow-y-auto">
              {results.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelect(p.id)}
                  className="w-full rounded-xl px-4 py-3 text-left text-sm text-zinc-300 transition hover:bg-white/5"
                >
                  <div className="font-medium text-white">{p.title}</div>
                  <div className="mt-0.5 text-xs text-zinc-500">{p.date} · {p.views} views</div>
                </button>
              ))}
              {q.trim() && results.length === 0 && (
                <p className="py-6 text-center text-sm text-zinc-500">No results found.</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* -- PostCard -------------------------------------------------------- */
function PostCard({
  post,
  variant = 'default',
}: {
  post: Post;
  variant?: 'default' | 'featured' | 'compact';
}) {
  const featured = variant === 'featured';
  const compact = variant === 'compact';

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 250, damping: 26 }}
      className="h-full"
    >
      <Link
        to={`/posts/${post.id}`}
        className={`post-card glass group block h-full ${featured ? 'rounded-[2rem]' : 'rounded-[1.75rem]'} ${compact ? 'compact' : ''}`}
      >
        <div className="relative">
          <img
            src={post.image}
            alt={post.title}
            className={`w-full ${compact ? 'aspect-[4/3]' : 'aspect-[16/9]'}`}
          />
          {!compact && (
            <span className="post-card__badge absolute top-3 right-3">
              {post.category}
            </span>
          )}
        </div>
        <div className="post-card__content">
          <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-zinc-500">
            <span>{post.date}</span>
            <span className="h-1 w-1 rounded-full bg-zinc-600" />
            <span>{post.views} views</span>
            {compact && (
              <>
                <span className="h-1 w-1 rounded-full bg-zinc-600" />
                <span className="post-card__badge">{post.category}</span>
              </>
            )}
          </div>
          <h3 className="post-card__title group-hover:text-accent transition-colors">
            {post.title}
          </h3>
          {!compact && (
            <p className="post-card__excerpt">{post.excerpt}</p>
          )}
          <div className="post-card__meta">
            <img
              src={post.authorAvatar}
              alt={post.author}
              className="size-7 rounded-full object-cover ring-2 ring-white/10"
            />
            <span className="text-xs font-medium text-zinc-400">
              {post.author}
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

/* -- Hero Section --------------------------------------------------- */
function HeroSection() {
  return (
    <section className="hero relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none -z-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/backgrounds/hero/city-glow.webp')", opacity: 0.08 }} />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/backgrounds/hero/cyber-grid.webp')", opacity: 0.12 }} />
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/backgrounds/overlays/light-beams.webp')", opacity: 0.10, mixBlendMode: 'screen' }} />
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/backgrounds/hero/glow-orbs.webp')", opacity: 0.20, mixBlendMode: 'screen' }} />
      </div>
      <div className="hero-text">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="hero-title hero__headline"
        >
          Decode the next wave<br />
          of crypto alpha.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Research-driven crypto intelligence, passive income systems,
          casino ecosystems, and Web3 strategies curated with brutal clarity.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-8 flex flex-wrap gap-4"
        >
          <Link
            to="/posts"
            className="btn-primary"
          >
            Explore guides
          </Link>
          <Link
            to="/popular"
            className="btn-secondary"
          >
            Trending now
          </Link>
        </motion.div>

        <div className="hero-stats">
          <div className="glass">
            <span>120+</span>
            <p>Guides</p>
          </div>
          <div className="glass">
            <span>42K</span>
            <p>Monthly readers</p>
          </div>
          <div className="glass">
            <span>2026</span>
            <p>Crypto insights</p>
          </div>
        </div>
      </div>
      <div className="hero-dashboard">
        <div className="dashboard-card glass large animate-float" style={{ animationDelay: '0s' }}>
          <span>BTC</span>
          <h3>$112,480</h3>
          <p>+12.4%</p>
        </div>

        <div className="dashboard-row">
          <div className="dashboard-card glass animate-float" style={{ animationDelay: '1.2s' }}>
            <span>ETH</span>
            <h4>$4,128</h4>
          </div>

          <div className="dashboard-card glass animate-float" style={{ animationDelay: '2.4s' }}>
            <span>SOL</span>
            <h4>$248</h4>
          </div>
        </div>

        <div className="dashboard-card glass wide relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent pointer-events-none" />
          <span>Trending Narrative</span>
          <h4>AI x DeFi</h4>
          <div className="mt-4 flex items-end gap-1 h-8">
            {[40, 70, 45, 90, 65, 80, 50, 95].map((h, i) => (
              <div key={i} className="flex-1 bg-accent/20 rounded-t-sm" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -- Home Page ------------------------------------------------------ */
function Home({ posts }: { posts: Post[] }) {
  const featured = posts[0] ?? initialPosts[0];
  const side = posts.slice(1, 4);

  return (
    <motion.main {...pageMotion} transition={{ duration: 0.35 }}>
      <HeroSection />
      <div className="absolute inset-x-0 h-40 bg-gradient-to-b from-transparent to-black/60 pointer-events-none z-10" />

      {/* Featured Posts */}
      <section className="w-full px-[5%] py-16 relative">
        <div className="absolute top-0 left-1/4 -z-10 h-64 w-64 rounded-full bg-accent/5 blur-[100px]" />
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-accent">Trending</p>
            <h2 className="mt-3 text-3xl text-white sm:text-4xl">
              Latest guides & reviews
            </h2>
          </div>
          <Link
            to="/posts"
            className="text-sm font-medium text-accent hover:opacity-80"
          >
            View all →
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 6).map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <PostCard post={p} />
            </motion.div>
          ))}
        </div>
      </section>

      <div className="section-divider" />

      {/* Categories strip */}
      <section className="w-full px-[5%] pb-20">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-accent">Browse</p>
            <h2 className="mt-3 text-2xl text-white">Categories</h2>
          </div>
          <Link to="/categories" className="text-sm font-medium text-accent hover:opacity-80">All categories →</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Link to={`/category/${cat.slug}`} className="cat-card" data-slug={cat.slug}>
                <img src={cat.image} alt={cat.name} />
                <div className="cat-card__bg mix-blend-overlay" style={{ backgroundImage: `url('/backgrounds/sections/${cat.slug === 'passive-crypto-earning' ? 'passive-income-bg' : cat.slug === 'casinos' ? 'casino-bg' : 'events-bg'}.webp')`, opacity: 0.15 }} />
                <div className="absolute inset-0 bg-black/40" />
                <div className="cat-card__content">
                  <h3 className="cat-card__title">{cat.name}</h3>
                  <p className="mt-2 text-sm text-zinc-400">{cat.description}</p>
                  <div className="mt-4 text-xs uppercase tracking-[0.3em] text-accent">Enter →</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.main>
  );
}

/* -- Posts Page ----------------------------------------------------- */
function PostsPage({ posts }: { posts: Post[] }) {
  const [search, setSearch] = useState('');

  const filtered = posts.filter((p) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.author.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  return (
    <motion.main {...pageMotion} className="w-full px-[5%] py-16">
      <div className="flex flex-col gap-6 mb-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-accent">All posts</p>
          <h1 className="mt-3 text-4xl text-white sm:text-5xl">Browse the full library</h1>
          <p className="mt-3 text-sm text-zinc-400">{posts.length} guides published</p>
        </div>
        <div className="relative w-full md:max-w-xs">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts..."
            className="w-full rounded-full border border-white/10 bg-black/50 px-5 py-3 text-white placeholder:text-zinc-500 outline-none focus:border-accent"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-zinc-500">No posts match your search.</div>
      )}
    </motion.main>
  );
}

/* -- Post Detail ---------------------------------------------------- */
function PostDetail({ posts }: { posts: Post[] }) {
  const { id } = useParams();
  const post = posts.find((p) => p.id === Number(id));

  if (!post) return <Navigate to="/posts" replace />;

  const contentParagraphs = post.content.split('\n\n').filter(Boolean);

  return (
    <motion.main {...pageMotion} className="relative max-w-4xl mx-auto px-6 py-12">
      <div className="absolute inset-0 pointer-events-none -z-0 overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/backgrounds/sections/market-bg.webp')", opacity: 0.20 }} />
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/backgrounds/overlays/fog.webp')", opacity: 0.20, mixBlendMode: 'screen' }} />
        <div className="absolute inset-0" style={{ backgroundImage: "url('/backgrounds/textures/scanlines.webp')", backgroundRepeat: 'repeat', opacity: 0.02 }} />
      </div>
      <article className="relative">
        <motion.img
          src={post.image}
          alt={post.title}
          className="w-full aspect-[16/9] object-cover rounded-2xl mb-8"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />

        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
          <Link to={`/profile/${post.author}`} className="flex items-center gap-2 transition hover:text-white">
            <img src={post.authorAvatar} alt={post.author} className="size-7 rounded-full object-cover ring-2 ring-white/10" />
            <span className="font-medium text-white">{post.author}</span>
          </Link>
          <span className="h-1 w-1 rounded-full bg-zinc-700" />
          <span>{post.date}</span>
          <span className="h-1 w-1 rounded-full bg-zinc-700" />
          <span>{post.views} views</span>
          <span className="h-1 w-1 rounded-full bg-zinc-700" />
          <span>{post.comments} comments</span>
        </div>

        <h1 className="text-4xl text-white sm:text-5xl">{post.title}</h1>

        <div className="mt-8 space-y-6 text-lg leading-8 text-zinc-300">
          {contentParagraphs.map((para, i) => {
            if (para.startsWith('## ')) {
              return (
                <h2 key={i} className="mt-10 text-2xl text-white">
                  {para.replace('## ', '')}
                </h2>
              );
            }
            if (para.startsWith('- ')) {
              return (
                <ul key={i} className="list-disc pl-6 space-y-1.5 text-zinc-300">
                  {para.split('\n').map((line, j) => (
                    <li key={j}>{line.replace(/^- /, '')}</li>
                  ))}
                </ul>
              );
            }
            return <p key={i}>{para}</p>;
          })}
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-white/10 pt-8">
          <Link
            to="/posts"
            className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
          >
            ← Back to all posts
          </Link>
          <Link
            to={`/profile/${post.author}`}
            className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
          >
            More from {post.author}
          </Link>
        </div>
      </article>
    </motion.main>
  );
}

/* -- Login Page ------------------------------------------------------ */
function LoginPage({
  onLogin,
}: {
  onLogin: (username: string) => void;
}) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (username.trim() && password === 'admin') {
      onLogin(username.trim());
      navigate('/admin');
      return;
    }
    setError('Invalid credentials. Use any username with password: admin');
  }

  return (
    <motion.main {...pageMotion} className="max-w-md mx-auto px-6 py-20">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <div className="text-sm uppercase tracking-[0.5em] text-accent">CryptoDyl</div>
        <h2 className="mt-3 text-3xl text-white sm:text-4xl">Welcome back.</h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm text-zinc-400">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-full border border-white/10 bg-black/50 px-5 py-3 text-white placeholder:text-zinc-500 outline-none focus:border-accent"
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-zinc-400">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-full border border-white/10 bg-black/50 px-5 py-3 text-white placeholder:text-zinc-500 outline-none focus:border-accent"
              placeholder="Enter password"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-full bg-accent px-5 py-3 font-medium text-black transition hover:opacity-90"
          >
            Sign in
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#0a0e1a] px-4 text-xs uppercase tracking-[0.3em] text-zinc-500">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            <svg viewBox="0 0 48 48" className="h-5 w-5">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            Sign in with Google
          </button>

          <p className="pt-2 text-center text-xs uppercase tracking-[0.3em] text-zinc-500">Demo: any username / admin</p>
        </form>
      </div>
    </motion.main>
  );
}

/* -- Register Page --------------------------------------------------- */
function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [done, setDone] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) return;
    setDone(true);
  }

  return (
    <motion.main {...pageMotion} className="max-w-md mx-auto px-6 py-20">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
        {done ? (
          <div className="text-center py-10">
            <div className="inline-flex size-16 items-center justify-center rounded-2xl bg-accent/10 text-4xl mb-6">✓</div>
            <h2 className="text-3xl font-serif italic text-white">Account created</h2>
            <p className="mt-3 text-zinc-400">You can now log in with your credentials.</p>
            <Link
              to="/login"
              className="mt-6 inline-block rounded-full bg-accent px-7 py-3 font-medium text-black transition hover:opacity-90"
            >
              Sign in
            </Link>
          </div>
        ) : (
          <>
            <div className="text-sm uppercase tracking-[0.5em] text-accent">Join the elite</div>
            <h2 className="mt-3 text-3xl font-serif italic text-white sm:text-4xl">Create your account</h2>
            <p className="mt-3 text-zinc-400">Sign up to comment, follow authors, and publish guides.</p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label className="mb-2 block text-sm text-zinc-400">Display name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-full border border-white/10 bg-black/50 px-5 py-3 text-white placeholder:text-zinc-500 outline-none focus:border-amber-400" placeholder="Your name" />
              </div>
              <div>
                <label className="mb-2 block text-sm text-zinc-400">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-full border border-white/10 bg-black/50 px-5 py-3 text-white placeholder:text-zinc-500 outline-none focus:border-amber-400" placeholder="you@example.com" />
              </div>
              <div>
                <label className="mb-2 block text-sm text-zinc-400">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-full border border-white/10 bg-black/50 px-5 py-3 text-white placeholder:text-zinc-500 outline-none focus:border-amber-400" placeholder="At least 6 characters" />
              </div>
              <button type="submit" className="w-full rounded-full bg-amber-400 px-5 py-3 font-medium text-black transition hover:bg-amber-300">Create account</button>
            </form>
            <p className="mt-6 text-center text-sm text-zinc-500">
              Already have an account?{' '}
              <Link to="/login" className="text-amber-400 hover:text-amber-300">Sign in</Link>
            </p>
          </>
        )}
      </div>
    </motion.main>
  );
}

/* -- Forgot Password Page ------------------------------------------- */
function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <motion.main {...pageMotion} className="max-w-md mx-auto px-6 py-20">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
        {sent ? (
          <div className="text-center py-10">
            <h2 className="text-3xl font-serif italic text-white">Check your email</h2>
            <p className="mt-3 text-zinc-400">We sent a reset link to <strong className="text-white">{email}</strong></p>
            <Link to="/login" className="mt-6 inline-block rounded-full bg-amber-400 px-7 py-3 font-medium text-black transition hover:bg-amber-300">Back to login</Link>
          </div>
        ) : (
          <>
            <div className="text-sm uppercase tracking-[0.5em] text-accent">Reset</div>
            <h2 className="mt-3 text-3xl text-white sm:text-4xl">Join CryptoDyl.</h2>
            <p className="mt-3 text-zinc-400">Enter your email and we'll send you a recovery link.</p>
            <form onSubmit={(e) => { e.preventDefault(); if (email.trim()) setSent(true); }} className="mt-8 space-y-4">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-full border border-white/10 bg-black/50 px-5 py-3 text-white placeholder:text-zinc-500 outline-none focus:border-amber-400" placeholder="you@example.com" />
              <button type="submit" className="w-full rounded-full bg-amber-400 px-5 py-3 font-medium text-black transition hover:bg-amber-300">Send reset link</button>
            </form>
            <p className="mt-6 text-center text-sm text-zinc-500">
              Remember your password?{' '}
              <Link to="/login" className="text-amber-400 hover:text-amber-300">Sign in</Link>
            </p>
          </>
        )}
      </div>
    </motion.main>
  );
}

/* -- Profile Page --------------------------------------------------- */
function ProfilePage({ posts, users }: { posts: Post[]; users: User[] }) {
  const { name } = useParams();
  const user = users.find((u) => u.username === name);

  if (!user) return <Navigate to="/" replace />;

  const userPosts = posts.filter((p) => p.author === user.username);

  return (
    <motion.main {...pageMotion} className="w-full px-[5%] py-16">
      <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
        <img src={user.avatar} alt={user.displayName} className="size-24 rounded-full object-cover ring-4 ring-white/10 sm:size-32" />
        <div>
          <h1 className="text-3xl text-white sm:text-4xl">{user.displayName}</h1>
          <p className="mt-2 max-w-lg text-zinc-400">{user.bio}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-4 text-sm text-zinc-500 sm:justify-start">
            <span>Joined {user.joined}</span>
            <span>·</span>
            <span>{userPosts.length} posts published</span>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl text-white">Posts by {user.displayName}</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {userPosts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
        {userPosts.length === 0 && (
          <p className="py-12 text-center text-zinc-500">No posts published yet.</p>
        )}
      </div>
    </motion.main>
  );
}

/* -- Popular Page --------------------------------------------------- */
function PopularPage({ posts }: { posts: Post[] }) {
  const sorted = [...posts].sort((a, b) => b.views - a.views);

  return (
    <motion.main {...pageMotion} className="w-full px-[5%] py-16">
      <p className="text-xs uppercase tracking-[0.4em] text-accent">Popular</p>
      <h1 className="mt-3 text-4xl text-white sm:text-5xl">Most read guides</h1>
      <p className="mt-3 text-zinc-400">Sorted by highest view count.</p>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {sorted.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </motion.main>
  );
}

/* -- Categories Page ------------------------------------------------- */
function CategoriesPage() {
  return (
    <motion.main {...pageMotion} className="w-full px-[5%] py-16">
      <p className="text-xs uppercase tracking-[0.4em] text-amber-400">Browse</p>
      <h1 className="mt-3 text-4xl text-white sm:text-5xl">Categories</h1>
      <p className="mt-3 text-zinc-400">Explore guides by topic.</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            to={`/category/${cat.slug}`}
            className="cat-card"
            data-slug={cat.slug}
          >
            <img src={cat.image} alt={cat.name} />
            <div className="cat-card__bg" style={{ backgroundImage: `url('/backgrounds/sections/${cat.slug === 'passive-crypto-earning' ? 'passive-income-bg' : cat.slug === 'casinos' ? 'casino-bg' : 'events-bg'}.webp')` }} />
            <div className="cat-card__content">
              <h2 className="cat-card__title">{cat.name}</h2>
              <p className="mt-1 text-sm text-zinc-400">{cat.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </motion.main>
  );
}

/* -- Category Posts Page -------------------------------------------- */
function CategoryPostsPage({ posts }: { posts: Post[] }) {
  const { slug } = useParams();
  const cat = CATEGORIES.find((c) => c.slug === slug);

  if (!cat) return <Navigate to="/categories" replace />;

  const filtered = posts.filter((p) => p.category === cat.slug);

  return (
    <motion.main {...pageMotion} className="w-full px-[5%] py-16">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-accent">{cat.name}</p>
          <h1 className="mt-3 text-4xl text-white sm:text-5xl">{cat.name}</h1>
          <p className="mt-3 text-zinc-400">{cat.description}</p>
        </div>
        <Link to="/categories" className="shrink-0 text-sm font-medium text-accent hover:opacity-80">All categories →</Link>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="mt-10 text-center py-20 text-zinc-500">No posts in this category yet.</div>
      )}
    </motion.main>
  );
}

/* -- Archives Page -------------------------------------------------- */
function ArchivesPage({ posts }: { posts: Post[] }) {
  const months = [
    { label: 'May 2026', year: 2026, month: 'May' },
    { label: 'April 2026', year: 2026, month: 'April' },
    { label: 'March 2026', year: 2026, month: 'March' },
  ];

  const counts = months.map((m) => ({
    ...m,
    count: posts.filter((p) => {
      const d = new Date(p.date.replace(' ago', ''));
      return !isNaN(d.getTime()) || p.date.includes('month') || p.date.includes('day');
    }).length,
  }));

  return (
    <motion.main {...pageMotion} className="w-full px-[5%] py-16">
      <p className="text-xs uppercase tracking-[0.4em] text-accent">Archive</p>
      <h1 className="mt-3 text-4xl text-white sm:text-5xl">Archives</h1>
      <p className="mt-3 text-zinc-400">Browse posts by month.</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {counts.map((m) => (
          <Link
            key={m.label}
            to={`/archive?month=${m.month}&year=${m.year}`}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20 hover:bg-white/10"
          >
            <div>
              <div className="text-lg text-white">{m.label}</div>
              <div className="text-sm text-zinc-500">{posts.length} posts</div>
            </div>
            <span className="text-2xl text-zinc-500">→</span>
          </Link>
        ))}
      </div>
    </motion.main>
  );
}

/* -- Archive Month Page --------------------------------------------- */
function ArchiveMonthPage({ posts }: { posts: Post[] }) {
  const [params] = useSearchParams();
  const month = params.get('month') || 'May';
  const year = params.get('year') || '2026';
  const label = `${month} ${year}`;

  return (
    <motion.main {...pageMotion} className="w-full px-[5%] py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-accent">Archive</p>
          <h1 className="mt-3 text-4xl text-white sm:text-5xl">{label}</h1>
        </div>
        <Link to="/archives" className="text-sm font-medium text-accent hover:opacity-80">All archives →</Link>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </motion.main>
  );
}

/* -- Admin Panel ---------------------------------------------------- */
function AdminPanel({
  posts,
  setPosts,
}: {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<PostDraft>(createDraft());
  const [successMsg, setSuccessMsg] = useState('');

  const ordered = [...posts].sort((a, b) => b.id - a.id);

  function resetDraft() {
    setDraft(createDraft());
    setEditingId(null);
  }

  function handleSubmit() {
    if (!draft.title.trim()) return;
    if (editingId) {
      setPosts(posts.map((p) => (p.id === editingId ? { ...p, ...draft, views: Number(draft.views) || 0, comments: Number(draft.comments) || 0 } : p)));
      setSuccessMsg('Post updated successfully!');
    } else {
      const newPost: Post = {
        id: Date.now(),
        title: draft.title,
        excerpt: draft.excerpt || draft.content.slice(0, 140),
        content: draft.content || draft.excerpt,
        image: draft.image || HERO_IMAGE,
        author: draft.author || 'Dylan',
        authorAvatar: draft.authorAvatar || DEFAULT_AVATAR,
        date: draft.date || 'Just now',
        views: Number(draft.views) || 0,
        comments: Number(draft.comments) || 0,
        category: draft.category,
      };
      setPosts([...posts, newPost]);
      setSuccessMsg('Post published successfully!');
    }
    resetDraft();
    setTimeout(() => setSuccessMsg(''), 3000);
  }

  function startEdit(post: Post) {
    setEditingId(post.id);
    setDraft(createDraft(post));
  }

  function removePost(id: number) {
    setPosts(posts.filter((p) => p.id !== id));
    if (editingId === id) resetDraft();
  }

  return (
    <motion.main {...pageMotion} className="w-full px-[5%] py-16">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-accent">Admin panel</p>
          <h1 className="mt-3 text-4xl text-white sm:text-5xl">Manage content</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">Edit posts, update metadata, and keep the library current.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-400">
          <div className="text-white">{posts.length} posts published</div>
        </div>
      </div>

      {successMsg && (
        <div className="mb-6 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-5 py-4 text-sm font-medium text-amber-400">
          {successMsg}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        {/* Editor */}
        <section className="admin-panel rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl text-white">{editingId ? 'Edit post' : 'Create post'}</h2>
              <p className="mt-1 text-sm text-zinc-500">Keep it simple and publish quickly.</p>
            </div>
            {editingId && (
              <button onClick={resetDraft} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10">
                Cancel
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-zinc-400">Title</label>
              <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Post title" className="w-full rounded-2xl border border-white/10 bg-black/50 px-5 py-3.5 text-white outline-none focus:border-amber-400" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-zinc-400">Excerpt</label>
              <textarea value={draft.excerpt} onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })} placeholder="Short summary" rows={3} className="w-full resize-none rounded-2xl border border-white/10 bg-black/50 px-5 py-3.5 text-white outline-none focus:border-amber-400" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-zinc-400">Content</label>
              <textarea value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} placeholder="Full article content" rows={7} className="w-full resize-y rounded-2xl border border-white/10 bg-black/50 px-5 py-3.5 text-white outline-none focus:border-amber-400" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-zinc-400">Image URL</label>
                <input value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/50 px-5 py-3.5 text-white outline-none focus:border-amber-400" />
              </div>
              <div>
                <label className="mb-2 block text-sm text-zinc-400">Category</label>
                <select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/50 px-5 py-3.5 text-white outline-none focus:border-amber-400">
                  {CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm text-zinc-400">Author</label>
                <input value={draft.author} onChange={(e) => setDraft({ ...draft, author: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/50 px-5 py-3.5 text-white outline-none focus:border-amber-400" />
              </div>
              <div>
                <label className="mb-2 block text-sm text-zinc-400">Date label</label>
                <input value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/50 px-5 py-3.5 text-white outline-none focus:border-amber-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block text-sm text-zinc-400">Views</label>
                  <input type="number" value={draft.views} onChange={(e) => setDraft({ ...draft, views: Number(e.target.value) })} className="w-full rounded-2xl border border-white/10 bg-black/50 px-5 py-3.5 text-white outline-none focus:border-amber-400" />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-zinc-400">Comments</label>
                  <input type="number" value={draft.comments} onChange={(e) => setDraft({ ...draft, comments: Number(e.target.value) })} className="w-full rounded-2xl border border-white/10 bg-black/50 px-5 py-3.5 text-white outline-none focus:border-amber-400" />
                </div>
              </div>
            </div>
            <button onClick={handleSubmit} className="w-full rounded-2xl bg-amber-400 px-5 py-3.5 font-medium text-black transition hover:bg-amber-300">
              {editingId ? 'Save changes' : 'Publish post'}
            </button>
          </div>
        </section>

        {/* Post list */}
        <section className="admin-panel rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <h2 className="mb-6 text-2xl text-white">Published posts</h2>
          <div className="space-y-4">
            {ordered.map((post) => (
              <motion.article
                key={post.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="flex gap-4 rounded-2xl border border-white/10 bg-black/50 p-4"
              >
                <img src={post.image} alt="" className="size-24 rounded-2xl object-cover shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-zinc-500">
                    <span>{post.date}</span>
                    <span className="h-1 w-1 rounded-full bg-zinc-700" />
                    <span>{post.views} views</span>
                  </div>
                  <h3 className="mt-2 line-clamp-2 text-lg text-white">{post.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-400">{post.excerpt}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                    <button onClick={() => startEdit(post)} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-medium text-white transition hover:bg-white/10">Edit</button>
                    <button onClick={() => removePost(post.id)} className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 font-medium text-red-300 transition hover:bg-red-500/15">Delete</button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      </div>
    </motion.main>
  );
}

/* -- Footer --------------------------------------------------------- */
function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 mt-32">
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/backgrounds/hero/nebula.webp')", opacity: 0.05 }} />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/backgrounds/overlays/vignette.webp')", backgroundSize: '100% 100%', opacity: 0.4, mixBlendMode: 'multiply' }} />
      </div>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-wrap items-center justify-between gap-10">
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center">
                <img src={cryptodylLogoImage} alt="" className="h-5 w-5" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-white">CryptoDyl</span>
            </Link>
            <p className="max-w-xs text-sm text-zinc-500 leading-relaxed">
              Research-driven crypto intelligence and passive income systems curated with brutal clarity.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-x-12 gap-y-6 text-sm font-medium">
            <div className="flex flex-col gap-3">
              <span className="text-zinc-400 uppercase tracking-widest text-[10px]">Explore</span>
              <Link to="/" className="text-zinc-500 hover:text-white transition">Home</Link>
              <Link to="/posts" className="text-zinc-500 hover:text-white transition">Library</Link>
              <Link to="/popular" className="text-zinc-500 hover:text-white transition">Popular</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-zinc-400 uppercase tracking-widest text-[10px]">Topics</span>
              <Link to="/categories" className="text-zinc-500 hover:text-white transition">Categories</Link>
              <Link to="/archives" className="text-zinc-500 hover:text-white transition">Archives</Link>
              <Link to="/admin" className="text-zinc-500 hover:text-white transition">Admin Panel</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-zinc-400 uppercase tracking-widest text-[10px]">Account</span>
              <Link to="/login" className="text-zinc-500 hover:text-white transition">Login</Link>
              <Link to="/register" className="text-zinc-500 hover:text-white transition">Join Now</Link>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-8 sm:flex-row">
          <div className="text-xs text-zinc-600">
            © {new Date().getFullYear()} CryptoDyl · A premium Web3 publication
          </div>
          <div className="flex gap-5 text-zinc-500">
            <a href="#" className="hover:text-white transition">𝕏</a>
            <a href="#" className="hover:text-white transition">✈</a>
            <a href="#" className="hover:text-white transition">▶</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* -- Atmosphere (Cinematic) ------------------------------------------- */
function Atmosphere() {
  return (
    <>
      {/* Global cinematic background stack */}
      <div className="site-bg">
        <div className="site-bg__layer" style={{ backgroundImage: "url('/backgrounds/hero/nebula.webp')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.12 }} />
        <div className="site-bg__layer" style={{ backgroundImage: "url('/backgrounds/textures/grid.webp')", backgroundRepeat: 'repeat', opacity: 0.06 }} />
        <div className="site-bg__layer" style={{ backgroundImage: "url('/backgrounds/textures/noise.webp')", backgroundRepeat: 'repeat', opacity: 0.02, mixBlendMode: 'soft-light' }} />
        <div className="site-bg__layer" style={{ backgroundImage: "url('/backgrounds/overlays/vignette.webp')", backgroundSize: '100% 100%', opacity: 0.35, mixBlendMode: 'multiply' }} />
      </div>
      <div className="atmos">
        <div className="atmos__orb atmos__orb--primary" />
        <div className="atmos__orb atmos__orb--secondary" />
        <div className="atmos__orb" style={{ width: '400px', height: '400px', background: 'radial-gradient(circle, var(--accent), transparent 70%)', top: '40%', right: '10%', opacity: 0.10, animation: 'drift1 35s infinite' }} />
        <div className="atmos__orb" style={{ width: '600px', height: '600px', background: 'radial-gradient(circle, var(--brand-violet), transparent 70%)', top: '80%', left: '-10%', opacity: 0.12, animation: 'drift2 40s infinite' }} />
        <div className="atmos__streak" style={{ left: '15%', animationDelay: '0s' }} />
        <div className="atmos__streak" style={{ left: '45%', animationDelay: '-4s' }} />
        <div className="atmos__streak" style={{ left: '75%', animationDelay: '-8s' }} />
      </div>
    </>
  );
}

/* -- Scroll Progress ------------------------------------------------- */
function ScrollProgress() {
  const [w, setW] = useState(0);
  useEffect(() => {
    function on() {
      const h = document.documentElement;
      const p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
      setW(Math.min(1, Math.max(0, p)));
    }
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return <div className="scroll-progress" style={{ transform: `scaleX(${w})` }} />;
}

/* -- Cursor Halo (kept) --------------------------------------------- */
function CursorHalo() {
  useEffect(() => {
    const el = document.createElement('div');
    el.className = 'cursor-halo';
    document.body.appendChild(el);
    let raf = 0; let x = 0; let y = 0; let tx = 0; let ty = 0;
    const move = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; };
    const tick = () => {
      x += (tx - x) * 0.18; y += (ty - y) * 0.18;
      el.style.transform = `translate(${x - 14}px, ${y - 14}px)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove', move);
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf); el.remove(); };
  }, []);
  return null;
}

/* -- Brand Ticker --------------------------------------------------- */
function BrandTicker() {
  const items = [
    { k: 'BTC', v: '$112,480', c: '+2.4%' },
    { k: 'ETH', v: '$4,128', c: '+1.8%' },
    { k: 'BNB', v: '$612', c: '+0.9%' },
    { k: 'SOL', v: '$248', c: '+3.6%' },
    { k: 'XRP', v: '$2.84', c: '+1.1%' },
    { k: 'DOGE', v: '$0.42', c: '+5.2%' },
  ];
  return (
    <div className="ticker mt-[5.5rem]">
      <div className="ticker__track">
        {[...items, ...items, ...items].map((i, idx) => (
          <span key={idx} className="ticker__item">
            {i.k} <b>{i.v}</b> <span className="text-accent">{i.c}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* -- App ------------------------------------------------------------ */
export default function App() {
  const [posts, setPosts] = useState<Post[]>(() => readPosts());
  const [isAdmin, setIsAdmin] = useState<boolean>(() => readAdmin());
  const [loggedUser, setLoggedUser] = useState<string | null>(() => readLoggedInUser());
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(POST_STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  function handleLogin(username: string) {
    setIsAdmin(true);
    setLoggedUser(username);
    localStorage.setItem(ADMIN_STORAGE_KEY, 'true');
    localStorage.setItem(LOGGED_IN_USER_KEY, username);
  }

  function handleLogout() {
    setIsAdmin(false);
    setLoggedUser(null);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    localStorage.removeItem(LOGGED_IN_USER_KEY);
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-[#0a0e1a] text-white">
        <Atmosphere />
        <ScrollProgress />
        <CursorHalo />
        <Navbar
          isAdmin={isAdmin}
          loggedUser={loggedUser}
          onLogout={handleLogout}
          onSearchOpen={() => setSearchOpen(true)}
        />
        <BrandTicker />
        <Routes>
          <Route path="/" element={<Home posts={posts} />} />
          <Route path="/posts" element={<PostsPage posts={posts} />} />
          <Route path="/posts/:id" element={<PostDetail posts={posts} />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/profile/:name" element={<ProfilePage posts={posts} users={readUsers()} />} />
          <Route path="/popular" element={<PopularPage posts={posts} />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/category/:slug" element={<CategoryPostsPage posts={posts} />} />
          <Route path="/archives" element={<ArchivesPage posts={posts} />} />
          <Route path="/archive" element={<ArchiveMonthPage posts={posts} />} />
          <Route
            path="/admin"
            element={
              isAdmin ? (
                <AdminPanel posts={posts} setPosts={setPosts} />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
        <SearchModal
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          posts={posts}
        />
      </div>
    </Router>
  );
}
