<script>
	import SendIcon from '$lib/icons/Send.svelte';
	import { fade } from 'svelte/transition';
	import clone from 'just-clone';
	import boostSats from '$functions/boostSats';
	import satsToDollars from '$functions/satsToDollars.js';
	import dollarsToSats from '$functions/dollarsToSats';
	import throwConfetti from '$functions/throwConfetti';
	import WalletIcon from '$lib/icons/Wallet.svelte';
	import getBaseRecord from '$functions/getBaseRecord';

	import {
		showBoost,
		satBalance,
		playingEpisode,
		showBoostStatus,
		nickName,
		userState,
		userStateDB,
		btcPrice,
		walletValueBlock,
		pendingEpisodesWallet,
		pendingEpisodeData,
		selectedPodcast,
		anonBoostagram,
		showMobile,
		showInvoice,
		walletSwiper,
		walletSwiperType,
		boostBacks
	} from '$/stores';

	export let curioSupport = false;

	let destinations = [];
	let textarea;
	let dollarValue = 0;

	let sender = $nickName;
	export let textLength = 0;
	const maxTextLength = 500;
	let submitButton;
	let isAnon = $anonBoostagram;

	export let saveText = '';
	export let displayText = '';

	let cc = {
		name: 'CurioCaster Support',
		address: '030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3',
		type: 'node',
		customKey: '696969',
		customValue: 'eChoVKtO1KujpAA5HCoB',
		split: 80
	};

	let podcastIndex = {
		name: 'Podcastindex.org',
		address: '03ae9f91a0cb8ff43840e3c322c4c61f019d8c1c3cea15a25cfc425ac605e61a4a',
		type: 'node',
		split: 20
	};

	let curioSupportDestinations = [cc, podcastIndex];

	function checkSatValue(lastKeystroke) {
		if (satsToDollars($satBalance) < dollarValue) {
			if (lastKeystroke) {
				dollarValue = '';
			} else dollarValue = satsToDollars($satBalance);
		}
		displayText = saveText;
		textLength = displayText?.length || 0;
		if (submitButton) {
			submitButton.disabled = textLength > maxTextLength;
		}
	}

	function handleTextChange(e) {
		saveText = displayText;
		textLength = displayText.length;
		submitButton.disabled = textLength > maxTextLength;
	}

	$: if ($walletValueBlock) {
		if ($pendingEpisodesWallet) {
			destinations = $pendingEpisodesWallet.destinations;
		} else {
			destinations = $walletValueBlock.destinations;
		}
	}

	function saveNickName() {
		$nickName = sender;
		$userState.nickName = sender;
		userStateDB.setItem('userState', $userState);
	}

	function handleInput(e) {
		if (e.key === '-' || e.key === '+' || e.key === ',' || e.key === 'e') {
			e.preventDefault();
		}

		if (e.key === 'Enter') {
			e.target.blur();
		}
		setTimeout(checkSatValue.bind(this, e.key), 0);
	}

	async function handleSubmit() {
		if (curioSupport) {
			destinations = curioSupportDestinations;
		}
		boostSent = true;
		let satValue = dollarsToSats(dollarValue);
		let text = textarea.value.substring(0, maxTextLength) || 'No Message Attached';
		let memo =
			`(fiat $${Number(dollarValue).toLocaleString('en-US', {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			})})  ` + text;
		$showBoostStatus = true;
		processBoost(satValue, destinations, memo);

		boostSent = false;
		$showBoost = false;
	}

	async function processBoost(satValue, destinations, memo) {
		throwConfetti();

		let record = {};

		if (!curioSupport) {
			if ($pendingEpisodesWallet) {
				record = {
					7629169: {
						podcast:
							$pendingEpisodeData.title.length < 101
								? $pendingEpisodeData.title
								: $pendingEpisodeData.title.substring(0, 100) + '...',
						feedID: $selectedPodcast.id,
						itemID: $pendingEpisodeData.id,
						episode:
							$pendingEpisodeData.title.length < 101
								? $pendingEpisodeData.title
								: $pendingEpisodeData.title.substring(0, 100) + '...',
						action: 'boost',
						app_name: 'CurioCaster',
						url: $selectedPodcast.url
					}
				};
			} else {
				record = getBaseRecord({ action: 'boost', amount: satValue });
			}
		} else {
			record = {
				7629169: {
					podcast: 'CurioSupport',
					action: 'boost',
					app_name: 'CurioCaster'
				}
			};
		}
		$satBalance -= satValue;

		let runningTotal = satValue;

		let feesDestinations = destinations.filter((v) => v.fee);
		let splitsDestinations = destinations.filter((v) => !v.fee);

		if (memo) {
			record[7629169].message = memo;
		}

		let payments = [];
		for (const dest of feesDestinations) {
			let amount = Math.round(Math.max((dest.split / 100) * satValue, 1));

			if (satValue - amount > 0) {
				let tempRecord = clone(record);
				runningTotal -= amount;
				tempRecord[7629169].value_msat = amount * 1000;
				tempRecord[7629169].name = dest.name;

				console.log({ recepient: dest, splitAmount: amount, record: tempRecord });
				payments.push({
					recepient: dest,
					splitAmount: amount,
					record: tempRecord
				});
			}
		}
		for (const dest of splitsDestinations) {
			let tempRecord = clone(record);
			let amount = Math.round((dest.split / 100) * runningTotal);
			tempRecord[7629169].value_msat = amount * 1000;
			tempRecord[7629169].name = dest.name;

			if (curioSupport) {
				delete tempRecord[7629169].boost_link;
				delete tempRecord[7629169].episode;
				delete tempRecord[7629169].feedID;
				delete tempRecord[7629169].podcast;
				delete tempRecord[7629169].speed;
				delete tempRecord[7629169].ts;
				delete tempRecord[7629169].url;
				if (!memo) {
					record[7629169].message = 'CurioCaster Support';
				}
			}

			if (amount >= 1) {
				console.log({ recepient: dest, splitAmount: amount, record: tempRecord });
				payments.push({
					recepient: dest,
					splitAmount: amount,
					record: tempRecord
				});
			}
		}
		console.log(payments);
		boostSats(payments).then((data) => {
			console.log(data);
		});
	}

	function handleShowInvoice() {
		if ($showMobile) {
			$walletSwiperType = 'invoice';
			$walletSwiper.slideTo(1);
		} else {
			$showInvoice = true;
		}
	}

	function handleBoostBackChange(e) {
		$boostBacks = !$boostBacks;
		$userState.boostBacks = $boostBacks;
		userStateDB.setItem('userState', $userState);
	}
</script>

<div class="header">
	{#if curioSupport}
		<h1>Thanks for boosting<br />CurioCaster!</h1>
	{/if}
	<div class="sats-header">
		<button class="refill" on:click={handleShowInvoice}>
			<span>Refill</span>
			<WalletIcon />
			<span>Wallet</span>
		</button>
		<h2 in:fade>
			{#if $btcPrice}
				{$satBalance ? `$${satsToDollars($satBalance)} remaining` : ''}
			{/if}
		</h2>
	</div>
</div>

<label for="sat-tipper">
	<div class="value-header">
		Boost Amount:
		<span>
			{#if $btcPrice}
				{`${dollarsToSats(dollarValue)} sats`}
			{/if}
		</span>
	</div>
	<div class="sat-value">
		<span>$</span>
		<input
			type="number"
			id="sat-tipper"
			min="0"
			step="1"
			bind:value={dollarValue}
			on:keypress={handleInput}
			on:click={(e) => {
				e.target.value = '';
			}}
			on:blur={(e) => {
				e.target.value = Number(
					e.target.value || dollarValue || satsToDollars($satBalance)
				).toLocaleString('en-US', {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2
				});
			}}
		/>
	</div>
</label>

<label>
	From:
	<input class="sender-input" bind:value={sender} on:blur={saveNickName} />
</label>

<checkbox-container>
	<label class="boost-backs">
		<input type="checkbox" checked={$boostBacks} on:change={handleBoostBackChange} />
		Allow BoostBack?
	</label>

	<label class="send-anon">
		<input type="checkbox" checked={isAnon} />
		Send anonymously?
	</label>
</checkbox-container>

<textarea
	bind:this={textarea}
	bind:value={displayText}
	on:input={handleTextChange}
	placeholder={`Type Boostagram Here`}
/>
<div class="bottom-bar">
	<span class:red={textLength > maxTextLength}>{maxTextLength - textLength} chars remaining</span>

	<button bind:this={submitButton} on:click={handleSubmit}>
		<div><SendIcon /></div>
	</button>
</div>

<style>
	.value-header {
		display: flex;
		justify-content: space-between;
	}

	.value-header > span {
		margin-right: 8px;
	}

	input {
		height: 42px;
		outline: none;
		background-color: var(--input-background-color);
		color: var(--primary-text-color);
	}

	textarea {
		background-color: var(--input-background-color);
		color: var(--primary-text-color);
	}

	textarea:focus,
	input:focus {
		border: 1px solid var(--primary-text-color);
		background-color: var(--input-background-color);
	}

	textarea:hover,
	input:hover {
		border: 1px solid var(--tertiary-text-color);
	}

	.sat-value {
		position: relative;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.sat-value > span {
		position: absolute;
		left: 8px;
		bottom: 18px;
	}

	.sat-value > input {
		padding-left: 1.5em;
		text-align: left;
		width: 100%;
	}

	h1 {
		margin: 0 0 4px 0;
		font-size: 1.75em;
		text-align: center;
	}
	h2 {
		margin: 0 0 8px 0;
		text-align: end;
	}

	.sender-input {
		width: calc(100%);
	}

	textarea {
		margin: 0;
		padding: 8px;
		height: 100%;
		min-height: 100px;
		width: 100%;
		resize: none;
		flex-grow: 1;
		outline: none;
	}

	.bottom-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.red {
		color: red;
	}

	.header {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	button {
		min-height: 40px;
		width: 100%;
		max-width: 86px;
		align-self: center;
		background-color: var(--primary-button-background-color);
		color: var(--primary-text-color);
		border-radius: 20px;
	}

	.bottom-bar > button {
		width: 40px;
		min-width: 40px;
		position: relative;
		margin-top: 8px;
		top: 0;
		left: 0;
	}

	.bottom-bar > button:disabled {
		background-color: var(--tertiary-color);
		cursor: not-allowed;
	}

	.bottom-bar > button > div {
		position: relative;
		left: 2px;
		transform: rotate(-30deg);
	}

	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	input[type='number'] {
		-moz-appearance: textfield;
	}

	checkbox-container {
		display: flex;
	}

	.boost-backs {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		cursor: pointer;
		width: 50%;
	}

	.send-anon {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		cursor: pointer;
		width: 50%;
	}

	.send-anon > input,
	.boost-backs > input {
		margin: 0 8px;
	}

	.sats-header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		width: 100%;
		align-items: center;
		margin-bottom: 4px;
	}

	.refill {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: transparent;
		margin: 0;
		padding: 0;
		width: 42px;
		border: none;
	}

	.refill span {
		font-size: 0.6em;
	}
</style>
