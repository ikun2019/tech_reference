import React from 'react';

import { createSupabaseServerClient } from '@/lib/supabaseServerClient';

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const ReferenceLayout = async ({ children }) => {
	const supabase = await createSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	return (
		<div className="min-h-screen bg-gray-50 overflow-x-visible">
			<Header user={user} />
			<div className="flex min-w-0">
				<div className="flex-shrink-0">
					<Sidebar defaultCollapsed={true} />
				</div>
				<main className="flex-1 bg-gray-50 p-6 min-w-0 overflow-x-visible">{children}</main>
			</div>
		</div>
	);
};

export default ReferenceLayout;
