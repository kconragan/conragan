import rss from '@astrojs/rss';
import type { RSSFeedItem } from '@astrojs/rss'; // Add 'type' here
import { getCollection, type CollectionEntry } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';

const markdownParser = new MarkdownIt();

export async function GET() {
  const posts = await getCollection('blog', (post) => post.data.isPublic);

  const sortedPosts = posts.sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  const feedItems: RSSFeedItem[] = await Promise.all(
    sortedPosts.map(async (post: CollectionEntry<'blog'>) => {
      const { Content } = await post.render();
      return {
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.description,
        link: `/blog/${post.slug}/`,
        content: sanitizeHtml(markdownParser.render(post.body)),
        guid: `${import.meta.env.SITE}/blog/${post.slug}/`, // ABSOLUTE URL for GUID
        customData: post.data.tags ? post.data.tags.map((tag) => `<category>${tag}</category>`).join('') : '', // Add categories if tags exist
      };
    })
  );

  return rss({
    title: "Kai Conragan", // Replace with your site title
    description: "Senior Director UX at Google. A blogger. And a photographer.", // Replace with your site description
    site: import.meta.env.SITE,
    items: feedItems,
    customData: `
      <language>en-us</language>
      <atom:link href="${import.meta.env.SITE}/rss.xml" rel="self" type="application/rss+xml" xmlns:atom="http://www.w3.org/2005/Atom" />
      <managingEditor>kai@conragan.com (Kai Conragan)</managingEditor>
      <webMaster>kai@conragan.com (Kai Conragan)</webMaster>
    `,
    stylesheet: '/rss-style.xsl',
  });
}
