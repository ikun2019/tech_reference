import React from 'react';
import Link from 'next/link';

import AuthButton from './AuthButton';

const Header = ({ user }) => {
	return (
		<header className="border-b bg-white">
			<div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="h-8 w-8 rounded-lg bg-blue-600" />
					<Link href="/" className="font-semibold">
						TechReference
					</Link>
				</div>
				<AuthButton userEmail={user?.email} />
			</div>
		</header>
	);
};

export default Header;
