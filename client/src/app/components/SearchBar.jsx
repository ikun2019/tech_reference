'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

export default function SearchBar({
	placeholder = '検索（タイトル/説明）',
	className = '',
	onQueryChange,
	debounceMs = 300,
}) {
	const router = useRouter();
	const pathname = usePathname();
	const sp = useSearchParams();
	const initial = sp.get('q') ?? '';
	const [value, setValue] = useState(initial);
	const [isComposing, setIsComposing] = useState(false);
	const isFirst = useRef(true);

	// URLが外部要因で変わったら同期
	useEffect(() => {
		setValue(initial);
		isFirst.current = false;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initial]);

	// 入力のたびにデバウンスして反映
	useEffect(() => {
		if (isComposing) return;
		if (isFirst.current) return;
		const handle = setTimeout(() => {
			const v = value.trim();
			if (typeof onQueryChange === 'function') {
				onQueryChange(v);
				return;
			}
			const params = new URLSearchParams(sp?.toString());
			if (v) params.set('q', v);
			else params.delete('q');
			router.replace(`${pathname}?${params.toString()}`);
		}, debounceMs);
		return () => clearTimeout(handle);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, isComposing, debounceMs]);

	const onSubmit = (e) => {
		e.preventDefault();
		const v = value.trim();
		if (typeof onQueryChange === 'function') {
			onQueryChange(v);
			return;
		}
		const params = new URLSearchParams(sp?.toString());
		if (v) params.set('q', v);
		else params.delete('q');
		router.push(`${pathname}?${params.toString()}`);
	};

	const onClear = () => {
		setValue('');
		if (typeof onQueryChange === 'function') {
			onQueryChange('');
			return;
		}
		const params = new URLSearchParams(sp?.toString());
		params.delete('q');
		router.push(`${pathname}?${params.toString()}`);
	};

	return (
		<form
			onSubmit={onSubmit}
			className={`relative ${className}`}
			role="search"
			aria-label="サイト内検索"
		>
			<input
				type="text"
				inputMode="search"
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onCompositionStart={() => setIsComposing(true)}
				onCompositionEnd={() => setIsComposing(false)}
				placeholder={placeholder}
				className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
			/>
			{value && (
				<button
					type="button"
					onClick={onClear}
					className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
					aria-label="クリア"
				>
					クリア
				</button>
			)}
			{!onQueryChange && (
				<button
					type="submit"
					className="absolute inset-y-0 right-12 my-1 rounded-md px-3 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700"
					aria-label="検索"
				>
					検索
				</button>
			)}
		</form>
	);
}
