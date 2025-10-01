'use client';

import React, { useState } from 'react';

const CouponCode = () => {
	const [coupon, setCoupon] = useState('');

	return (
		<section>
			<div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded mb-6">
				<p className="font-semibold">🔑 クーポンを入力して講座特典を解除しましょう</p>
				<div className="mt-2 flex gap-2">
					<input
						type="text"
						placeholder="クーポンコード"
						className="flex-1 px-3 py-1 border border-red-300 bg-white rounded"
						value={coupon}
						onChange={(e) => setCoupon(e.target.value)}
					/>
				</div>
			</div>
		</section>
	);
};

export default CouponCode;
