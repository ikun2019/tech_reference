'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { FaDocker, FaServer, FaLock, FaNetworkWired, FaCodeBranch } from 'react-icons/fa';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

const navItems = [
	{ name: 'Docker', icon: <FaDocker />, path: '/docker' },
	{ name: 'Express', icon: <FaServer />, path: '/express' },
	{ name: 'OpenSSL', icon: <FaLock />, path: '/openssl' },
	{ name: 'Redis', icon: <FaNetworkWired />, path: '/redis' },
	{ name: 'GraphQL', icon: <FaCodeBranch />, path: '/graphql' },
	{ name: 'gRPC', icon: '🔗', path: '/grpc' },
	{ name: 'Kafka', icon: '🧪', path: '/kafka' },
];

const Sidebar = ({ defaultCollapsed = true }) => {
	const pathname = usePathname();
	const [collapsed, setCollapsed] = useState(defaultCollapsed);

	return (
		<aside
			className={[
				'relative z-30 h-screen shrink-0 border-r border-slate-200 bg-white/80 backdrop-blur',
				collapsed ? 'w-16' : 'w-64',
				'transition-[width] duration-200 ease-out',
				'sticky top-0', // keep it fixed on scroll within layout
			].join(' ')}
			aria-label="技術別リファレンス サイドバー"
		>
			{/* Header / Toggle */}
			<div className="relative flex items-center px-3 py-3">
				<div className={collapsed ? 'w-48' : 'w-auto'}>
					<h2
						className={[
							'text-sm font-semibold tracking-wide text-slate-700',
							collapsed ? 'opacity-0 pointer-events-none select-none' : 'opacity-100',
							'transition-opacity duration-150',
						].join(' ')}
						aria-hidden={collapsed}
					>
						技術別リファレンス
					</h2>
				</div>

				<button
					type="button"
					onClick={() => setCollapsed((v) => !v)}
					className="absolute right-3 inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-2 py-1 text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
					aria-label={collapsed ? 'サイドバーを展開' : 'サイドバーを折りたたむ'}
					title={collapsed ? '展開' : '折りたたみ'}
				>
					{collapsed ? (
						<HiOutlineChevronRight className="h-4 w-4" />
					) : (
						<HiOutlineChevronLeft className="h-4 w-4" />
					)}
				</button>
			</div>

			{/* Navigation */}
			<nav className="px-2">
				<ul className="space-y-1">
					{navItems.map((item) => {
						const active = pathname === `/references${item.path}`;
						return (
							<li key={item.name}>
								<Link href={`/references${item.path}`} className="block">
									<div
										className={[
											'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm',
											active
												? 'bg-slate-100 font-semibold text-slate-900'
												: 'text-slate-700 hover:bg-slate-50 hover:text-slate-900',
											'transition-colors',
										].join(' ')}
									>
										<span className="text-base">{item.icon}</span>
										<span
											className={[
												'whitespace-nowrap',
												collapsed ? 'opacity-0 pointer-events-none select-none w-0' : 'opacity-100',
												'transition-opacity duration-150',
											].join(' ')}
											aria-hidden={collapsed}
										>
											{item.name}
										</span>
									</div>
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>

			{/* Footer helper (optional quick tip) */}
			<div
				className={[
					'absolute bottom-3 left-0 right-0 px-3',
					collapsed ? 'opacity-0 pointer-events-none select-none' : 'opacity-100',
					'transition-opacity duration-150',
				].join(' ')}
				aria-hidden={collapsed}
			>
				<div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
					💡 カテゴリを切り替えて、必要なスタックのリファレンスへ素早くアクセスできます。
				</div>
			</div>
		</aside>
	);
};

export default Sidebar;
