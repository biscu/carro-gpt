import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import matter from 'gray-matter';
import remarkGfm from 'remark-gfm';

interface PageProps {
  params: {
    slug: string;
  };
}

// Custom components for markdown elements
const components: Components = {
  table: ({ node, ...props }) => (
    <div className="overflow-x-auto overflow-y-auto max-h-96 my-1">
      <table className="w-full border-collapse" {...props} />
    </div>
  ),
  th: ({ node, ...props }) => (
    <th
    className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider bg-gray-50 border-b border-gray-200 sticky top-0 z-10"
      {...props}
    />
  ),
  td: ({ node, ...props }) => (
    <td
      className="px-4 py-3 text-sm text-gray-700 border-b border-gray-200"
      {...props}
    />
  ),
  code(
    props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      inline?: boolean;
      className?: string;
    }
  ) {
    const { inline, className, children, ...rest } = props;
  
    // Consider as block if a language class is present; default to inline otherwise
    const hasLanguageClass = !!className && /\blanguage-/.test(className);
    const isInline = inline ?? !hasLanguageClass;
  
    if (isInline) {
      return (
        <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800" {...rest}>
          {children}
        </code>
      );
    }
  
    return (
      <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto my-4 border border-gray-800">
        <code className={`text-gray-100 text-sm ${className ?? ''}`} {...rest}>
          {children}
        </code>
      </pre>
    );
  },
  a: ({ node, ...props }) => (
    <a
      className="text-blue-600 hover:underline hover:text-blue-800"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  blockquote: ({ node, ...props }) => (
    <blockquote
      className="border-l-4 border-gray-300 pl-4 my-6 text-gray-600 italic"
      {...props}
    />
  ),
  h1: ({ node, ...props }) => (
    <h1 className="text-3xl font-bold text-gray-900 mb-6" {...props} />
  ),
  h2: ({ node, ...props }) => (
    <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-4" {...props} />
  ),
  h3: ({ node, ...props }) => (
    <h3 className="text-xl font-medium text-gray-800 mt-8 mb-3" {...props} />
  ),
  p: ({ node, ...props }) => (
    <p className="my-4 text-gray-700 leading-relaxed" {...props} />
  ),
  ul: ({ node, ...props }) => (
    <ul className="list-disc pl-6 my-4 text-gray-700 space-y-1" {...props} />
  ),
  ol: ({ node, ...props }) => (
    <ol className="list-decimal pl-6 my-4 text-gray-700 space-y-1" {...props} />
  ),
  li: ({ node, ...props }) => <li className="my-1" {...props} />,
  hr: ({ node, ...props }) => (
    <hr className="my-8 border-gray-200" {...props} />
  ),
};

export default function GuidelinePage({ params }: PageProps) {
  // Read the markdown file
  const filePath = path.join(process.cwd(), 'data', `${params.slug}.md`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { content, data } = matter(fileContent);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <article
        className="prose prose-gray dark:prose-invert max-w-none 
        prose-headings:font-semibold 
        prose-h1:text-3xl prose-h1:mb-6
        prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
        prose-p:my-4 prose-p:leading-relaxed
        prose-ul:my-4 prose-ul:pl-6
        prose-ol:my-4 prose-ol:pl-6
        prose-li:my-1
        prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-a:no-underline hover:prose-a:underline
        prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:my-6
        prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
        prose-pre:bg-gray-900 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:border prose-pre:border-gray-800
        prose-th:px-4 prose-th:py-3 prose-th:bg-gray-50 prose-th:border-b prose-th:border-gray-200
        prose-td:px-4 prose-td:py-3 prose-td:border-b prose-td:border-gray-200
      "
      >
        {data.title && <h1 className="">{data.title}</h1>}
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {content}
        </ReactMarkdown>
      </article>
    </div>
  );
}

// Generate static paths at build time
export async function generateStaticParams() {
  const files = fs.readdirSync(path.join(process.cwd(), 'data'));
  return files
    .filter((file) => file.endsWith('.md'))
    .map((file) => ({
      slug: file.replace(/\.md$/, ''),
    }));
}
