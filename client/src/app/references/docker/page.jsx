import React from 'react';
import Link from 'next/link';

import CopyButton from '@/app/components/CopyButton';
import CouponCode from '@/app/components/CouponCode';

import { fetchServerDockerCommands } from '@/lib/api/commands';

const dockerComposeStarterKits = [
	{
		title: 'Wordpress',
		description: 'Wordpress実行環境の雛形です',
		path: 'docker-wordoress',
	},
	{
		title: 'Express',
		description: 'Express実行環境の雛形です',
		path: 'docker-express',
	},
];

const DockerPage = async () => {
	const dockerCommandsResponse = await fetchServerDockerCommands();

	return (
		<main className="flex-1 p-8 bg-gray-50">
			<h1 className="text-2xl font-bold mg-4">Welcome</h1>
			<CouponCode />

			{/* Dockerコマンド */}
			<section className="mb-4">
				<h2 className="text-xl font-semibold mb-4">Dockerコマンド</h2>
				<div className="grid md:grid-cols-2 gap-4">
					{dockerCommandsResponse.map((cmd, i) => (
						<div key={i} className="border border-gray-400 rounded-lg p-4 bg-white shadow">
							<h3 className="font-bold text-md">{cmd.title}</h3>
							<p className="text-sm text-gray-600">{cmd.description}</p>
							<pre className="relative bg-gray-100 pr-10 pl-2 pt-4 pb-4 mt-2 rounded text-xs overflow-auto">
								<CopyButton text={cmd.command} />
								{cmd.command}
							</pre>
							{cmd.detail && (
								<Link href={`/references/docker/${cmd.path}`}>
									<div className="text-blue-600 text-sm mt-2 hover:underline">→ View Details</div>
								</Link>
							)}
						</div>
					))}
				</div>
			</section>

			{/* DockerComposeスターターキット */}
			<section>
				<h2 className="text-xl font-semibold mb-4">DockerComposeスターターキット</h2>
				<div className="grid md:grid-cols-2 gap-4">
					{dockerComposeStarterKits.map((kit, i) => (
						<div key={i} className="border border-gray-400 rounded-lg p-4 bg-white shadow">
							<h3 className="font-bold text-md">{kit.title}</h3>
							<p className="text-sm text-gray-600">{kit.description}</p>
							<Link href={`/references/docker/${kit.path}`}>
								<div className="text-blue-600 text-sm mt-2 hover:underline">→ View Details</div>
							</Link>
						</div>
					))}
				</div>
			</section>
		</main>
	);
};

export default DockerPage;
