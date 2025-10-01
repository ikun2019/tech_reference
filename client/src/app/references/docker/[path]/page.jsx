import React from 'react';
import { notFound } from 'next/navigation';

import MarkdownRenderer from '@/app/components/MarkdownRenderer';

import { fetchServerDockerCommands, fetchServerDockerCommandDetail } from '@/lib/api/commands';

const page = async ({ params }) => {
	const { path } = await params;
	const dockerCommands = await fetchServerDockerCommands();
	const command = dockerCommands.find((cmd) => cmd.path === path);
	if (!command) notFound();
	const commandDetail = await fetchServerDockerCommandDetail(path);

	return (
		<main className="p-8">
			<h1 className="text-2xl font-bold">{command.title}</h1>
			<MarkdownRenderer markdown={commandDetail.markdown} />
		</main>
	);
};

export default page;
