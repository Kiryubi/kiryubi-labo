import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { usePosts } from './hooks/usePosts'
import MatrixRain from './components/MatrixRain'

// Format a YYYY-MM-DD string to DD/MM/YYYY (Brazilian format)
const toBRDate = (isoDate) => {
    if (!isoDate) return '????';
    const parts = isoDate.substring(0, 10).split('-');
    if (parts.length !== 3) return isoDate;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
};

const Sidebar = ({ posts }) => {
    const location = useLocation();
    const [jornalOpen, setJornalOpen] = useState(
        location.pathname.startsWith('/jornal')
    );

    // Get unique sorted dates from 'noticia' posts for the Jornal submenu
    const noticiasPosts = posts.filter(p => p.category === 'noticia');
    const uniqueDates = [...new Set(
        noticiasPosts.map(p => p.date ? p.date.substring(0, 10) : null).filter(Boolean)
    )].sort((a, b) => (a > b ? -1 : 1));

    return (
        <aside className="col sidebar hud-panel">
            <header className="ascii-header">
                <pre className="logo-ascii">
                    {`██╗  ██╗██╗██████╗ ██╗   ██╗██╗   ██╗██████╗ ██╗
██║ ██╔╝██║██╔══██╗╚██╗ ██╔╝██║   ██║██╔══██╗██║
█████╔╝ ██║██████╔╝ ╚████╔╝ ██║   ██║██████╔╝██║
██╔═██╗ ██║██╔══██╗  ╚██╔╝  ██║   ██║██╔══██╗██║
██║  ██╗██║██║  ██║   ██║   ╚██████╔╝██████╔╝██║
╚═╝  ╚═╝╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝.LAB`}
                </pre>
                <div className="status-line">
                    <span>STATUS: ONLINE</span>
                    <span className="blink">_</span>
                </div>
            </header>
            <nav>
                <Link to="/" className="nav-item">/MAIN_SYSTEM</Link>
                <div className="nav-group">
                    <Link
                        to="/jornal"
                        className="nav-item"
                        onClick={() => setJornalOpen(o => !o)}
                    >
                        /JORNAL_DIÁRIO
                    </Link>
                    {jornalOpen && uniqueDates.length > 0 && (
                        <div className="submenu">
                            {uniqueDates.map(date => (
                                <Link key={date} to={`/jornal/${date}`} className="submenu-item">
                                    {`└── [${toBRDate(date)}]`}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
                <Link to="/games" className="nav-item">/GAMES</Link>
                <Link to="/ciencia" className="nav-item">/CIENCIA</Link>
            </nav>
        </aside>
    )
};

// Right panel: Ad space
const AdPanel = () => (
    <aside className="col related mobile-hidden hud-panel">
        <div className="ad-panel-header">[ ANÚNCIOS ]</div>
        <div className="ad-slot">
            <span className="ad-placeholder">AD_SPACE_01</span>
            <span className="ad-placeholder-sub">728×90 / 300×250</span>
        </div>
        <div className="ad-slot" style={{ marginTop: '1rem' }}>
            <span className="ad-placeholder">AD_SPACE_02</span>
            <span className="ad-placeholder-sub">300×600</span>
        </div>
    </aside>
)

// Card Grid renderer — shared between CategoryView and JornalDayView
const PostCardGrid = ({ posts, header }) => (
    <div className="markdown-content">
        <h1>{header}</h1>
        {posts.length === 0 ? <p>No files found.</p> : (
            <div className="post-grid">
                {posts.map(p => (
                    <Link key={p.slug} to={`/post/${p.slug}`} className="post-card" style={{ textDecoration: 'none' }}>
                        <div className="card-tag">
                            {p.topic ? p.topic.toUpperCase() : 'LOG'}
                        </div>
                        <h2 className="card-title">{p.title}</h2>
                        <p className="card-excerpt">{p.excerpt}</p>
                        <span className="card-link">Ler notícia completa →</span>
                    </Link>
                ))}
            </div>
        )}
    </div>
);

// Day View: cards for all posts on a specific date
const JornalDayView = ({ posts }) => {
    const { date } = useParams();
    const dayPosts = posts
        .filter(p => p.category === 'noticia' && p.date && p.date.substring(0, 10) === date)
        .sort((a, b) => a.title > b.title ? 1 : -1);

    return (
        <PostCardGrid
            posts={dayPosts}
            header={`/JORNAL: ${toBRDate(date)}`}
        />
    );
};

// General Category List View
const CategoryView = ({ posts, category }) => {
    const filtered = posts.filter(p => {
        if (category === 'science') return p.category === 'science' || p.category === 'log' || p.category === 'unknown';
        if (category === 'jornal') return p.category === 'noticia';
        return p.category === category;
    });

    const header = category === 'jornal' ? '/INDEX: JORNAL DIÁRIO' : `/INDEX: ${category.toUpperCase()}`;
    return <PostCardGrid posts={filtered} header={header} />;
};

const PostViewer = ({ posts }) => {
    const { pathname } = useLocation();
    const slug = pathname.split('/').pop();
    const decodedSlug = decodeURIComponent(slug);

    const targetSlug = pathname === '/' ? 'welcome.md' : decodedSlug;
    const post = posts.find(p => p.slug === targetSlug);

    if (!post) return <div><h1>404</h1><p>File not found in sector.</p></div>

    return (
        <div className="markdown-content">
            <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
    )
}

function App() {
    const { posts, loading } = usePosts();

    if (loading) return <div className="crt">System initializing...</div>

    return (
        <div className="crt app-grid">
            <MatrixRain />
            <div className="fog-layer"></div>
            <Sidebar posts={posts} />

            <main className="col main-content hud-panel">
                <Routes>
                    <Route path="/" element={<PostViewer posts={posts} />} />
                    <Route path="/games" element={<CategoryView posts={posts} category="game" />} />
                    <Route path="/jornal" element={<CategoryView posts={posts} category="jornal" />} />
                    <Route path="/jornal/:date" element={<JornalDayView posts={posts} />} />
                    <Route path="/ciencia" element={<CategoryView posts={posts} category="science" />} />
                    <Route path="/post/:slug" element={<PostViewer posts={posts} />} />
                    <Route path="*" element={<div><h1>404</h1></div>} />
                </Routes>
            </main>

            <AdPanel />
        </div>
    )
}

export default App
