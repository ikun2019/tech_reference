'use client';

import React, { useState } from 'react';

const CopyButton = ({ text, className = '' }) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 1200);
		} catch (error) {
			console.error('Copy failed:', error);
		}
	};

	return (
		<button
			onClick={handleCopy}
			className={`absolute top-2 right-2 text-xs bg-gray-300 px-2 py-1 rounded shadow ${className}`}
			aria-label="Copy command"
		>
			{copied ? 'Copied' : 'Copy'}
		</button>
	);
};

export default CopyButton;
