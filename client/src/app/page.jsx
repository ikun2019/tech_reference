import React from 'react';
import Link from 'next/link';

import CouponCode from './components/CouponCode';
import CategoryCard from './components/CategoryCard';
import Header from './components/Header';

import { createSupabaseServerClient } from '@/lib/supabaseServerClient';
import { fetchUnlockCategories } from '@/lib/api/couponAPI';

const ALL_CATEGORIES = [
	{
		key: 'docker',
		title: 'Docker',
		desc: 'コンテナ基礎〜実装（Compose/Swarm）',
		href: '/references/docker',
	},
	{
		key: 'Express',
		title: 'Express',
		desc: 'ExpressでAPI/SSR実装入門',
		href: '/references/express',
	},
	{
		key: 'gRPC',
		title: 'gRPC',
		desc: 'Proto/Server/Client/ストリーミング',
		href: '/references/grpc',
	},
	{
		key: 'NextJS',
		title: 'Next.js',
		desc: 'App Router/SSR/ISR/RSC',
		href: '/references/nextjs',
	},
];

const HomePage = async () => {
	const supabase = await createSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	let unlocked = [];
	if (user) {
		const { data: sessionData } = await supabase.auth.getSession();
		const accessToken = sessionData?.session?.access_token;
		if (accessToken) {
			unlocked = await fetchUnlockCategories(accessToken);
		}
	}

	return (
		<main className="min-h-screen bg-gray-50">
			<Header user={user} />
			<div className="mx-auto max-w-6xl px-6 py-8 space-y-8">
				<div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
					<h1 className="text-xl font-bold">ようこそ 👋</h1>
					<p className="mt-1 text-sm text-blue-900/80">
						クーポンを適用して学習カテゴリを解放しましょう。ログインすると進捗と解放状態が保存されます。
					</p>
				</div>

				<CouponCode />

				<section>
					<div className="mb-3 flex items-center justify-between">
						<h2 className="text-lg font-semibold">学習カテゴリ</h2>
						<Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
							ダッシュボード
						</Link>
					</div>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{ALL_CATEGORIES.map((category) => (
							<CategoryCard
								key={category.key}
								title={category.title}
								description={category.desc}
								href={category.href}
								unlocked={unlocked.includes(category.key)}
							/>
						))}
					</div>
					<p className="mt-3 text-xs text-gray-500">
						※ ログイン済みのアカウントに解放状況が保存されます。
					</p>
				</section>
			</div>
		</main>
	);
};

export default HomePage;
