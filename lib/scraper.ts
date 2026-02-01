
export interface JobNotification {
    id: string;
    title: string;
    link: string;
    category?: string;
}

export async function fetchLatestJobs(): Promise<JobNotification[]> {
    try {
        const response = await fetch('https://www.freejobalert.com/latest-notifications/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            console.error(`Status: ${response.status}`);
            throw new Error(`Failed to fetch jobs: ${response.statusText}`);
        }

        const html = await response.text();
        const jobs: JobNotification[] = [];

        // Regex to find links. Looking for <a ... href="..." ...> ... </a>
        // We focus on href and the text content.
        // Using [\s\S] instead of . with s flag for ES2017 compatibility
        const linkRegex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a>/gi;

        let match;
        while ((match = linkRegex.exec(html)) !== null) {
            const link = match[2];
            // Remove HTML tags from text (nested tags inside a)
            const text = match[3].replace(/<[^>]*>/g, '').trim();

            if (link && (link.includes('/articles/') || link.includes('recruitment'))) {

                if (text.toLowerCase() === 'get details' || text.toLowerCase() === 'click here') {
                    const slug = link.split('/').filter(Boolean).pop() || '';
                    const derivedTitle = slug
                        .replace(/-?\d+$/, '')
                        .replace(/-/g, ' ')
                        .replace(/\b\w/g, c => c.toUpperCase());

                    if (derivedTitle.length > 10) {
                        jobs.push({
                            id: link,
                            title: derivedTitle,
                            link: link,
                            category: 'Latest'
                        });
                    }
                } else if (text.length > 10 && !text.toLowerCase().includes('freejobalert')) {
                    jobs.push({
                        id: link,
                        title: text,
                        link: link,
                        category: 'Latest'
                    });
                }
            }
        }

        // De-duplicate by link
        const uniqueJobs = Array.from(new Map(jobs.map(item => [item.link, item])).values());

        return uniqueJobs.slice(0, 50); // Return top 50
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return [];
    }
}
