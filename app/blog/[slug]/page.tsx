import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { articles, getArticle, getAllSlugs } from '@/lib/blog';

const BASE_URL = 'https://rumahya.com';

export function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: 'Article not found' };

  const url = `${BASE_URL}/blog/${slug}`;
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description: article.description,
      url,
      type: 'article',
      publishedTime: article.date,
      images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: article.title }],
    },
    twitter: { card: 'summary_large_image', title: article.title, description: article.description },
  };
}

export default async function BlogArticlePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const url = `${BASE_URL}/blog/${slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.date,
    author: { '@type': 'Organization', name: 'RumahYa', url: BASE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'RumahYa',
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/og-image.jpg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: `${BASE_URL}/og-image.jpg`,
  };

  const related = articles.filter(a => a.slug !== slug).slice(0, 3);

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="legal-page blog-article">
        <Link href="/blog" className="blog-back">← Guide</Link>
        <p className="blog-article-cat">{article.category}</p>
        <h1>{article.title}</h1>
        <p className="legal-meta">
          {new Date(article.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          {' · '}{article.readTime} read
        </p>
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </article>

      {related.length > 0 && (
        <section className="container blog-related">
          <h2 className="blog-related-title">More guides</h2>
          <div className="blog-grid">
            {related.map(a => (
              <Link key={a.slug} href={`/blog/${a.slug}`} className="blog-card">
                <span className="blog-card-cat">{a.category}</span>
                <h3 className="blog-card-title">{a.title}</h3>
                <p className="blog-card-desc">{a.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
