'use client';
import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import CopyButton from '@/app/components/CopyButton';
import SearchBar from '@/app/components/SearchBar';

// Level badge style helper
const levelBadgeClass = (lv) => {
	const v = String(lv || '').toLowerCase();
	if (['beginner', 'basic', '入門', '初級'].some((k) => v.includes(k)))
		return 'bg-emerald-50 text-emerald-700 border-emerald-200';
	if (['intermediate', 'medium', '中級'].some((k) => v.includes(k)))
		return 'bg-amber-50 text-amber-800 border-amber-200';
	if (['advanced', 'pro', '上級'].some((k) => v.includes(k)))
		return 'bg-indigo-50 text-indigo-700 border-indigo-200';
	return 'bg-slate-50 text-slate-700 border-slate-200';
};

// Category grouping helpers
const CATEGORY_ORDER = [
	'基本操作',
	'Image',
	'Container',
	'Network',
	'Volume',
	'Build',
	'クリーンアップ',
	'環境確認・情報取得',
	'認証・リポジトリ操作',
	'環境管理',
	'リソースモニタリング',
	'その他',
];
const normalizeCategory = (v) => String(v || '').trim();
const groupByCategory = (items) => {
	const allCats = Array.from(
		new Set(
			items
				.flatMap((it) => {
					const c = it.category;
					return Array.isArray(c) ? c : [c];
				})
				.map(normalizeCategory)
				.filter(Boolean)
		)
	);
	const orderedCats = [
		...CATEGORY_ORDER.filter((c) => allCats.includes(c)),
		...allCats.filter((c) => !CATEGORY_ORDER.includes(c)).sort((a, b) => a.localeCompare(b, 'ja')),
	];
	const groups = orderedCats.map((cat) => {
		const itemsInCat = items
			.filter((it) => {
				const c = it.category;
				return Array.isArray(c)
					? c.map(normalizeCategory).includes(cat)
					: normalizeCategory(c) === cat;
			})
			.sort((a, b) => {
				if (a.no == null && b.no == null) return 0;
				if (a.no == null) return 1;
				if (b.no == null) return -1;
				return a.no - b.no;
			});
		return { key: cat, items: itemsInCat };
	});
	const unclassified = items.filter((it) => {
		const c = it.category;
		if (Array.isArray(c)) return c.map(normalizeCategory).filter(Boolean).length === 0;
		return !normalizeCategory(c);
	});
	if (unclassified.length > 0) {
		unclassified.sort((a, b) => {
			if (a.no == null && b.no == null) return 0;
			if (a.no == null) return 1;
			if (b.no == null) return -1;
			return a.no - b.no;
		});
		groups.push({ key: '未分類', items: unclassified });
	}
	return groups;
};

export default function DockerReferencClient({
	dockerCommands,
	dockerComposeCommands,
	dockerStarterKits,
	dockerSwarmCommands,
}) {
	const [q, setQ] = useState('');
	const match = (s) => (s ? s.toString().toLowerCase().includes(q.toLowerCase()) : false);
	const filterByQ = (arr) =>
		!q ? arr : arr.filter((it) => match(it.title) || match(it.description));

	const filteredDocker = useMemo(() => filterByQ(dockerCommands), [dockerCommands, q]);
	const filteredCompose = useMemo(
		() => filterByQ(dockerComposeCommands),
		[dockerComposeCommands, q]
	);
	const filteredStarter = useMemo(() => filterByQ(dockerStarterKits), [dockerStarterKits, q]);
	const filteredSwarm = useMemo(() => filterByQ(dockerSwarmCommands), [dockerSwarmCommands, q]);
	const groupedByCategory = useMemo(() => groupByCategory(filteredDocker), [filteredDocker]);
	const groupedComposeByCategory = useMemo(
		() => groupByCategory(filteredCompose),
		[filteredCompose]
	);
	const groupedSwarmByCategory = useMemo(() => groupByCategory(filteredSwarm), [filteredSwarm]);
	console.log('groupedComposeByCategory =>', groupedComposeByCategory);
	return (
		<main id="page-top" className="flex-1 bg-slate-50">
			<div className="mx-auto max-w-6xl px-6 py-8">
				<header className="mb-8">
					<h1 className="text-2xl font-bold tracking-tight text-slate-800">Docker リファレンス</h1>
					<p className="mt-1 text-sm text-slate-600">
						よく使うコマンドとスターターキットを、シンプルなカードで素早く参照できます。
					</p>
				</header>

				{/* Global quick-nav */}
				<nav className="mb-6">
					<ul className="flex flex-wrap gap-2">
						<li>
							<a
								href="#docker-commands"
								className="px-3 py-1 text-xs rounded-full border bg-white text-slate-700 hover:bg-slate-50"
							>
								Docker コマンド
							</a>
						</li>
						<li>
							<a
								href="#docker-compose-commands"
								className="px-3 py-1 text-xs rounded-full border bg-white text-slate-700 hover:bg-slate-50"
							>
								Docker Compose コマンド
							</a>
						</li>
						<li>
							<a
								href="#docker-swarm-commands"
								className="px-3 py-1 text-xs rounded-full border bg-white text-slate-700 hover:bg-slate-50"
							>
								Docker Swarm コマンド
							</a>
						</li>
						<li>
							<a
								href="#docker-compose-starterkits"
								className="px-3 py-1 text-xs rounded-full border bg-white text-slate-700 hover:bg-slate-50"
							>
								Docker Compose スターターキット
							</a>
						</li>
					</ul>
				</nav>

				{/* Search (client only) */}
				<SearchBar className="mb-6" onQueryChange={setQ} />

				{/* Dockerコマンド（Category別表示） */}
				<section className="mb-10" id="docker-commands">
					<div className="mb-4">
						<h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700">
							Docker コマンド
						</h2>
						<div className="mt-2 h-px w-full bg-gradient-to-r from-slate-200 via-slate-200/60 to-transparent"></div>
					</div>

					{/* Category quick-nav */}
					<nav className="sticky top-14 z-10 -mx-2 mb-6 overflow-x-auto pb-2">
						<ul className="flex flex-wrap gap-2 px-2">
							{groupedByCategory.map(({ key, items }) => (
								<li key={key}>
									<a
										href={`#cat-${key}`}
										className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-0.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
									>
										{key}
										<span className="ml-1 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px]">
											{items.length}
										</span>
									</a>
								</li>
							))}
						</ul>
					</nav>

					{groupedByCategory.length === 0 ? (
						<p className="text-sm text-slate-600">
							該当するコマンドがありません。キーワードを変えて再検索してください。
						</p>
					) : (
						<div className="space-y-10">
							{groupedByCategory.map(({ key, items }) => (
								<section key={key} id={`cat-${key}`} className="scroll-mt-20">
									<div className="mb-3 flex items-center justify-between">
										<h3 className="text-base font-semibold text-slate-800">{key}</h3>
										<span className="text-xs text-slate-500">{items.length} items</span>
									</div>
									<div className="grid md:grid-cols-2 gap-4">
										{items.map((cmd, i) => (
											<div
												key={`${key}-${i}`}
												className="group rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300"
											>
												{Array.isArray(cmd.level) && cmd.level.length > 0 && (
													<div className="mb-2 flex flex-wrap gap-1">
														{cmd.level.map((lv, index) => (
															<span
																key={index}
																className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${levelBadgeClass(
																	lv
																)}`}
															>
																{lv}
															</span>
														))}
													</div>
												)}
												<div className="mb-1 flex items-center gap-2">
													{cmd.no != null && (
														<span className="inline-flex min-w-6 justify-center rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700">
															No.{cmd.no}
														</span>
													)}
													<h4 className="font-bold text-md">{cmd.title}</h4>
												</div>
												<p className="mt-1 text-sm text-slate-600">{cmd.description}</p>
												<pre className="relative mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 overflow-auto">
													<CopyButton text={cmd.command} />
													{cmd.command}
												</pre>
												{cmd.detail && (
													<Link href={`/references/docker/commands/${cmd.path}`}>
														<div className="mt-3 inline-flex items-center text-sm text-slate-700 hover:text-slate-900">
															<span className="underline underline-offset-2">View Details</span>
															<svg
																className="ml-1 h-4 w-4"
																viewBox="0 0 20 20"
																fill="currentColor"
																aria-hidden="true"
															>
																<path
																	fillRule="evenodd"
																	d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L13.586 10H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z"
																	clipRule="evenodd"
																/>
															</svg>
														</div>
													</Link>
												)}
											</div>
										))}
									</div>
								</section>
							))}
						</div>
					)}
				</section>

				{/* DockerComposeコマンド */}
				<section className="mb-10" id="docker-compose-commands">
					<div className="mb-4">
						<h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700">
							Docker Composeコマンド
						</h2>
						<div className="mt-2 h-px w-full bg-gradient-to-r from-slate-200 via-slate-200/60 to-transparent"></div>
					</div>

					{/* Category quick-nav */}
					<nav className="sticky top-14 z-10 -mx-2 mb-6 overflow-x-auto pb-2">
						<ul className="flex flex-wrap gap-2 px-2">
							{groupedComposeByCategory.map(({ key, items }) => (
								<li key={key}>
									<a
										href={`#cat-compose-${key}`}
										className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-0.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
									>
										{key}
										<span className="ml-1 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px]">
											{items.length}
										</span>
									</a>
								</li>
							))}
						</ul>
					</nav>

					{groupedComposeByCategory.length === 0 ? (
						<p className="text-sm text-slate-600">該当するコマンドがありません。</p>
					) : (
						<div className="space-y-10">
							{groupedComposeByCategory.map(({ key, items }) => (
								<section key={key} id={`cat-compose-${key}`} className="scroll-mt-20">
									<div className="mb-3 flex items-center justify-between">
										<h3 className="text-base font-semibold text-slate-800">{key}</h3>
										<span className="text-xs text-slate-500">{items.length} items</span>
									</div>
									<div className="grid md:grid-cols-2 gap-4">
										{items.map((cmd, i) => (
											<div
												key={`${key}-${i}`}
												className="group rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300"
											>
												{Array.isArray(cmd.level) && cmd.level.length > 0 && (
													<div className="mb-2 flex flex-wrap gap-1">
														{cmd.level.map((lv, index) => (
															<span
																key={index}
																className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${levelBadgeClass(
																	lv
																)}`}
															>
																{lv}
															</span>
														))}
													</div>
												)}
												<div className="mb-1 flex items-center gap-2">
													{cmd.no != null && (
														<span className="inline-flex min-w-6 justify-center rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700">
															No.{cmd.no}
														</span>
													)}
													<h4 className="font-bold text-md">{cmd.title}</h4>
												</div>
												<p className="mt-1 text-sm text-slate-600">{cmd.description}</p>
												<pre className="relative mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 overflow-auto">
													<CopyButton text={cmd.command} />
													{cmd.command}
												</pre>
												{cmd.detail && (
													<Link href={`/references/docker/commands/${cmd.path}`}>
														<div className="mt-3 inline-flex items-center text-sm text-slate-700 hover:text-slate-900">
															<span className="underline underline-offset-2">View Details</span>
															<svg
																className="ml-1 h-4 w-4"
																viewBox="0 0 20 20"
																fill="currentColor"
																aria-hidden="true"
															>
																<path
																	fillRule="evenodd"
																	d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L13.586 10H4a 1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z"
																	clipRule="evenodd"
																/>
															</svg>
														</div>
													</Link>
												)}
											</div>
										))}
									</div>
								</section>
							))}
						</div>
					)}
				</section>

				{/* Docker Swarmコマンド */}
				<section className="mb-10" id="docker-swarm-commands">
					<div className="mb-4">
						<h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700">
							Docker Swarmコマンド
						</h2>
						<div className="mt-2 h-px w-full bg-gradient-to-r from-slate-200 via-slate-200/60 to-transparent"></div>
					</div>

					{/* Category quick-nav */}
					<nav className="sticky top-14 z-10 -mx-2 mb-6 overflow-x-auto pb-2">
						<ul className="flex flex-wrap gap-2 px-2">
							{groupedSwarmByCategory.map(({ key, items }) => (
								<li key={key}>
									<a
										href={`#cat-swarm-${key}`}
										className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-0.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
									>
										{key}
										<span className="ml-1 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px]">
											{items.length}
										</span>
									</a>
								</li>
							))}
						</ul>
					</nav>

					{groupedSwarmByCategory.length === 0 ? (
						<p className="text-sm text-slate-600">該当するコマンドがありません。</p>
					) : (
						<div className="space-y-10">
							{groupedSwarmByCategory.map(({ key, items }) => (
								<section key={key} id={`cat-swarm-${key}`} className="scroll-mt-20">
									<div className="mb-3 flex items-center justify-between">
										<h3 className="text-base font-semibold text-slate-800">{key}</h3>
										<span className="text-xs text-slate-500">{items.length} items</span>
									</div>
									<div className="grid md:grid-cols-2 gap-4">
										{items.map((cmd, i) => (
											<div
												key={`${key}-${i}`}
												className="group rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300"
											>
												{Array.isArray(cmd.level) && cmd.level.length > 0 && (
													<div className="mb-2 flex flex-wrap gap-1">
														{cmd.level.map((lv, index) => (
															<span
																key={index}
																className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${levelBadgeClass(
																	lv
																)}`}
															>
																{lv}
															</span>
														))}
													</div>
												)}
												<div className="mb-1 flex items-center gap-2">
													{cmd.no != null && (
														<span className="inline-flex min-w-6 justify-center rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700">
															No.{cmd.no}
														</span>
													)}
													<h4 className="font-bold text-md">{cmd.title}</h4>
												</div>
												<p className="mt-1 text-sm text-slate-600">{cmd.description}</p>
												<pre className="relative mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 overflow-auto">
													<CopyButton text={cmd.command} />
													{cmd.command}
												</pre>
												{cmd.detail && (
													<Link href={`/references/docker/commands/${cmd.path}`}>
														<div className="mt-3 inline-flex items-center text-sm text-slate-700 hover:text-slate-900">
															<span className="underline underline-offset-2">View Details</span>
															<svg
																className="ml-1 h-4 w-4"
																viewBox="0 0 20 20"
																fill="currentColor"
																aria-hidden="true"
															>
																<path
																	fillRule="evenodd"
																	d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L13.586 10H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z"
																	clipRule="evenodd"
																/>
															</svg>
														</div>
													</Link>
												)}
											</div>
										))}
									</div>
								</section>
							))}
						</div>
					)}
				</section>

				{/* DockerComposeスターターキット */}
				<section className="mb-10" id="docker-compose-starterkits">
					<div className="mb-4">
						<h2 className="text-sm font-semibold uppercase tracking-wider text-slate-700">
							Docker Compose スターターキット
						</h2>
						<div className="mt-2 h-px w-full bg-gradient-to-r from-slate-200 via-slate-200/60 to-transparent"></div>
					</div>
					{filteredStarter.length === 0 ? (
						<p className="text-sm text-slate-600">該当するスターターキットがありません。</p>
					) : (
						<div className="grid md:grid-cols-2 gap-4">
							{filteredStarter.map((kit, i) => (
								<div
									key={i}
									className="group rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300"
								>
									<h3 className="font-bold text-md">{kit.title}</h3>
									<p className="mt-1 text-sm text-slate-600">{kit.description}</p>
									<Link href={`/references/docker/starterkits/${kit.path}`}>
										<div className="mt-3 inline-flex items-center text-sm text-slate-700 hover:text-slate-900">
											<span className="underline underline-offset-2">View Details</span>
											<svg
												className="ml-1 h-4 w-4"
												viewBox="0 0 20 20"
												fill="currentColor"
												aria-hidden="true"
											>
												<path
													fillRule="evenodd"
													d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L13.586 10H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z"
													clipRule="evenodd"
												/>
											</svg>
										</div>
									</Link>
								</div>
							))}
						</div>
					)}
				</section>
			</div>

			{/* Back to top button */}
			<a
				href="#page-top"
				aria-label="Back to top"
				className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/90 px-3 py-2 text-xs font-medium text-slate-700 shadow-md backdrop-blur hover:bg-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					className="h-4 w-4"
				>
					<path
						fillRule="evenodd"
						d="M3.22 12.47a.75.75 0 001.06 0L10 6.75l5.72 5.72a.75.75 0 101.06-1.06l-6.25-6.25a.75.75 0 00-1.06 0L3.22 11.41a.75.75 0 000 1.06z"
						clipRule="evenodd"
					/>
				</svg>
				Top
			</a>
		</main>
	);
}
