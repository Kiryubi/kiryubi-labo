import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { usePosts } from './hooks/usePosts'
import MatrixRain from './components/MatrixRain'

// Helper to filter posts based on current route
const getFilteredPosts = (allPosts, path) => {
    if (path === '/games') return allPosts.filter(p => p.category === 'game');
    if (path === '/jornal') return allPosts.filter(p => p.category === 'jornal');
    if (path === '/ciencia') return allPosts.filter(p => p.category === 'science' || p.category === 'log' || p.category === 'unknown');
    return allPosts; // Default: show all
};

const Sidebar = ({ posts }) => {
    const location = useLocation();
    const filteredPosts = getFilteredPosts(posts, location.pathname);

    // Get dynamic sub-menu for Jornal
    const jornalPosts = posts.filter(p => p.category === 'jornal').sort((a, b) => new Date(b.date) - new Date(a.date));

    // Handle submenu toggle state based on route
    const isJornalActive = location.pathname.startsWith('/jornal') || location.pathname.startsWith('/post/jornal');

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
                    <Link to="/jornal" className="nav-item">/JORNAL_DIÁRIO</Link>
                    {(isJornalActive || location.pathname === '/') && jornalPosts.length > 0 && (
                        <div className="submenu">
                            {jornalPosts.map(p => (
                                <Link key={p.slug} to={`/post/${p.slug}`} className="submenu-item">
                                    {`└── [${p.date ? p.date.substring(0, 10).split('-').reverse().join('/') : '????'}]`}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
                <Link to="/games" className="nav-item">/GAMES</Link>
                <Link to="/ciencia" className="nav-item">/CIENCIA</Link>
            </nav>
            <div className="post-list">
                <div className="list-header">
                    {location.pathname === '/' ? 'ALL_FILES:' :
                        location.pathname.toUpperCase().substring(1) + '_FILES:'}
                </div>
                {filteredPosts.length > 0 ? filteredPosts.map(p => (
                    <Link key={p.slug} to={`/post/${p.slug}`} className="post-item">
                        <span className="date">[{p.date ? p.date.substring(0, 10) : '????'}]</span>
                        <span className="title">{p.title}</span>
                    </Link>
                )) : <div style={{ opacity: 0.5 }}>{'<NO_DATA>'}</div>}
            </div>
        </aside>
    )
};

const Related = () => (
    <aside className="col related mobile-hidden hud-panel">
        <div className="status-block">
            <pre>
                mem_usage: {Math.floor(Math.random() * 40)}%
                uptime:    999h
            </pre>
        </div>
        <div>
            <span>[links]</span>
            <ul>
                <li>{'>'} github</li>
                <li>{'>'} twitter</li>
            </ul>
        </div>
    </aside>
)

// List View for Category Pages
const CategoryView = ({ posts, category }) => {
    const filtered = posts.filter(p => {
        if (category === 'science') return p.category === 'science' || p.category === 'log' || p.category === 'unknown';
        if (category === 'jornal') return p.category === 'jornal';
        return p.category === category;
    });
    return (
        <div className="markdown-content">
            <h1>/INDEX: {category.toUpperCase()}</h1>
            {filtered.length === 0 ? <p>No files found.</p> : (
                <ul style={{ listStyle: 'none' }}>
                    {filtered.map(p => (
                        <li key={p.slug} style={{ marginBottom: '1rem', borderBottom: '1px dashed #333', paddingBottom: '10px' }}>
                            <Link to={`/post/${p.slug}`} style={{ color: 'var(--neon-green)', textDecoration: 'none', fontSize: '1.2rem' }}>
                                {'>'} {p.title}
                            </Link>
                            <div style={{ color: '#666', fontSize: '0.8rem' }}>{p.date}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const PostViewer = ({ posts }) => {
    const { pathname } = useLocation();
    const slug = pathname.split('/').pop();
    const decodedSlug = decodeURIComponent(slug);

    // If root, show welcome.md
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
                    <Route path="/ciencia" element={<CategoryView posts={posts} category="science" />} />
                    <Route path="/post/:slug" element={<PostViewer posts={posts} />} />
                    <Route path="*" element={<div><h1>404</h1></div>} />
                </Routes>
            </main>

            <Related />
        </div>
    )
}

export default App
