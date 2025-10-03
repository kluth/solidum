import type { FeedReader, FeedConfig, Feed, FeedItem } from './types';

export function createFeedReader(config: FeedConfig): FeedReader {
  const { url, timeout = 30000 } = config;

  async function parseFeed(xmlText: string): Promise<Feed> {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'text/xml');

    // Check for parse errors
    const parseError = doc.querySelector('parsererror');
    if (parseError) {
      throw new Error('Failed to parse feed XML');
    }

    // Detect feed type
    const isAtom = doc.querySelector('feed') !== null;
    const isRSS = doc.querySelector('rss') !== null;

    if (isAtom) {
      return parseAtomFeed(doc);
    } else if (isRSS) {
      return parseRSSFeed(doc);
    } else {
      throw new Error('Unknown feed format');
    }
  }

  function parseRSSFeed(doc: Document): Feed {
    const channel = doc.querySelector('channel');
    if (!channel) {
      throw new Error('Invalid RSS feed: no channel element');
    }

    const items: FeedItem[] = Array.from(channel.querySelectorAll('item')).map(item => {
      const title = item.querySelector('title')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '';
      const description = item.querySelector('description')?.textContent;
      const content = item.querySelector('content\\:encoded')?.textContent;
      const author =
        item.querySelector('author')?.textContent ||
        item.querySelector('dc\\:creator')?.textContent;
      const pubDate = item.querySelector('pubDate')?.textContent;
      const guid = item.querySelector('guid')?.textContent || link;

      const categories = Array.from(item.querySelectorAll('category')).map(
        cat => cat.textContent || ''
      );

      return {
        id: guid,
        title,
        link,
        description,
        content,
        author,
        pubDate: pubDate ? new Date(pubDate) : undefined,
        categories,
        guid,
      };
    });

    return {
      title: channel.querySelector('title')?.textContent || '',
      link: channel.querySelector('link')?.textContent || '',
      description: channel.querySelector('description')?.textContent,
      items,
      lastBuildDate: channel.querySelector('lastBuildDate')?.textContent
        ? new Date(channel.querySelector('lastBuildDate')!.textContent!)
        : undefined,
      language: channel.querySelector('language')?.textContent || undefined,
      image: channel.querySelector('image')
        ? {
            url: channel.querySelector('image url')?.textContent || '',
            title: channel.querySelector('image title')?.textContent,
            link: channel.querySelector('image link')?.textContent,
          }
        : undefined,
    };
  }

  function parseAtomFeed(doc: Document): Feed {
    const feed = doc.querySelector('feed');
    if (!feed) {
      throw new Error('Invalid Atom feed: no feed element');
    }

    const items: FeedItem[] = Array.from(feed.querySelectorAll('entry')).map(entry => {
      const title = entry.querySelector('title')?.textContent || '';
      const link = entry.querySelector('link')?.getAttribute('href') || '';
      const summary = entry.querySelector('summary')?.textContent;
      const content = entry.querySelector('content')?.textContent;
      const author = entry.querySelector('author name')?.textContent;
      const published = entry.querySelector('published')?.textContent;
      const updated = entry.querySelector('updated')?.textContent;
      const id = entry.querySelector('id')?.textContent || link;

      return {
        id,
        title,
        link,
        description: summary,
        content,
        author,
        pubDate: published ? new Date(published) : updated ? new Date(updated) : undefined,
      };
    });

    return {
      title: feed.querySelector('title')?.textContent || '',
      link: feed.querySelector('link')?.getAttribute('href') || '',
      description: feed.querySelector('subtitle')?.textContent,
      items,
    };
  }

  return {
    async fetch(): Promise<Feed> {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(timeout),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch feed: ${response.status} ${response.statusText}`);
      }

      const xmlText = await response.text();
      return parseFeed(xmlText);
    },

    subscribe(callback: (items: FeedItem[]) => void, pollInterval: number = 60000): () => void {
      let lastItems: FeedItem[] = [];

      const poll = async () => {
        try {
          const feed = await this.fetch();
          const newItems = feed.items.filter(
            item => !lastItems.some(lastItem => lastItem.id === item.id)
          );

          if (newItems.length > 0) {
            callback(newItems);
          }

          lastItems = feed.items;
        } catch {
          // Silently handle errors in polling
        }
      };

      // Initial fetch
      poll();

      // Start polling
      const intervalId = setInterval(poll, pollInterval);

      return () => {
        clearInterval(intervalId);
      };
    },
  };
}
