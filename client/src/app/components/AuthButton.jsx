'use client';
import React, { useMemo } from 'react';

import { createSupabaseBrowserClient } from '@/lib/supabaseBrowserClient';

const AuthButton = ({ userEmail }) => {
	const supabase = useMemo(() => createSupabaseBrowserClient(), []);

	const signInWithGitHub = async () => {
		await supabase.auth.signInWithOAuth({
			provider: 'github',
			options: { redirectTo: `${window.location.origin}/auth/callback` },
		});
	};

	const signOut = async () => {
		await fetch('/auth/signout', { method: 'POST' });
		window.location.reload();
	};

	if (userEmail) {
		return (
			<div className="flex items-center gap-3">
				<span className="text-sm text-gray-600">{userEmail}</span>
				<button onClick={signOut} className="rounded-lg border px-3 py-1.5 text-sm">
					Sign Out
				</button>
			</div>
		);
	}

	return (
		<button
			onClick={signInWithGitHub}
			className="rounded-lg bg-gray-900 px-3 py-1.5 text-sm text-white"
		>
			Sign in with GitHub
		</button>
	);
};

export default AuthButton;
