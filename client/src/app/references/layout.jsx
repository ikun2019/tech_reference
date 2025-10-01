import React from 'react';
import Sidebar from '../components/Sidebar';

const ReferenceLayout = ({ children }) => {
	return (
		<div className="flex min-h-screen">
			<Sidebar />
			<main className="flex-1 bg-gray-50 p-6">{children}</main>
		</div>
	);
};

export default ReferenceLayout;
