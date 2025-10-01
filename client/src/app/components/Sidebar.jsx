'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { FaDocker, FaServer, FaLock, FaNetworkWired, FaCodeBranch } from 'react-icons/fa';

const navItems = [
	{ name: 'Docker', icon: <FaDocker />, path: '/docker' },
	{ name: 'Express', icon: <FaServer />, path: '/express' },
	{ name: 'OpenSSL', icon: <FaLock />, path: '/openssl' },
	{ name: 'Redis', icon: <FaNetworkWired />, path: '/redis' },
	{ name: 'GraphQL', icon: <FaCodeBranch />, path: '/graphql' },
	{ name: 'gRPC', icon: '🔗', path: '/grpc' },
	{ name: 'Kafka', icon: '🧪', path: '/kafka' },
];

const Sidebar = () => {
	const pathname = usePathname();

	return (
		<aside className="w-64 bg-gray-900 text-white p-4 space-y-4 h-screen">
			<h2 className="text-lg font-bold">技術別リファレンス</h2>
			<nav className="space-y-2 text-sm">
				{navItems.map((item) => (
					<Link key={item.name} href={`/references${item.path}`}>
						<div
							className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700 ${
								pathname === `/references${item.path}` ? 'bg-gray-800 font-semibold' : ''
							}`}
						>
							<span>{item.icon}</span>
							{item.name}
						</div>
					</Link>
				))}
			</nav>
		</aside>
	);
};

export default Sidebar;
