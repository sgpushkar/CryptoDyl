import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Bell,
  BookOpen,
  Boxes,
  ChevronDown,
  FileText,
  Globe,
  Layers3,
  LayoutDashboard,
  LogOut,
  Monitor,
  Settings,
  ShieldCheck,
  Users2,
} from "lucide-react";
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
} from "react-router-dom";
import {
  categoryCasinosImage,
  categoryEventsImage,
  categoryPassiveIncomeImage,
  cryptodylLogoImage,
} from "@/lib/assets";

/* ------------------------------------------------------------------ */
/* Types */
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
  email: string;
  password: string;
  isAdmin: boolean;
  avatar: string;
  bio: string;
  joined: string;
}

/* ------------------------------------------------------------------ */
/* Constants */
/* ------------------------------------------------------------------ */
const POST_STORAGE_KEY = "cryptodyl_posts";
const ADMIN_STORAGE_KEY = "cryptodyl_admin";
const USERS_STORAGE_KEY = "cryptodyl_users";
const LOGGED_IN_USER_KEY = "cryptodyl_logged_in_user";
const DEFAULT_AVATAR = "https://cryptodyl.com/images/1775422489.png";

const CATEGORIES = [
  {
    slug: "casinos",
    name: "Casinos",
    image: categoryCasinosImage,
    description: "Best crypto casino reviews, bonuses, and betting guides.",
  },
  {
    slug: "events",
    name: "Events",
    image: categoryEventsImage,
    description: "Crypto events, giveaways, and community celebrations.",
  },
  {
    slug: "passive-crypto-earning",
    name: "Passive Crypto Earning",
    image: categoryPassiveIncomeImage,
    description: "Guides to earning passive income with crypto platforms.",
  },
];

const initialPosts: Post[] = [
  {
    id: 1,
    title:
      "Thunderpick Casino Review 2025 – Best Crypto Casino Bonus Up to $2000",
    excerpt:
      "Discover Thunderpick, one of the best crypto casinos in 2025. Claim a 100% bonus up to $2000 with fast payouts.",
    content: `The crypto casino space is more competitive than ever in 2025, but one platform is dominating the scene right now: Thunderpick.

From massive casino bonuses and esports betting to lightning-fast crypto payouts, Thunderpick has quickly become one of the most talked-about crypto gambling platforms online.

## Claim a 100% Bonus Up to $2000

Right now, new Thunderpick users can unlock a 100% Welcome Bonus Up To $2000. That means your deposit instantly gets doubled.

Bonus Examples:
- Deposit $100 → Get $200 to play with
- Deposit $500 → Get $1000
- Deposit $2000 → Start with $4000

## Why Thunderpick Is Blowing Up

Thunderpick isn't just another gambling website. It combines crypto casinos, sports betting, esports betting, and VIP rewards into one complete platform.

Features Players Love:
- Huge casino game selection
- Sports betting with competitive odds
- Massive esports betting markets
- Daily competitions and leaderboard rewards
- Regular giveaways and promotions
- Fast crypto deposits and withdrawals
- VIP rank system with extra rewards
- VPN friendly access
- Provably fair gaming system

The platform is designed for crypto users who want speed, privacy, rewards, and nonstop action.

## Supported Cryptocurrencies

Thunderpick supports many of the most popular cryptocurrencies including: BTC, ETH, BNB, USDT, XRP, DOGE, LTC, BCH, TRX.

## Final Verdict

If you're searching for the best crypto casino in 2025, Thunderpick is absolutely worth checking out. The current 100% bonus up to $2000 gives new users a huge advantage.`,
    image: "https://cryptodyl.com/uploads/1778517620.jpg",
    author: "Dylan",
    authorAvatar: DEFAULT_AVATAR,
    date: "2 days ago",
    views: 76,
    comments: 2,
    category: "casinos",
  },
  {
    id: 2,
    title: "CryptoDyl Is Back — Celebrate With a 2x $2.5 BNB Giveaway!",
    excerpt:
      "CryptoDyl is officially back after a short break. Celebrate with a 2x $2.5 BNB giveaway event.",
    content:
      "We are thrilled to announce CryptoDyl's return. To celebrate, we are running a giveaway where 2 lucky winners will each receive $2.5 worth of BNB. Stay tuned for more crypto content and passive income guides.",
    image: "https://cryptodyl.com/uploads/1778179992.jpg",
    author: "Dylan",
    authorAvatar: DEFAULT_AVATAR,
    date: "5 days ago",
    views: 32,
    comments: 0,
    category: "events",
  },
  {
    id: 3,
    title:
      "The Ultimate Grass.io Passive Income Guide (2026) – Earn Crypto by Sharing Bandwidth",
    excerpt:
      "Learn how to earn passive income with Grass.io crypto in 2026. Complete beginner guide to maximizing earnings.",
    content:
      "Grass.io is one of the leading platforms for earning passive crypto income by sharing unused internet bandwidth. In this 2026 guide, learn step-by-step setup, optimal node configuration, security tips, and how to withdraw your earnings efficiently. Start earning today with minimal effort.",
    image: "https://cryptodyl.com/uploads/1775555063.png",
    author: "Dylan",
    authorAvatar: DEFAULT_AVATAR,
    date: "1 month ago",
    views: 118,
    comments: 2,
    category: "passive-crypto-earning",
  },
  {
    id: 4,
    title:
      "Ultimate Guide to Honeygain: How to Start Earning Passive Income (2026)",
    excerpt:
      "Start earning passive income with Honeygain. Learn how it works, maximize earnings, and get the best tips.",
    content:
      "Honeygain allows you to monetize your internet connection by sharing bandwidth with businesses. This comprehensive 2026 guide covers installation on all devices, referral strategies, payout methods, and how to earn up to $50 monthly passively. Perfect for beginners looking to generate crypto income.",
    image: "https://cryptodyl.com/uploads/1775426310.png",
    author: "Dylan",
    authorAvatar: DEFAULT_AVATAR,
    date: "1 month ago",
    views: 184,
    comments: 3,
    category: "passive-crypto-earning",
  },
];

const initialUsers: User[] = [
  {
    username: "Dylan",
    displayName: "Dylan",
    email: "dylan@cryptodyl.com",
    password: "admin",
    isAdmin: true,
    avatar: DEFAULT_AVATAR,
    bio: "Crypto enthusiast, passive income explorer, and content creator sharing the best crypto guides since 2024.",
    joined: "January 2024",
  },
];

/* ------------------------------------------------------------------ */
/* Helpers */
/* ------------------------------------------------------------------ */
function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
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
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ADMIN_STORAGE_KEY) === "true";
}

function readLoggedInUser(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(LOGGED_IN_USER_KEY);
}

/* ------------------------------------------------------------------ */
/* Motion presets */
/* ------------------------------------------------------------------ */
const pageMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 12 },
};

/* ------------------------------------------------------------------ */
/* Components */
/* ------------------------------------------------------------------ */

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
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
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={`site-navbar ${scrolled ? "nav-scrolled" : ""}`}
    >
      <div className="site-navbar__inner">
        <Link to="/" className="brand">
          <div className="brand__mark">
            <img
              src={cryptodylLogoImage}
              alt="CryptoDyl"
              className="h-7 w-7 object-contain"
            />
          </div>
          <span className="brand__text">CryptoDyl</span>
        </Link>

        <nav className="nav-desktop">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/posts">Guides</NavLink>
          <NavLink to="/popular">Trending</NavLink>
          <NavLink to="/categories">Categories</NavLink>
          <NavLink to="/archives">Archives</NavLink>
        </nav>

        <div className="nav-actions">
          <button
            onClick={onSearchOpen}
            className="search-btn"
            aria-label="Search"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20L17 17" />
            </svg>
          </button>

          {isAdmin && (
            <Link to="/admin" className="nav-admin-link">
              Admin
            </Link>
          )}

          {loggedUser ? (
            <div className="nav-user-actions">
              <Link to={`/profile/${loggedUser}`} className="nav-user">
                {loggedUser}
              </Link>
              <button onClick={onLogout} className="login-btn">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-btn">
              Login
            </Link>
          )}

          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="mobile-menu-btn"
            aria-label="Toggle menu"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {mobileOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="nav-mobile"
          >
            <div className="nav-mobile__inner">
              <MobileNavLink to="/" onClick={() => setMobileOpen(false)}>
                Home
              </MobileNavLink>
              <MobileNavLink to="/posts" onClick={() => setMobileOpen(false)}>
                Guides
              </MobileNavLink>
              <MobileNavLink to="/popular" onClick={() => setMobileOpen(false)}>
                Trending
              </MobileNavLink>
              <MobileNavLink
                to="/categories"
                onClick={() => setMobileOpen(false)}
              >
                Categories
              </MobileNavLink>
              <MobileNavLink
                to="/archives"
                onClick={() => setMobileOpen(false)}
              >
                Archives
              </MobileNavLink>
              <button
                onClick={() => {
                  onSearchOpen();
                  setMobileOpen(false);
                }}
                className="nav-mobile__button"
              >
                Search
              </button>
              {loggedUser && (
                <MobileNavLink
                  to={`/profile/${loggedUser}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {loggedUser}
                </MobileNavLink>
              )}
              {isAdmin && (
                <MobileNavLink to="/admin" onClick={() => setMobileOpen(false)}>
                  Admin Panel
                </MobileNavLink>
              )}
              {loggedUser ? (
                <button
                  onClick={() => {
                    onLogout();
                    setMobileOpen(false);
                  }}
                  className="nav-mobile__login"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="nav-mobile__login"
                >
                  Login
                </Link>
              )}
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
    <Link to={to} className={`nav-link ${active ? "is-active" : ""}`}>
      {children}
    </Link>
  );
}

function MobileNavLink({
  to,
  children,
  onClick,
}: {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const { pathname } = useLocation();
  const active = pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`mobile-nav-link ${active ? "is-active" : ""}`}
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
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const results = q.trim()
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q.toLowerCase()) ||
          p.excerpt.toLowerCase().includes(q.toLowerCase()),
      )
    : [];

  function handleSelect(id: number) {
    setQ("");
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
          className="search-modal"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, y: -8 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: -8 }}
            className="search-modal__panel"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              autoFocus
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search guides..."
              className="search-modal__input"
            />
            <div className="search-modal__results">
              {results.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelect(p.id)}
                  className="search-result"
                >
                  <div className="search-result__title">{p.title}</div>
                  <div className="search-result__meta">
                    {p.date} · {p.views} views
                  </div>
                </button>
              ))}
              {q.trim() && results.length === 0 && (
                <p className="py-6 text-center text-sm text-zinc-500">
                  No results found.
                </p>
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
  variant = "default",
}: {
  post: Post;
  variant?: "default" | "featured" | "compact";
}) {
  const compact = variant === "compact";

  const categoryLabel =
    post.category === "passive-crypto-earning"
      ? "Passive Earning"
      : post.category.charAt(0).toUpperCase() + post.category.slice(1);

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
      className="h-full"
    >
      <Link
        to={`/posts/${post.id}`}
        className={`post-card ${compact ? "compact" : ""}`}
      >
        <div className="post-card__media">
          <img src={post.image} alt={post.title} />
          <span className="post-card__badge">{categoryLabel}</span>
        </div>

        <div className="post-card__content">
          <h3 className="post-card__title">{post.title}</h3>
          <p className="post-card__excerpt">{post.excerpt}</p>

          <div className="post-card__meta">
            <div className="post-card__author">
              <img
                src={post.authorAvatar}
                alt={post.author}
                className="post-card__avatar"
              />
              <span>{post.author}</span>
            </div>
            <span>{post.date}</span>
            <span>{post.views}K views</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

/* -- Hero Section --------------------------------------------------- */
function HeroSection() {
  return (
    <section className="hero">
      <div className="hero__grid">
        <div className="hero__left">
          <div className="hero__eyebrow">Research · Insights · Alpha</div>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="hero__title"
          >
            Decode
            <br />
            the next <span>wave</span>
            <br />
            of <em>crypto alpha.</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="hero__desc"
          >
            Research-driven crypto intelligence, passive income systems, casino
            ecosystems, and Web3 strategies curated with brutal clarity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="hero__actions"
          >
            <Link to="/posts" className="btn-primary">
              Explore Guides <span>→</span>
            </Link>
            <Link to="/popular" className="btn-secondary">
              Trending Now
            </Link>
          </motion.div>

          <div className="hero__stats">
            <div className="hero-stat">
              <strong>120+</strong>
              <span>Guides</span>
            </div>
            <div className="hero-stat">
              <strong>42K+</strong>
              <span>Monthly readers</span>
            </div>
            <div className="hero-stat">
              <strong>2026</strong>
              <span>Crypto insights</span>
            </div>
          </div>
        </div>

        <div className="hero__right">
          <div className="market-card market-card--large">
            <div className="market-card__label">Bitcoin</div>
            <div className="market-card__value">$112,480</div>
            <div className="market-card__change">
              +12.45% <span>(24H)</span>
            </div>
            <div className="market-card__chart green" />
          </div>

          <div className="hero__mini-grid">
            <div className="market-card">
              <div className="market-card__label">Ethereum</div>
              <div className="market-card__value small">$4,128</div>
              <div className="market-card__change">
                +1.85% <span>(24H)</span>
              </div>
              <div className="market-card__chart purple" />
            </div>

            <div className="market-card">
              <div className="market-card__label">Solana</div>
              <div className="market-card__value small">$248</div>
              <div className="market-card__change">
                +1.65% <span>(24H)</span>
              </div>
              <div className="market-card__chart teal" />
            </div>
          </div>

          <div className="narrative-card">
            <div className="narrative-card__text">
              <div className="narrative-card__label">Trending Narrative</div>
              <h3>AI x DeFi</h3>
              <p>
                AI agents, decentralized finance and the next trillion-dollar
                shift.
              </p>
              <div className="narrative-tags">
                <span>AI</span>
                <span>DEFI</span>
                <span>AUTONOMY</span>
                <span>TRADING</span>
                <span>YIELD</span>
              </div>
            </div>
            <div className="narrative-card__radar" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* -- Home Page ------------------------------------------------------ */
function Home({ posts }: { posts: Post[] }) {
  return (
    <motion.main {...pageMotion} transition={{ duration: 0.35 }}>
      <HeroSection />

      <section className="content-section">
        <div className="section-head">
          <div>
            <p className="section-eyebrow">⚡ Latest guides & reviews</p>
          </div>
          <Link to="/posts" className="section-link">
            View all guides →
          </Link>
        </div>

        <div className="post-grid">
          {posts.slice(0, 3).map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
            >
              <PostCard post={p} />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="content-section">
        <div className="section-head">
          <div>
            <p className="section-eyebrow">⚡ Explore categories</p>
          </div>
          <Link to="/categories" className="section-link">
            Browse all categories →
          </Link>
        </div>

        <div className="categories-grid">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
            >
              <Link to={`/category/${cat.slug}`} className="category-card">
                <img src={cat.image} alt={cat.name} />
                <div className="category-card__overlay" />
                <div className="category-card__icon">
                  {cat.slug === "casinos"
                    ? "⬢"
                    : cat.slug === "events"
                      ? "✦"
                      : "$"}
                </div>
                <div className="category-card__content">
                  <h3>{cat.name}</h3>
                  <p>{cat.description}</p>
                  <span>Explore →</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="content-section pt-0">
        <div className="subscribe-banner">
          <div className="subscribe-banner__left">
            <div className="subscribe-banner__icon">✉</div>
            <div>
              <h3>Stay ahead of the next wave.</h3>
              <p>Join 42K+ readers.</p>
            </div>
          </div>
          <div className="subscribe-banner__right">
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
        </div>
      </section>
    </motion.main>
  );
}

/* -- Posts Page ----------------------------------------------------- */
function PostsPage({ posts }: { posts: Post[] }) {
  const [search, setSearch] = useState("");

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
    <motion.main {...pageMotion} className="page-shell">
      <div className="page-head">
        <div>
          <p className="section-eyebrow">Library</p>
          <h1 className="page-title">Browse the full library</h1>
          <p className="page-subtitle">{posts.length} guides published</p>
        </div>
        <div className="page-search">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts..."
          />
        </div>
      </div>

      <div className="post-grid post-grid--all">
        {filtered.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">No posts match your search.</div>
      )}
    </motion.main>
  );
}

/* -- Post Detail ---------------------------------------------------- */
function PostDetail({ posts }: { posts: Post[] }) {
  const { id } = useParams();
  const post = posts.find((p) => p.id === Number(id));

  if (!post) return <Navigate to="/posts" replace />;

  const contentParagraphs = post.content.split("\n\n").filter(Boolean);

  return (
    <motion.main {...pageMotion} className="article-shell">
      <article className="article-card">
        <img src={post.image} alt={post.title} className="article-cover" />

        <div className="article-meta">
          <Link to={`/profile/${post.author}`} className="article-author">
            <img src={post.authorAvatar} alt={post.author} />
            <span>{post.author}</span>
          </Link>
          <span>•</span>
          <span>{post.date}</span>
          <span>•</span>
          <span>{post.views} views</span>
          <span>•</span>
          <span>{post.comments} comments</span>
        </div>

        <h1 className="article-title">{post.title}</h1>

        <div className="article-body">
          {contentParagraphs.map((para, i) => {
            if (para.startsWith("## ")) {
              return (
                <h2 key={i} className="article-h2">
                  {para.replace("## ", "")}
                </h2>
              );
            }

            if (para.startsWith("- ")) {
              return (
                <ul key={i} className="article-list">
                  {para.split("\n").map((line, j) => (
                    <li key={j}>{line.replace(/^- /, "")}</li>
                  ))}
                </ul>
              );
            }

            return <p key={i}>{para}</p>;
          })}
        </div>

        <div className="article-actions">
          <Link to="/posts" className="btn-secondary">
            ← Back to all posts
          </Link>
          <Link to={`/profile/${post.author}`} className="btn-secondary">
            More from {post.author}
          </Link>
        </div>
      </article>
    </motion.main>
  );
}

/* -- Login Page ------------------------------------------------------ */
function LoginPage({ onLogin }: { onLogin: (username: string) => void }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const users = readUsers();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedUsername = username.trim();
    const user = users.find(
      (entry) =>
        entry.username.toLowerCase() === trimmedUsername.toLowerCase() ||
        entry.email.toLowerCase() === trimmedUsername.toLowerCase(),
    );

    if (user && user.password === password) {
      onLogin(user.username);
      navigate("/");
      return;
    }
    setError(
      "Invalid credentials. Use a registered username/email and matching password.",
    );
  }

  return (
      <motion.main {...pageMotion} className="auth-shell">
        <div className="auth-card">
          <div className="section-eyebrow">CryptoDyl</div>
          <h2 className="auth-title">Welcome back.</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <div>
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="auth-submit">
              Sign in
            </button>

            <div className="auth-actions-row">
              <Link to="/register" className="auth-secondary-link">
                Create account
              </Link>
              <p className="auth-note">Use your registered username or email</p>
            </div>
          </form>
        </div>
      </motion.main>
    );
  }

/* -- Register Page --------------------------------------------------- */
function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const displayName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!displayName || !trimmedEmail || trimmedPassword.length < 6) {
      setError("Fill out all fields and use a password with at least 6 characters.");
      return;
    }

    const users = readUsers();
    const conflict = users.some(
      (user: User) =>
        user.username.toLowerCase() === displayName.toLowerCase() ||
        user.email.toLowerCase() === trimmedEmail,
    );

    if (conflict) {
      setError("That username or email is already registered.");
      return;
    }

    const newUser: User = {
      username: displayName,
      displayName,
      email: trimmedEmail,
      password: trimmedPassword,
      isAdmin: false,
      avatar: DEFAULT_AVATAR,
      bio: "New CryptoDyl member.",
      joined: new Date().toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      }),
    };

    localStorage.setItem(
      USERS_STORAGE_KEY,
      JSON.stringify([...users, newUser]),
    );
    setError("");
    setDone(true);
  }

  return (
    <motion.main {...pageMotion} className="auth-shell">
      <div className="auth-card">
        {done ? (
          <div className="text-center py-8">
            <div className="mb-5 text-5xl text-lime-400">✓</div>
            <h2 className="auth-title">Account created</h2>
            <p className="page-subtitle mt-3">
              You can now log in with your credentials.
            </p>
            <Link to="/login" className="auth-submit inline-flex mt-6">
              Sign in
            </Link>
          </div>
        ) : (
          <>
            <div className="section-eyebrow">Join CryptoDyl</div>
            <h2 className="auth-title">Create your account</h2>
            <p className="page-subtitle mt-3">
              Sign up to comment, follow authors, and publish guides.
            </p>

              <form onSubmit={handleSubmit} className="auth-form">
              <div>
                <label>Display name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                />
              </div>
                <button type="submit" className="auth-submit">
                  Create account
                </button>
                {error && <p className="auth-error">{error}</p>}
              </form>
            </>
          )}
      </div>
    </motion.main>
  );
}

/* -- Forgot Password Page ------------------------------------------- */
function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <motion.main {...pageMotion} className="auth-shell">
      <div className="auth-card">
        {sent ? (
          <div className="text-center py-8">
            <h2 className="auth-title">Check your email</h2>
            <p className="page-subtitle mt-3">
              We sent a reset link to{" "}
              <strong className="text-white">{email}</strong>
            </p>
            <Link to="/login" className="auth-submit inline-flex mt-6">
              Back to login
            </Link>
          </div>
        ) : (
          <>
            <div className="section-eyebrow">Reset</div>
            <h2 className="auth-title">Recover access</h2>
            <p className="page-subtitle mt-3">
              Enter your email and we'll send you a recovery link.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) setSent(true);
              }}
              className="auth-form"
            >
              <div>
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <button type="submit" className="auth-submit">
                Send reset link
              </button>
            </form>
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
    <motion.main {...pageMotion} className="page-shell">
      <div className="profile-head">
        <img
          src={user.avatar}
          alt={user.displayName}
          className="profile-avatar"
        />
        <div>
          <h1 className="page-title">{user.displayName}</h1>
          <p className="page-subtitle mt-3 max-w-2xl">{user.bio}</p>
          <div className="profile-meta">
            <span>Joined {user.joined}</span>
            <span>•</span>
            <span>{userPosts.length} posts published</span>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="section-title">Posts by {user.displayName}</h2>
        <div className="post-grid post-grid--all mt-6">
          {userPosts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
        {userPosts.length === 0 && (
          <p className="empty-state">No posts published yet.</p>
        )}
      </div>
    </motion.main>
  );
}

/* -- Popular Page --------------------------------------------------- */
function PopularPage({ posts }: { posts: Post[] }) {
  const sorted = [...posts].sort((a, b) => b.views - a.views);

  return (
    <motion.main {...pageMotion} className="page-shell">
      <p className="section-eyebrow">Popular</p>
      <h1 className="page-title">Most read guides</h1>
      <p className="page-subtitle">Sorted by highest view count.</p>

      <div className="post-grid post-grid--all mt-10">
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
    <motion.main {...pageMotion} className="page-shell">
      <p className="section-eyebrow">Browse</p>
      <h1 className="page-title">Categories</h1>
      <p className="page-subtitle">Explore guides by topic.</p>

      <div className="categories-grid mt-10">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            to={`/category/${cat.slug}`}
            className="category-card"
          >
            <img src={cat.image} alt={cat.name} />
            <div className="category-card__overlay" />
            <div className="category-card__icon">
              {cat.slug === "casinos" ? "⬢" : cat.slug === "events" ? "✦" : "$"}
            </div>
            <div className="category-card__content">
              <h3>{cat.name}</h3>
              <p>{cat.description}</p>
              <span>Explore →</span>
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
    <motion.main {...pageMotion} className="page-shell">
      <div className="page-head">
        <div>
          <p className="section-eyebrow">{cat.name}</p>
          <h1 className="page-title">{cat.name}</h1>
          <p className="page-subtitle">{cat.description}</p>
        </div>
        <Link to="/categories" className="section-link">
          All categories →
        </Link>
      </div>

      <div className="post-grid post-grid--all">
        {filtered.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">No posts in this category yet.</div>
      )}
    </motion.main>
  );
}

/* -- Archives Page -------------------------------------------------- */
function ArchivesPage({ posts }: { posts: Post[] }) {
  const months = [
    { label: "May 2026", year: 2026, month: "May" },
    { label: "April 2026", year: 2026, month: "April" },
    { label: "March 2026", year: 2026, month: "March" },
  ];

  return (
    <motion.main {...pageMotion} className="page-shell">
      <p className="section-eyebrow">Archive</p>
      <h1 className="page-title">Archives</h1>
      <p className="page-subtitle">Browse posts by month.</p>

      <div className="archive-grid">
        {months.map((m) => (
          <Link
            key={m.label}
            to={`/archive?month=${m.month}&year=${m.year}`}
            className="archive-card"
          >
            <div>
              <div className="archive-card__label">{m.label}</div>
              <div className="archive-card__sub">{posts.length} posts</div>
            </div>
            <span>→</span>
          </Link>
        ))}
      </div>
    </motion.main>
  );
}

/* -- Archive Month Page --------------------------------------------- */
function ArchiveMonthPage({ posts }: { posts: Post[] }) {
  const [params] = useSearchParams();
  const month = params.get("month") || "May";
  const year = params.get("year") || "2026";
  const label = `${month} ${year}`;

  return (
    <motion.main {...pageMotion} className="page-shell">
      <div className="page-head">
        <div>
          <p className="section-eyebrow">Archive</p>
          <h1 className="page-title">{label}</h1>
        </div>
        <Link to="/archives" className="section-link">
          All archives →
        </Link>
      </div>

      <div className="post-grid post-grid--all">
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
  users,
  setUsers,
  currentUserEmail,
  onLogout,
  onIdentityChanged,
}: {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  currentUserEmail: string | null;
  onLogout: () => void;
  onIdentityChanged: (nextUsername: string, nextEmail: string) => void;
}) {
  const navigate = useNavigate();
  const currentUser =
    users.find((user) => user.email === currentUserEmail) ?? users[0];
  const [activeSection, setActiveSection] = useState<
    "dashboard" | "posts" | "pages" | "categories" | "settings" | "profile" | "users"
  >("dashboard");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [notice, setNotice] = useState("");
  const [draft, setDraft] = useState({
    title: "",
    excerpt: "",
    content: "",
    image: "",
    author: currentUser?.displayName ?? "Dylan",
    authorAvatar: currentUser?.avatar ?? cryptodylLogoImage,
    date: "Just now",
    views: 0,
    comments: 0,
    category: "casinos",
  });
  const [credentialDraft, setCredentialDraft] = useState({
    username: "",
    email: "",
    password: "",
  });

  const totalPosts = posts.length;
  const unpublishedPosts = posts.filter((post) => !post.content.trim()).length;
  const totalUsers = users.length;
  const adminUsers = users.filter((user) => user.isAdmin).length;
  const latestPost = [...posts].sort((a, b) => b.id - a.id)[0];
  const orderedPosts = [...posts].sort((a, b) => b.id - a.id);

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", section: "dashboard" as const },
    { icon: FileText, label: "Posts", section: "posts" as const },
    { icon: BookOpen, label: "Pages", section: "pages" as const },
    { icon: Boxes, label: "Categories", section: "categories" as const },
    { icon: Settings, label: "Settings", section: "settings" as const },
    { icon: ShieldCheck, label: "Admin Profile", section: "profile" as const },
    { icon: Users2, label: "Users", section: "users" as const },
  ] as const;

  const cards = [
    { title: "Total Posts", value: totalPosts, label: "Posts", icon: FileText },
    {
      title: "Unpublished Posts",
      value: unpublishedPosts,
      label: "Unpublished Posts",
      icon: FileText,
    },
    { title: "Total Users", value: totalUsers, label: "Users", icon: Users2 },
  ];

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2200);
  }

  function resetDraft() {
    setEditingId(null);
    setDraft({
      title: "",
      excerpt: "",
      content: "",
      image: "",
      author: currentUser?.displayName ?? "Dylan",
      authorAvatar: currentUser?.avatar ?? cryptodylLogoImage,
      date: "Just now",
      views: 0,
      comments: 0,
      category: "casinos",
    });
  }

  useEffect(() => {
    if (!currentUser) return;
    setCredentialDraft({
      username: currentUser.username,
      email: currentUser.email,
      password: currentUser.password,
    });
  }, [currentUser?.email, currentUser?.password, currentUser?.username]);

  function handleSidebarAction(section: (typeof sidebarItems)[number]["section"]) {
    setActiveSection(section);
    if (section === "dashboard") flash("Dashboard loaded.");
  }

  function startEdit(post: Post) {
    setEditingId(post.id);
    setActiveSection("posts");
    setDraft({
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
    });
  }

  function savePost() {
    if (!draft.title.trim()) {
      flash("Title is required.");
      return;
    }

    if (editingId) {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === editingId
            ? {
                ...post,
                title: draft.title,
                excerpt: draft.excerpt || draft.content.slice(0, 140),
                content: draft.content || draft.excerpt,
                image: draft.image || post.image,
                author: draft.author,
                authorAvatar: draft.authorAvatar,
                date: draft.date,
                views: Number(draft.views) || 0,
                comments: Number(draft.comments) || 0,
                category: draft.category,
              }
            : post,
        ),
      );
      flash("Post updated successfully.");
    } else {
      setPosts((prev) => [
        {
          id: Date.now(),
          title: draft.title,
          excerpt: draft.excerpt || draft.content.slice(0, 140),
          content: draft.content || draft.excerpt,
          image: draft.image || cryptodylLogoImage,
          author: draft.author || currentUser?.displayName || "Dylan",
          authorAvatar: draft.authorAvatar || currentUser?.avatar || cryptodylLogoImage,
          date: draft.date || "Just now",
          views: Number(draft.views) || 0,
          comments: Number(draft.comments) || 0,
          category: draft.category,
        },
        ...prev,
      ]);
      flash("Post published successfully.");
    }

    resetDraft();
  }

  function deletePost(id: number) {
    setPosts((prev) => prev.filter((post) => post.id !== id));
    if (editingId === id) resetDraft();
    flash("Post deleted.");
  }

  function toggleAdmin(email: string) {
    if (email === currentUserEmail) {
      flash("You cannot remove your own admin access.");
      return;
    }
    setUsers((prev) =>
      prev.map((user) =>
        user.email === email ? { ...user, isAdmin: !user.isAdmin } : user,
      ),
    );
    flash("User permissions updated.");
  }

  function removeUser(email: string) {
    if (email === currentUserEmail) {
      flash("You cannot remove the account you are currently using.");
      return;
    }

    const target = users.find((user) => user.email === email);
    if (target?.isAdmin && users.filter((user) => user.isAdmin).length <= 1) {
      flash("Keep at least one admin account.");
      return;
    }

    setUsers((prev) => prev.filter((user) => user.email !== email));
    flash("User removed.");
  }

  function updateProfile(next: Partial<User>) {
    if (!currentUser) return;
    setUsers((prev) =>
      prev.map((user) =>
        user.email === currentUser.email ? { ...user, ...next } : user,
      ),
    );
    flash("Profile saved.");
  }

  function saveCredentials() {
    if (!currentUser) return;

    const nextUsername = credentialDraft.username.trim();
    const nextEmail = credentialDraft.email.trim().toLowerCase();
    const nextPassword = credentialDraft.password.trim();

    if (!nextUsername || !nextEmail || nextPassword.length < 6) {
      flash("Enter a username, valid email, and a password with 6+ characters.");
      return;
    }

    const collision = users.some(
      (user) =>
        user.email !== currentUser.email &&
        (user.username.toLowerCase() === nextUsername.toLowerCase() ||
          user.email.toLowerCase() === nextEmail),
    );

    if (collision) {
      flash("That username or email is already in use.");
      return;
    }

    setUsers((prev) =>
      prev.map((user) =>
        user.email === currentUser.email
          ? {
              ...user,
              username: nextUsername,
              displayName: nextUsername,
              email: nextEmail,
              password: nextPassword,
              isAdmin: true,
            }
          : user,
      ),
    );
    onIdentityChanged(nextUsername, nextEmail);
    flash("Admin credentials updated.");
  }

  useEffect(() => {
    if (activeSection !== "posts" || editingId) return;
    setDraft((prev) => ({
      ...prev,
      author: currentUser?.displayName ?? prev.author,
      authorAvatar: currentUser?.avatar ?? prev.authorAvatar,
    }));
  }, [activeSection, currentUser?.avatar, currentUser?.displayName, editingId]);

  function renderSection() {
    if (activeSection === "posts") {
      return (
        <section className="admin-section">
          <div className="admin-section__grid">
            <article className="admin-panel">
              <div className="admin-panel__head">
                <div>
                  <h2>{editingId ? "Edit post" : "Create post"}</h2>
                  <p>Publish or update CryptoDyl content.</p>
                </div>
                {editingId && (
                  <button type="button" className="admin-text-btn" onClick={resetDraft}>
                    Cancel edit
                  </button>
                )}
              </div>

              <div className="admin-form">
                <div className="admin-field">
                  <label>Title</label>
                  <input
                    value={draft.title}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, title: e.target.value }))
                    }
                  />
                </div>
                <div className="admin-field">
                  <label>Excerpt</label>
                  <textarea
                    value={draft.excerpt}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, excerpt: e.target.value }))
                    }
                    rows={3}
                  />
                </div>
                <div className="admin-field">
                  <label>Content</label>
                  <textarea
                    value={draft.content}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, content: e.target.value }))
                    }
                    rows={7}
                  />
                </div>
                <div className="admin-form__row">
                  <div className="admin-field">
                    <label>Image URL</label>
                    <input
                      value={draft.image}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, image: e.target.value }))
                      }
                    />
                  </div>
                  <div className="admin-field">
                    <label>Category</label>
                    <select
                      value={draft.category}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, category: e.target.value }))
                      }
                    >
                      {CATEGORIES.map((category) => (
                        <option key={category.slug} value={category.slug}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="admin-form__row">
                  <div className="admin-field">
                    <label>Author</label>
                    <input
                      value={draft.author}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, author: e.target.value }))
                      }
                    />
                  </div>
                  <div className="admin-field">
                    <label>Date label</label>
                    <input
                      value={draft.date}
                      onChange={(e) =>
                        setDraft((prev) => ({ ...prev, date: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <div className="admin-form__row admin-form__row--compact">
                  <div className="admin-field">
                    <label>Views</label>
                    <input
                      type="number"
                      value={draft.views}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          views: Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                  <div className="admin-field">
                    <label>Comments</label>
                    <input
                      type="number"
                      value={draft.comments}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          comments: Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                  <button type="button" className="auth-submit" onClick={savePost}>
                    {editingId ? "Save changes" : "Publish post"}
                  </button>
                </div>
              </div>
            </article>

            <article className="admin-panel">
              <div className="admin-panel__head">
                <div>
                  <h2>Published posts</h2>
                  <p>Latest articles are listed first.</p>
                </div>
              </div>

              <div className="admin-list">
                {orderedPosts.map((post) => (
                  <div key={post.id} className="admin-list-item">
                    <img src={post.image} alt="" />
                    <div className="admin-list-item__body">
                      <div className="admin-list-item__meta">
                        <span>{post.category}</span>
                        <span>{post.date}</span>
                      </div>
                      <h3>{post.title}</h3>
                      <p>{post.excerpt}</p>
                      <div className="admin-list-item__actions">
                        <button type="button" onClick={() => startEdit(post)}>
                          Edit
                        </button>
                        <button type="button" onClick={() => deletePost(post.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>
      );
    }

    if (activeSection === "users") {
      return (
        <section className="admin-section">
          <article className="admin-panel">
            <div className="admin-panel__head">
              <div>
                <h2>Users</h2>
                <p>Promote or demote users from here.</p>
              </div>
            </div>
            <div className="admin-user-list">
              {users.map((user) => (
                <div key={user.email} className="admin-user-row">
                  <div>
                    <strong>{user.displayName}</strong>
                    <div className="admin-user-row__meta">{user.email}</div>
                  </div>
                  <div className="admin-user-row__actions">
                    {user.email === currentUserEmail ? (
                      <span className="status-chip">You</span>
                    ) : (
                      <div className="admin-user-row__button-group">
                        <button type="button" onClick={() => toggleAdmin(user.email)}>
                          {user.isAdmin ? "Remove admin" : "Make admin"}
                        </button>
                        <button
                          type="button"
                          className="admin-danger-btn"
                          onClick={() => removeUser(user.email)}
                        >
                          Remove user
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      );
    }

    if (activeSection === "profile") {
      return (
        <section className="admin-section">
          <article className="admin-panel">
            <div className="admin-panel__head">
              <div>
                <h2>Admin profile</h2>
                <p>Update the active admin account and login details.</p>
              </div>
            </div>
            <div className="admin-form">
              <div className="admin-form__row">
                <div className="admin-field">
                  <label>Username</label>
                  <input
                    value={credentialDraft.username}
                    onChange={(e) =>
                      setCredentialDraft((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="admin-field">
                  <label>Email</label>
                  <input
                    type="email"
                    value={credentialDraft.email}
                    onChange={(e) =>
                      setCredentialDraft((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="admin-form__row">
                <div className="admin-field">
                  <label>Password</label>
                  <input
                    type="password"
                    value={credentialDraft.password}
                    onChange={(e) =>
                      setCredentialDraft((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="admin-field admin-field--action">
                  <label>&nbsp;</label>
                  <button type="button" className="auth-submit" onClick={saveCredentials}>
                    Save credentials
                  </button>
                </div>
              </div>
              <div className="admin-form__row">
                <div className="admin-field">
                  <label>Display name</label>
                  <input
                    value={currentUser?.displayName ?? ""}
                    onChange={(e) => updateProfile({ displayName: e.target.value })}
                  />
                </div>
                <div className="admin-field">
                  <label>Avatar URL</label>
                  <input
                    value={currentUser?.avatar ?? ""}
                    onChange={(e) => updateProfile({ avatar: e.target.value })}
                  />
                </div>
              </div>
              <div className="admin-field">
                <label>Bio</label>
                <textarea
                  value={currentUser?.bio ?? ""}
                  onChange={(e) => updateProfile({ bio: e.target.value })}
                  rows={5}
                />
              </div>
            </div>
          </article>
        </section>
      );
    }

    if (activeSection === "categories") {
      return (
        <section className="admin-section">
          <article className="admin-panel">
            <div className="admin-panel__head">
              <div>
                <h2>Categories</h2>
                <p>Quick access to category pages.</p>
              </div>
            </div>
            <div className="admin-link-grid">
              {CATEGORIES.map((category) => (
                <button
                  key={category.slug}
                  type="button"
                  onClick={() => navigate(`/category/${category.slug}`)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </article>
        </section>
      );
    }

    if (activeSection === "pages") {
      return (
        <section className="admin-section">
          <article className="admin-panel">
            <div className="admin-panel__head">
              <div>
                <h2>Pages</h2>
                <p>Jump to public pages and archives.</p>
              </div>
            </div>
            <div className="admin-link-grid">
              <button type="button" onClick={() => navigate("/")}>
                Home
              </button>
              <button type="button" onClick={() => navigate("/posts")}>
                Posts
              </button>
              <button type="button" onClick={() => navigate("/archives")}>
                Archives
              </button>
              <button type="button" onClick={() => navigate("/popular")}>
                Popular
              </button>
            </div>
          </article>
        </section>
      );
    }

    if (activeSection === "settings") {
      return (
        <section className="admin-section">
          <article className="admin-panel">
            <div className="admin-panel__head">
              <div>
                <h2>Settings</h2>
                <p>Basic operational summary for the admin panel.</p>
              </div>
            </div>
            <div className="admin-setting-stats">
              <div>
                <span>Posts</span>
                <strong>{totalPosts}</strong>
              </div>
              <div>
                <span>Users</span>
                <strong>{totalUsers}</strong>
              </div>
              <div>
                <span>Admins</span>
                <strong>{adminUsers}</strong>
              </div>
              <div>
                <span>Unpublished</span>
                <strong>{unpublishedPosts}</strong>
              </div>
            </div>
          </article>
        </section>
      );
    }

    return (
      <>
        {notice && <div className="admin-notice">{notice}</div>}
        <div className="admin-cards">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.title} className="admin-metric-card">
                <div className="admin-metric-card__icon">
                  <Icon size={48} strokeWidth={1.9} />
                </div>
                <div className="admin-metric-card__body">
                  <div className="admin-metric-card__label">
                    {card.title}: {card.value}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleSidebarAction(
                        card.label === "Users" ? "users" : "posts",
                      )
                    }
                  >
                    {card.label}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <div className="admin-quick-grid">
          <article className="admin-quick-card">
            <div className="admin-quick-card__head">
              <h2>Content overview</h2>
              <BarChart3 size={18} />
            </div>
            <p>
              {totalPosts} live posts, {totalUsers} registered users, and the
              newest article is{" "}
              <strong>{latestPost?.title ?? "not available yet"}</strong>.
            </p>
          </article>

          <article className="admin-quick-card">
            <div className="admin-quick-card__head">
              <h2>Admin links</h2>
              <Bell size={18} />
            </div>
            <div className="admin-quick-links">
              <span>
                <Layers3 size={14} /> Manage content
              </span>
              <span>
                <Globe size={14} /> View public website
              </span>
              <span>
                <ShieldCheck size={14} /> Security settings
              </span>
            </div>
          </article>
        </div>
      </>
    );
  }

  return (
    <motion.main {...pageMotion} className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <span>Admin Panel</span>
        </div>

        <nav className="admin-sidebar__nav">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={`admin-sidebar__item ${
                  activeSection === item.section ? "is-active" : ""
                }`}
                type="button"
                onClick={() => handleSidebarAction(item.section)}
              >
                <Icon size={15} />
                <span>{item.label}</span>
              </button>
            );
          })}
          <button className="admin-sidebar__item" type="button" onClick={() => navigate("/")}>
            <Monitor size={15} />
            <span>View Website</span>
          </button>
          <button
            className="admin-sidebar__item"
            type="button"
            onClick={() => {
              onLogout();
              navigate("/login");
            }}
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </nav>

        <div className="admin-sidebar__footer">INSTINCT BLOG V4.0</div>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div />
          <button
            className="admin-profile-chip"
            type="button"
            onClick={() => setActiveSection("profile")}
          >
            <img src={cryptodylLogoImage} alt="" />
            <span>{currentUser?.displayName ?? "Dylan"}</span>
            <ChevronDown size={14} />
          </button>
        </header>

        <div className="admin-main__content">
          <div className="admin-page-head">
            <h1>
              {activeSection === "dashboard"
                ? "Dashboard"
                : activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
            </h1>
          </div>

          {renderSection()}
        </div>
      </section>
    </motion.main>
  );
}

/* -- Footer --------------------------------------------------------- */
function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="brand">
              <div className="brand__mark">
                <img
                  src={cryptodylLogoImage}
                  alt="CryptoDyl"
                  className="h-7 w-7 object-contain"
                />
              </div>
              <span className="brand__text">CryptoDyl</span>
            </Link>
            <p>
              Research-driven crypto intelligence and passive income systems
              curated with brutal clarity.
            </p>
            <div className="footer-socials">
              <a href="#">𝕏</a>
              <a href="#">✈</a>
              <a href="#">◉</a>
            </div>
          </div>

          <div className="footer-links">
            <div>
              <span>Explore</span>
              <Link to="/">Home</Link>
              <Link to="/posts">Guides</Link>
              <Link to="/categories">Categories</Link>
              <Link to="/popular">Trending</Link>
            </div>
            <div>
              <span>Resources</span>
              <Link to="/archives">Archives</Link>
              <Link to="/">About</Link>
              <Link to="/">Contact</Link>
              <Link to="/">Sitemap</Link>
            </div>
            <div>
              <span>Account</span>
              <Link to="/login">Login</Link>
              <Link to="/register">Join Now</Link>
              <Link to="/profile/Dylan">Profile</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>© 2026 CryptoDyl. All rights reserved.</div>
          <div className="footer-bottom__links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* -- Atmosphere ----------------------------------------------------- */
function Atmosphere() {
  return (
    <>
      <div className="site-bg" />
      <div className="site-noise" />
      <div className="site-glow site-glow--a" />
      <div className="site-glow site-glow--b" />
      <div className="site-gridlines" />
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
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <div className="scroll-progress" style={{ transform: `scaleX(${w})` }} />
  );
}

/* -- Cursor Halo ---------------------------------------------------- */
function CursorHalo() {
  return null;
}

/* -- Brand Ticker --------------------------------------------------- */
function BrandTicker() {
  const items = [
    { k: "BTC", v: "$112,480", c: "+2.45%" },
    { k: "ETH", v: "$4,128", c: "+1.85%" },
    { k: "BNB", v: "$612", c: "+0.95%" },
    { k: "SOL", v: "$248", c: "+1.65%" },
    { k: "XRP", v: "$2.84", c: "+1.35%" },
    { k: "DOGE", v: "$0.42", c: "+5.23%" },
    { k: "ADA", v: "$0.82", c: "+2.11%" },
  ];

  return (
    <div className="ticker">
      <div className="ticker__track">
        {[...items, ...items, ...items].map((i, idx) => (
          <span key={idx} className="ticker__item">
            <span className="ticker__coin">{i.k}</span>
            <b>{i.v}</b>
            <span className="ticker__change">{i.c}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* -- App ------------------------------------------------------------ */
export default function App() {
  const [posts, setPosts] = useState<Post[]>(() => readPosts());
  const [users, setUsers] = useState<User[]>(() => readUsers());
  const [isAdmin, setIsAdmin] = useState<boolean>(() => readAdmin());
  const [loggedUser, setLoggedUser] = useState<string | null>(() =>
    readLoggedInUser(),
  );
  const [loggedUserEmail, setLoggedUserEmail] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(POST_STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  function handleLogin(username: string) {
    const user = users.find(
      (entry) =>
        entry.username.toLowerCase() === username.toLowerCase() ||
        entry.email.toLowerCase() === username.toLowerCase(),
    );

    setIsAdmin(Boolean(user?.isAdmin));
    setLoggedUser(user?.username ?? username);
    setLoggedUserEmail(user?.email ?? null);
    if (user?.isAdmin) {
      localStorage.setItem(ADMIN_STORAGE_KEY, "true");
    } else {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    }
    localStorage.setItem(LOGGED_IN_USER_KEY, user?.username ?? username);
  }

  function handleAdminIdentityChange(
    nextUsername: string,
    nextEmail: string,
  ) {
    setLoggedUser(nextUsername);
    setLoggedUserEmail(nextEmail);
    localStorage.setItem(LOGGED_IN_USER_KEY, nextUsername);
  }

  function handleLogout() {
    setIsAdmin(false);
    setLoggedUser(null);
    setLoggedUserEmail(null);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    localStorage.removeItem(LOGGED_IN_USER_KEY);
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="app-shell">
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
          <Route
            path="/profile/:name"
            element={<ProfilePage posts={posts} users={readUsers()} />}
          />
          <Route path="/popular" element={<PopularPage posts={posts} />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route
            path="/category/:slug"
            element={<CategoryPostsPage posts={posts} />}
          />
          <Route path="/archives" element={<ArchivesPage posts={posts} />} />
          <Route path="/archive" element={<ArchiveMonthPage posts={posts} />} />
          <Route
            path="/admin"
            element={
              isAdmin ? (
                <AdminPanel
                  posts={posts}
                  setPosts={setPosts}
                  users={users}
                  setUsers={setUsers}
                  currentUserEmail={loggedUserEmail}
                  onLogout={handleLogout}
                  onIdentityChanged={handleAdminIdentityChange}
                />
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
