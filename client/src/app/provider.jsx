'use client';

import React, { createContext, useMemo, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabaseBrowserClient';

export const SupabaseContext = createContext(null);

export default function Provider({ children }) {
	const [supabase] = useState(() => createSupabaseBrowserClient());
	const value = useMemo(() => ({ supabase }), [supabase]);
	return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>;
}
