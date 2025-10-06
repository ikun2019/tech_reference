import React from 'react';
import { notFound } from 'next/navigation';

import MarkdownRenderer from '@/app/components/MarkdownRenderer';

import { fetchAllCommands, fetchServerDockerCommandDetail } from '@/lib/api/commandsAPI';

// Level badge style helper (detail page)
const levelBadgeClass = (lv) => {
	const v = String(lv || '').toLowerCase();
	if (['beginner', 'basic', '入門', '初級'].some((k) => v.includes(k))) {
		return 'bg-emerald-50 text-emerald-700 border-emerald-200';
	}
	if (['intermediate', 'medium', '中級'].some((k) => v.includes(k))) {
		return 'bg-amber-50 text-amber-800 border-amber-200';
	}
	if (['advanced', 'pro', '上級'].some((k) => v.includes(k))) {
		return 'bg-indigo-50 text-indigo-200 border-indigo-200';
	}
	return 'bg-slate-50 text-slate-700 border-slate-200';
};

const page = async ({ params }) => {
	const { path } = await params;
	const dockerCommands = await fetchAllCommands();
	const command = dockerCommands.find((cmd) => cmd.path === path);
	if (!command) notFound();
	const commandDetail = await fetchServerDockerCommandDetail(path);

	return (
		<main className="p-8">
			<h1 className="text-2xl font-bold">{command.title}</h1>
			{Array.isArray(command.level) && command.level.length > 0 && (
				<div className="mt-2 mb-4 flex flex-wrap gap-1">
					{command.level.map((lv, idx) => (
						<span
							key={idx}
							className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${levelBadgeClass(
								lv
							)}`}
						>
							{lv}
						</span>
					))}
				</div>
			)}
			<MarkdownRenderer markdown={commandDetail.markdown} />
		</main>
	);
};

export default page;
