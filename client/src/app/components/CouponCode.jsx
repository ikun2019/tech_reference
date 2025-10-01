'use client';

import React, { useState } from 'react';

const CouponCode = () => {
	const [code, setCode] = useState('');
	const [busy, setBusy] = useState(false);
	const [msg, setMsg] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const trimmed = code.trim();
		if (!trimmed) {
			setMsg({ type: 'error', text: 'クーポンコードを入力してください' });
			return;
		}
		setBusy(true);
		setMsg({ type: 'info', text: '認証を確認しています' });
		try {
			const response = await fetch('/api/coupon', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ coupon_id: trimmed }),
			});

			// 認証エラー
			if (response.status === 401) {
				const err = await response.json().catch(() => ({}));
				setMsg({
					type: 'error',
					text: err?.error || '未ログインのためクーポンを適用できません。ログインしてください。',
				});
				return;
			}

			// バリデーションエラー
			if (!response.ok) {
				const err = await response.json().catch(() => {});
				setMsg({
					type: 'error',
					text: err?.error || err?.message || 'クーポンの適用に失敗しました',
				});
				return;
			}

			const data = await response.json().catch(() => {});
			const unlocked = data?.unlocked ? `(${data.unlocked})` : '';
			setMsg({ type: 'success', text: `クーポンが適用されました${unlocked}` });
			setCode('');
		} catch (error) {
			setMsg({ type: 'error', text: 'クーポンの適用に失敗しました' });
		} finally {
			setBusy(false);
		}
	};

	// アラート
	const renderAlert = () => {
		if (!msg) return null;

		const base = 'mt-3 rounded-lg border px-3 py-2 text-sm';
		const tone =
			msg.type === 'success'
				? 'border-green-200 bg-green-50 text-green-800'
				: msg.type === 'error'
				? 'border-red-200 bg-red-50 text-red-800'
				: 'border-blue-200 bg-blue-50 text-blue-800';

		return (
			<div className={`${base} ${tone}`} role="status" aria-live="polite">
				{msg.text}
			</div>
		);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
		>
			<p className="font-medium">🔑 クーポンでカテゴリを解放</p>
			<div className="mt-2 flex gap-2">
				<input
					type="text"
					className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
					placeholder="クーポンコード"
					value={code}
					onChange={(e) => setCode(e.target.value)}
					disabled={busy}
					aria-disabled={busy}
					aria-label="クーポンコードを入力"
				/>
				<button
					type="submit"
					className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
					disabled={busy}
					aria-label={busy}
				>
					{busy ? (
						<>
							<svg
								className="h-4 w-4 animate-spin"
								viewBox="0 0 24 24"
								fill="none"
								aria-hidden="true"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								></circle>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
								></path>
							</svg>
							送信中
						</>
					) : (
						'適用'
					)}
				</button>
			</div>
			{renderAlert()}
		</form>
	);
};

export default CouponCode;
