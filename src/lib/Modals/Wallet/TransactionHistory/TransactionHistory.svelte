<script>
	import { onMount } from 'svelte';
	import ExpandingRisingBall from '$lib/loaders/ExpandingRisingBall.svelte';
	import ExpandingBall from '$lib/loaders/ExpandingBall.svelte';

	import { walletSwiper } from '$/stores';
	let currentTransactions = [];

	let loading = false;
	let initialLoad = true;
	let errorNotice = false;

	onMount(async () => {
		currentTransactions = await getTransactions();

		console.log(currentTransactions);
		initialLoad = false;
	});

	async function getTransactions() {
		try {
			let response = await fetch(`/api/wallet?route=gettransactions`);
			let res = await response.json();
			console.log(res);
			loading = false;
			return res;
		} catch (e) {
			console.log(e);
			errorNotice = true;
		}
	}

	function getHeaderName(t) {
		if (t.display_name === 'LN Withdrawal' && t.record) {
			return t.record?.action[0]?.toUpperCase() + t.record?.action?.substring(1);
		}
		return t.display_name;
	}

	let yScroll = 0;
	let yPosStart;
	let scrollTopStart;
</script>

{#if initialLoad}
	<div class="loader">
		<ExpandingBall />
		Loading History
	</div>
{:else if !errorNotice}
	<div class="trans-nav">
		{#if loading}
			<ExpandingRisingBall />
		{:else}
			<ul
				on:scroll={(e) => {
					yScroll = e.target.scrollTop;
				}}
				on:touchstart={(e) => {
					let touch = e.touches[0] || e.changedTouches[0];
					yPosStart = touch.pageY;
					$walletSwiper.allowTouchMove = false;
					scrollTopStart = yScroll;
				}}
				on:touchmove={(e) => {
					let touch = e.touches[0] || e.changedTouches[0];
					if (scrollTopStart === 0 && yPosStart < touch.pageY) {
						$walletSwiper.allowTouchMove = true;
					}
				}}
				on:touchend={() => {
					$walletSwiper.allowTouchMove = true;
				}}
			>
				{#each currentTransactions as t}
					<li>
						<div class="trans-header">
							<div>
								{#if t?.boostagram?.action}
									<h3>
										{t?.boostagram?.action[0].toUpperCase() + t?.boostagram?.action?.substring(1)}
									</h3>
								{/if}
								<p class="date-time">
									{new Date(t.created_at).toLocaleDateString('en-gb', {
										year: 'numeric',
										month: 'short',
										day: 'numeric'
									})}

									{Intl.DateTimeFormat('en', {
										hour: 'numeric',
										minute: 'numeric',
										second: 'numeric',
										hour12: true
									}).format(new Date(t.created_at).getTime())}
								</p>
							</div>
							<p>{t.amount} Satoshis</p>
						</div>

						{#if t?.memo}
							<p>{t?.memo}</p>
						{/if}
						{#if t?.boostagram?.action}
							{#if t?.boostagram?.action === 'boost'}
								<p>
									<span>Total Boost:</span>
									{t?.boostagram?.value_msat_total / 1000}
									sats
								</p>
							{/if}
							<p><span>Person:</span> {t?.boostagram?.name}</p>
							{#if t?.boostagram?.action === 'boost'}
								<p>
									<span>Person's Cut:</span>
									{t?.boostagram?.value_msat / 1000} sats
								</p>
							{/if}
							<p><span>Podcast:</span> {t?.boostagram?.podcast}</p>
							<p><span>Episode:</span> {t?.boostagram?.episode}</p>

							{#if t?.record?.message}
								<div class="message">
									Message:
									<p>{t?.boostagram?.message}</p>
								</div>
							{/if}
						{/if}
					</li>
				{/each}
			</ul>
		{/if}
	</div>
{:else}
	<div class="loader">
		<p>Transaction History is currently unavailable.</p>
		<p>Try again later.</p>
	</div>
{/if}

<style>
	.loader {
		height: 90%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: var(--primary-text-color);
	}

	.trans-nav {
		display: flex;
		flex-direction: column;
		height: 100%;
		color: var(--primary-text-color);
	}

	ul {
		padding: 0 8px;
		flex-grow: 1;
		overflow: auto;
		width: 100%;
	}

	.page-selector {
		display: flex;
		align-items: center;
		justify-content: space-around;
	}

	li {
		padding: 8px 0;
		border-bottom: 1px solid var(--border-color);
	}

	.trans-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
	}

	.trans-header > div {
		margin-bottom: 8px;
	}
	h3 {
		margin: 0;
		padding: 0;
	}
	.message {
		margin: 0;
		padding: 0 0 0 8px;
		font-weight: 600;
	}

	p {
		margin: 0;
		padding: 0 0 0 8px;
		color: var(--primary-text-color);
	}

	.message > p {
		font-style: italic;

		font-weight: normal;
	}

	span {
		font-weight: 600;
	}

	.date-time {
		font-size: 0.8em;
		font-style: italic;
	}

	button,
	button:hover,
	button:active {
		background: transparent;
		width: 60px;
		height: 60px;
		border: none;
		padding: 0;
		flex-grow: 1;
		margin: 0;
	}
</style>
