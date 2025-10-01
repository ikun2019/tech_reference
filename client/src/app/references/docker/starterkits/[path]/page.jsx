import React from 'react';
import { notFound } from 'next/navigation';

import MarkdownRenderer from '@/app/components/MarkdownRenderer';

import {
	fetchServerDockerStarterKits,
	fetchServerDockerStarterKitDetail,
} from '@/lib/api/starterkitsAPI';

const page = async ({ params }) => {
	const { path } = await params;
	const dockerStarterKits = await fetchServerDockerStarterKits();
	const starterKits = dockerStarterKits.find((cmd) => cmd.path === path);
	if (!starterKits) notFound();
	const starterKitDetail = await fetchServerDockerStarterKitDetail(path);

	return (
		<main className="p-8">
			<h1 className="text-2xl font-bold">{starterKits.title}</h1>
			<MarkdownRenderer markdown={starterKitDetail.markdown} />
		</main>
	);
};

export default page;
