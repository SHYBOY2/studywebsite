import * as cheerio from 'cheerio';

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
            throw new Error(`Failed to fetch jobs: ${response.statusText}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);
        const jobs: JobNotification[] = [];

        // Strategy: Find all links in the main content area that look like job posts
        // The specific selector might need adjustment. Based on analysis, links are often in a list or table.
        // We'll target the main container content. usually .latnot or similar, but generic 'a' with specific href patterns is safer if class is unknown.

        // Pattern for job URLs: /articles/ or containing 'recruitment', 'exam', 'apply'
        $('a').each((_, element) => {
            const link = $(element).attr('href');
            const text = $(element).text().trim();

            if (link && (link.includes('/articles/') || link.includes('recruitment'))) {
                // Avoid duplicates or generic links
                if (text.toLowerCase() === 'get details' || text.toLowerCase() === 'click here') {
                    // If the text is generic, try to derive title from URL
                    const slug = link.split('/').filter(Boolean).pop() || '';
                    // Remove trailing numbers or generic IDs from slug if possible
                    const derivedTitle = slug
                        .replace(/-?\d+$/, '') // remove trailing numbers
                        .replace(/-/g, ' ') // replace dashes with spaces
                        .replace(/\b\w/g, c => c.toUpperCase()); // Capitalize

                    if (derivedTitle.length > 10) {
                        jobs.push({
                            id: link,
                            title: derivedTitle,
                            link: link,
                            category: 'Latest'
                        });
                    }
                } else if (text.length > 10 && !text.includes('FreeJobAlert')) {
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
