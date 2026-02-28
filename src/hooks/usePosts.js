import { useState, useEffect } from 'react';


export function usePosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                // 1. Vite specific: Import all .md files from root posts folder
                // The path must be relative from THIS file (src/hooks) to the posts dir
                const modules = import.meta.glob('../../posts/*.md', { query: '?raw', import: 'default' });

                const parsedPosts = [];

                for (const path in modules) {
                    const raw = await modules[path]();

                    // Manual Frontmatter Parsing to avoid 'Buffer' errors in browser
                    let title = path.split('/').pop().replace('.md', ''); // default
                    let date = 'unknown';
                    let category = 'log'; // default category
                    let content = raw;

                    // Robust Regex for Frontmatter (handles \n and \r\n)
                    const fmMatch = raw.match(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+([\s\S]*)$/);

                    if (fmMatch) {
                        const metadata = fmMatch[1];
                        content = fmMatch[2];

                        // Extract keys and strip quotes
                        const titleMatch = metadata.match(/title:\s*(.*)/);
                        if (titleMatch) title = titleMatch[1].trim().replace(/^["']|["']$/g, '');

                        const dateMatch = metadata.match(/date:\s*(.*)/);
                        if (dateMatch) date = dateMatch[1].trim().replace(/^["']|["']$/g, '');

                        const categoryMatch = metadata.match(/category:\s*(.*)/);
                        if (categoryMatch) category = categoryMatch[1].trim().toLowerCase().replace(/^["']|["']$/g, '');
                    } else {
                        // Fallback: try to find first H1
                        const h1Match = raw.match(/^#\s+(.*)/m);
                        if (h1Match) title = h1Match[1].trim();
                    }

                    // Extract filename slug
                    const slug = path.split('/').pop();

                    parsedPosts.push({
                        slug,
                        title,
                        date,
                        category,
                        content
                    });
                }

                setPosts(parsedPosts.sort((a, b) => (a.date > b.date ? -1 : 1)));
            } catch (e) {
                console.error("Critical Error loading posts:", e);
                // Add a fake error post so user sees something
                setPosts([{ slug: 'error', title: 'SYSTEM ERROR', date: 'NOW', content: `# Error\n${e.message}` }]);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    return { posts, loading };
}
