'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

import CopyButton from './CopyButton';

const schema = {
	...defaultSchema,
	attributes: {
		...defaultSchema.attributes,
		'*': [...(defaultSchema.attributes?.['*'] || []), 'class', 'className'],
		code: [...(defaultSchema.attributes?.code || []), 'class', 'className'],
		pre: [...(defaultSchema.attributes?.pre || []), 'class', 'className'],
		table: [...(defaultSchema.attributes?.table || []), 'class', 'className'],
	},
};

const MarkdownRenderer = ({ markdown }) => {
	return (
		<div className="prose max-w-none mt-4">
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				rehypePlugins={[rehypeRaw, [rehypeSanitize, schema]]}
				components={{
					h2: ({ node, ...props }) => <h2 className="scroll-mt-24 text-2xl font-bold" {...props} />,
					h3: ({ node, ...props }) => <h3 className="scroll-mt-24 text-xl font-bold" {...props} />,
					a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" {...props} />,
					p: ({ node, ...props }) => <p className="mb-4 leading-relaxed text-sm" {...props} />,
					ul: ({ node, ...props }) => <ul className="list-disc ml-6 mb-4" {...props} />,
					ol: ({ node, ...props }) => <ol className="list-decimal ml-6 mb-4" {...props} />,
					li: ({ node, ...props }) => <li className="mb-1" {...props} />,
					table: ({ node, ...props }) => (
						<div className="my-4 overflow-x-auto">
							<table
								className="border border-gray-300 w-full border-collapse bg-white"
								{...props}
							/>
						</div>
					),
					thead: ({ node, ...props }) => (
						<thead className="bg-gray-200 border-b border-gray-300 text-xs" {...props} />
					),
					tbody: ({ node, ...props }) => (
						<tbody className="divide-y divide-gray-100 text-xs" {...props} />
					),
					tr: ({ node, ...props }) => <tr className="hover:bg-gray-50" {...props} />,
					th: ({ node, ...props }) => (
						<th className="px-4 py-2 text-left font-semibold border border-gray-300" {...props} />
					),
					td: ({ node, ...props }) => (
						<td className="px-4 py-2 border border-gray-300" {...props} />
					),
					caption: ({ node, ...props }) => (
						<caption className="text-left text-xs text-gray-500 mt-2" {...props} />
					),
					code({ node, inline, className, children, ...props }) {
						const text = String(children ?? '');
						if (!inline) {
							return (
								<div className="relative mt-2 mb-2">
									<pre
										className={`relative bg-gray-200 pr-10 pl-2 pt-4 pb-4 mt-2 rounded text-xs overflow-auto ${
											className || ''
										}`}
									>
										<code className={`block ${className || ''}`} {...props}>
											{text}
										</code>
										<CopyButton text={text} />
									</pre>
								</div>
							);
						}
						// インラインコードの場合
						return (
							<code className={`px-1 py-0.5 rounded bg-gray-200 ${className || ''}`} {...props}>
								{text}
							</code>
						);
					},
				}}
			>
				{markdown || ''}
			</ReactMarkdown>
		</div>
	);
};

export default MarkdownRenderer;
