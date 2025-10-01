'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

import CopyButton from './CopyButton';

const ParagraphContext = React.createContext(false);

function normalizeNotionFences(src) {
	if (!src) return src;
	const lines = String(src).split(/\r?\n/);
	let out = [];
	let i = 0;

	// Helper to find previous non-empty emitted line
	const lastNonEmptyOutLine = () => {
		for (let j = out.length - 1; j >= 0; j--) {
			if (out[j] && out[j].trim() !== '') return out[j];
		}
		return '';
	};

	let pendingPostFenceFix = false; // collapse too-deep indent after a fenced block inside a list
	let afterListFenceIndentTail = 0; // number of following paragraph lines to indent inside same li (0 = off)

	const isTopLevelListStart = (s) => /^[ \t]*([*+-]|\d+\.)[ \t]+/.test(s);
	const isHeadingStart = (s) => /^[ \t]*#{1,6}[ \t]/.test(s);

	while (i < lines.length) {
		// Stop tail indentation mode if we are at a new list item / heading / fence opener
		if (afterListFenceIndentTail > 0) {
			const peek = lines[i];
			if (isTopLevelListStart(peek) || isHeadingStart(peek) || /^[ \t]*(```+|~~~)/.test(peek)) {
				afterListFenceIndentTail = 0;
			}
		}

		const openMatch = lines[i].match(/^[ \t]*(```+|~~~)([^\n]*)$/);
		if (!openMatch) {
			let line = lines[i];

			// If we just closed a fence located inside a list item, collapse too-deep indentation
			if (pendingPostFenceFix) {
				if (line.trim() === '') {
					out.push(line);
					i++;
					continue;
				}
				if (/^(?:\t+| {4,})/.test(line)) {
					line = line.replace(/^[ \t]+/, '  ');
				} else {
					pendingPostFenceFix = false;
				}
			}

			// If we are right after a list-fenced block, indent a couple of following paragraph lines
			if (afterListFenceIndentTail > 0) {
				if (line.trim() !== '') {
					// don't double-indented lines; only indent if not already at least 2 spaces
					if (!/^ {2,}|\t/.test(line)) line = '  ' + line;
					afterListFenceIndentTail--;
				}
			}

			out.push(line);
			i++;
			continue;
		}

		// We are at a fence opener. Detect if it's inside a list item by inspecting the previous non-empty emitted line
		const fence = openMatch[1];
		const info = (openMatch[2] || '').trim();
		const prev = lastNonEmptyOutLine();
		const openerWasInList = /(^|\n)[ \t]*([*+-]|\d+\.)[ \t]+/.test(prev);

		// Start a fenced block. If it belongs to a list item, indent the fence so it nests inside that <li>.
		const fenceOpenLine = `${fence}${info ? ' ' + info : ''}`.trim();
		if (openerWasInList) {
			out.push('    ' + fenceOpenLine);
		} else {
			out.push(fenceOpenLine);
		}
		i++;

		// collect block lines until closing fence
		const blockLines = [];
		while (i < lines.length && !lines[i].match(new RegExp(`^[ \t]*${fence}$`))) {
			blockLines.push(lines[i]);
			i++;
		}

		// dedent inside the fence to the smallest common indent for nicer display
		const nonEmpty = blockLines.filter((l) => l.trim().length > 0);
		let commonIndent = Infinity;
		for (const l of nonEmpty) {
			const m = l.match(/^[ \t]*/)[0];
			commonIndent = Math.min(commonIndent, m.length);
		}
		if (!isFinite(commonIndent)) commonIndent = 0;
		const dedented = blockLines.map((l) => l.slice(commonIndent));

		// Emit the block lines, indenting if it's under a list item
		if (openerWasInList) {
			for (const l of dedented) out.push('    ' + l);
		} else {
			out.push(...dedented);
		}

		// consume closing fence if present and mirror opener indentation
		if (i < lines.length) {
			out.push(openerWasInList ? '    ' + fence : fence);
			i++; // skip original closing line

			if (openerWasInList) {
				// enable fixes: collapse too-deep indent and keep the next 2 non-empty paragraphs inside the same li
				pendingPostFenceFix = true;
				afterListFenceIndentTail = 2; // number of following non-empty paragraph lines to indent into the same li
			}
		}
	}
	return out.join('\n');
}

const MarkdownRenderer = ({ markdown }) => {
	const fixedMarkdown = React.useMemo(() => normalizeNotionFences(markdown), [markdown]);

	return (
		<div className="prose max-w-none mt-4 min-w-0 leading-relaxed">
			<ReactMarkdown
				rehypePlugins={[rehypeRaw]}
				remarkPlugins={[remarkGfm]}
				components={{
					h2: (props) => {
						return <h2 className="scroll-mt-24 text-2xl font-bold" {...props} />;
					},
					// h2: ({ node, ...props }) => <h2 className="scroll-mt-24 text-2xl font-bold" {...props} />,
					h3: (props) => <h3 className="scroll-mt-24 text-xl font-bold" {...props} />,
					a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" {...props} />,
					p: ({ node, children, ...props }) => {
						const first = node?.children?.[0];
						if (
							first &&
							first.type === 'element' &&
							first.tagName === 'img' &&
							node.children.length === 1
						) {
							const image = first;
							return (
								<div className="relative w-full mb-4">
									<img src={image.properties.src} alt={image.properties.alt} />
								</div>
							);
						}
						const hasBlockInsideAst = (node.children || []).some(
							(c) =>
								c?.type === 'element' &&
								(c.tagName === 'pre' ||
									c.tagName === 'div' ||
									c.tagName === 'figure' ||
									c.tagName === 'table')
						);
						const hasBlockInsideReact = React.Children.toArray(children).some((child) => {
							if (!React.isValidElement(child)) return false;
							const t = child.type;
							if (typeof t === 'string') {
								return t === 'pre' || t === 'div' || t === 'figure' || t === 'table';
							}
							return false;
						});
						if (hasBlockInsideAst || hasBlockInsideReact) {
							return <>{children}</>;
						}
						return (
							<ParagraphContext.Provider value={true}>
								<p className="mb-2 leading-relaxed text-sm whitespace-pre-wrap" {...props}>
									{children}
								</p>
							</ParagraphContext.Provider>
						);
					},
					ul: (props) => {
						// console.log('props =>', props);
						return <ul className="list-disc ml-6 mb-4 text-sm">{props.children}</ul>;
					},
					ol: (props) => (
						<ol className="list-decimal ml-6 mb-4 text-sm leading-relaxed">{props.children}</ol>
					),
					li: (props) => {
						return (
							<li className="mb-2 space-y-2 text-sm min-w-0 leading-relaxed">{props.children}</li>
						);
					},
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
						// Heuristic: sometimes inline code inside list items is misclassified as block.
						// If there's no language class, no newline, and it's short, force inline rendering.
						const hasLanguageClass =
							(typeof className === 'string' && /\blanguage-/.test(className)) ||
							(Array.isArray(className) && className.some((c) => /\blanguage-/.test(String(c))));
						const looksInlineSnippet =
							!hasLanguageClass &&
							!/\r?\n/.test(text) &&
							text.trim().length > 0 &&
							text.length < 200;
						const insideParagraph = React.useContext(ParagraphContext);
						let caption = null;

						// 1) meta / metastring
						const meta = node?.data?.meta || node?.data?.hProperties?.metastring || '';
						if (meta) {
							const m = /caption="([^"]+)"/.exec(String(meta));
							if (m) caption = m[1];
						}

						// 親が <li> かどうか判定
						const insideListItem = node?.position?.parent?.type === 'listItem';

						// 2) / 3) className patterns
						if (!caption) {
							const cls = node?.properties?.className || node?.properties?.class || className || [];
							const clsArr = Array.isArray(cls) ? cls : String(cls).split(/\s+/);
							// Look for entries like language-caption="Terminal" OR just caption="Terminal"
							for (const token of clsArr) {
								const withoutLang = String(token).replace(/^language-/, '');
								const m2 = /caption="([^"]+)"/.exec(withoutLang);
								if (m2) {
									caption = m2[1];
									break;
								}
							}
						}
						if (inline || looksInlineSnippet) {
							return (
								<code
									className={`px-1 py-0.5 rounded bg-gray-200 inline text-red-500 ${
										className || ''
									}`}
									{...props}
								>
									{text}
								</code>
							);
						}
						if (!inline) {
							if (insideParagraph) {
								// Force inline rendering if ReactMarkdown tried to place a block code inside a <p>
								return (
									<code className={`px-1 py-0.5 rounded bg-gray-200 ${className || ''}`} {...props}>
										{text}
									</code>
								);
							}
							if (insideListItem) {
								return (
									<div className="relative min-w-0">
										{caption && (
											<div className="text-right text-xs text-gray-500 mb-1">{caption}</div>
										)}

										{/* Make only <pre> scrollable; add extra right padding to avoid overlap with the button */}
										<pre
											className={`bg-gray-200 rounded text-xs w-full max-w-full overflow-x-auto overflow-y-auto pl-2 pt-4 pb-4 pr-12 mt-2 ${
												className || ''
											}`}
										>
											<code className={`block ${className || ''}`} {...props}>
												{text}
											</code>
										</pre>

										{/* Button fixed to the wrapper, not inside the scrollable area */}
										<div className="absolute top-7 right-2 z-10">
											<CopyButton text={text} />
										</div>
									</div>
								);
							}
							return (
								<div className="min-w-0 -mt-3">
									{caption && <div className="text-right text-xs text-gray-500">{caption}</div>}
									<div className="relative">
										<pre
											className={`bg-gray-200 rounded text-xs w-full max-w-full overflow-x-auto overflow-y-auto pl-2 pt-4 pb-4 pr-12 mb-4 ${
												className || ''
											}`}
										>
											<code className={`block ${className || ''}`} {...props}>
												{text}
											</code>
										</pre>
										<div className="absolute top-1 right-2 z-10">
											<CopyButton text={text} />
										</div>
									</div>
								</div>
							);
						}
						// インラインコードの場合
						return (
							<code
								className={`px-1 py-0.5 rounded bg-gray-200 inline text-red-500 ${className || ''}`}
								{...props}
							>
								{text}
							</code>
						);
					},
				}}
			>
				{fixedMarkdown}
			</ReactMarkdown>
		</div>
	);
};

export default MarkdownRenderer;
