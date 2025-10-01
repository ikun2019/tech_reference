'use client';

import React from 'react';
import Link from 'next/link';

const CategoryCard = ({ title, description, href, unlocked }) => {
	return (
		<div className="relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition">
			{!unlocked && (
				<div className="absolute inset-0 rounded-2xl bg-gray-100/70 backdrop-blur-[1px] flex items-center justify-center">
					<div className="text-xs px-2 py-1 bg-gray-800 text-white rounded-full">Locked</div>
				</div>
			)}
			<div className="flex items-start justify-between gap-4">
				<div>
					<h3 className="text-lg font-semibold">{title}</h3>
					<p className="text-sm text-gray-600 mt-1">{description}</p>
				</div>
				{unlocked && (
					<Link href={href} className="text-sm text-blue-600 hover:underline whitespace-nowrap">
						Open →
					</Link>
				)}
			</div>
		</div>
	);
};

export default CategoryCard;
