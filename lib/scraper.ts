
import * as cheerio from 'cheerio';

export interface JobNotification {
    id: string;
    title: string;
    link: string;
    category?: string;
}

export async function fetchLatestJobs(): Promise<JobNotification[]> {
    try {
        // Add timestamp to prevent caching
        const timestamp = Date.now();
        const response = await fetch(`https://www.freejobalert.com/latest-notifications/?t=${timestamp}`, {
            headers: {
                // Use Googlebot UA as it's often whitelisted
                'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            },
            next: { revalidate: 0 }
        });

        if (!response.ok) {
            console.error(`Status: ${response.status}`);
            throw new Error(`Failed to fetch jobs: ${response.statusText}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);
        const jobs: JobNotification[] = [];

        $('a').each((_, el) => {
            const link = $(el).attr('href');
            const text = $(el).text().trim();

            if (link && (link.includes('/articles/') || link.includes('recruitment'))) {
                // If the link text is generic like "Get Details", try to derive title from URL
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
                }
                // Otherwise use the link text if it looks like a title
                else if (text.length > 10 && !text.toLowerCase().includes('freejobalert')) {
                    jobs.push({
                        id: link,
                        title: text,
                        link: link,
                        category: 'Latest'
                    });
                }
            }
        });

        // De-duplicate by link
        const uniqueJobs = Array.from(new Map(jobs.map(item => [item.link, item])).values());

        return uniqueJobs.slice(0, 50); // Return top 50
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return [];
    }
}
