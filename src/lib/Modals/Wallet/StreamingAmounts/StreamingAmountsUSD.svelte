<script>
	import savePlayingPodcastState from '$functions/savePlayingPodcastState';
	import satsToDollars from '$functions/satsToDollars.js';
	import dollarsToSats from '$functions/dollarsToSats';

	import {
		userState,
		userStateDB,
		defaultBoostValue,
		defaultStream,
		playingBoostValue,
		playingStream,
		playingPodcast,
		playingPodcastState,
		btcPrice
	} from '$/stores';

	let tempValue = 0;

	function saveBoostAmount(value) {
		$defaultBoostValue = value;
		$userState.wallet.usdDefaultBoost = $defaultBoostValue;
		userStateDB.setItem('userState', $userState);
	}

	function saveStreamAmount(value) {
		$defaultStream = value;
		$userState.wallet.usdDefaultStream = $defaultStream;
		userStateDB.setItem('userState', $userState);
	}

	function savePlayingBoost(value) {
		$playingBoostValue = value;
		$playingPodcastState.usdBoost = $playingBoostValue;
		savePlayingPodcastState();
	}

	function savePlayingStream(value) {
		$playingStream = value;
		$playingPodcastState.usdStream = $playingStream;
		savePlayingPodcastState();
	}

	function handleInput(e) {
		var validNumber = new RegExp(/^\d*\.?\d*$/);
		let key = e.key;
		let currentValue = e.target.value;

		if (validNumber.test(key)) {
			if (currentValue === '' && key === '.') {
				e.target.value = '0';
			}
			let split = e.target.value.split('.');
			let decimal = split[1];

			if (split.length > 1 && e.key === '.') {
				e.target.value = '0';
			}
			if (decimal) {
				if (decimal.length > 0) {
					if (e.key === '.') {
						e.target.value = '0';
					}
					if (decimal.length > 1) {
						if (e.key === '.') {
							e.target.value = '0';
						} else {
							e.target.value = '';
						}
					}
				}
			}
		} else {
			e.preventDefault();
		}

		if (e.key === 'Enter') {
			const nodes = document.querySelectorAll('.sat-input');
			let nextNode;
			for (let i = 0; i < nodes.length; i++) {
				const item = nodes[i];
				if (item === e.target) {
					if (i < nodes.length - 1) {
						nextNode = nodes[i + 1];
					} else {
						nextNode = nodes[0];
					}
				}
			}

			nextNode.focus();
		}
	}

	function formatDollars(value, saveFn) {
		if (value === '') {
			value = tempValue;
		}
		let v = Number(value);
		console.log(v);
		if (v) {
			value = Number(value).toLocaleString('en-US', {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			});
		} else {
			value = '0.00';
		}

		saveFn(value);
	}
</script>

<!-- svelte-ignore a11y-label-has-associated-control-->
<label
	>Default Boost Amount:
	<div>
		<span class="dollar-symbol">$</span>
		<input
			class="sat-input"
			bind:value={$defaultBoostValue}
			on:keypress={handleInput}
			on:focus={(e) => {
				tempValue = e.target.value;
				e.target.select();
			}}
			on:blur={(e) => {
				formatDollars(e.target.value, saveBoostAmount);
			}}
		/>
		<span class="sats">
			{#if $btcPrice}
				{dollarsToSats($defaultBoostValue)} sats
			{/if}
		</span>
	</div>
</label>

<!-- svelte-ignore a11y-label-has-associated-control-->
<label
	>Default Streaming Amount:
	<div>
		<span class="dollar-symbol">$</span>
		<input
			class="sat-input"
			bind:value={$defaultStream}
			on:keypress={handleInput}
			on:focus={(e) => {
				tempValue = e.target.value;
				e.target.select();
			}}
			on:blur={(e) => {
				formatDollars(e.target.value, saveStreamAmount);
			}}
		/>
		<span class="sats">
			{#if $btcPrice}
				{dollarsToSats($defaultStream)} sats
			{/if}
		</span>
	</div>
</label>
{#if $playingPodcast.title}
	<p>Values for <br />{$playingPodcast.title}</p>

	<!-- svelte-ignore a11y-label-has-associated-control-->
	<label
		>Boost Amount:
		<div>
			<span class="dollar-symbol">$</span>
			<input
				class="sat-input"
				bind:value={$playingBoostValue}
				on:keypress={handleInput}
				on:focus={(e) => {
					tempValue = e.target.value;
					e.target.select();
				}}
				on:blur={(e) => {
					formatDollars(e.target.value, savePlayingBoost);
				}}
			/>
			<span class="sats">
				{#if $btcPrice}
					{dollarsToSats($playingBoostValue)} sats
				{/if}
			</span>
		</div>
	</label>

	<!-- svelte-ignore a11y-label-has-associated-control-->
	<label
		>Streaming Amount:
		<div>
			<span class="dollar-symbol">$</span>
			<input
				class="sat-input"
				bind:value={$playingStream}
				on:keypress={handleInput}
				on:focus={(e) => {
					tempValue = e.target.value;
					e.target.select();
				}}
				on:blur={(e) => {
					formatDollars(e.target.value, savePlayingStream);
				}}
			/>
			<span class="sats">
				{#if $btcPrice}
					{dollarsToSats($playingStream)} sats
				{/if}
			</span>
		</div>
	</label>
{/if}

<!-- <button
	class="primary"
	on:focus={() => {
		showAmounts = false;
	}}>Save</button
> -->
<style>
	label {
		font-size: 1.2em;
		font-weight: 700;
		margin: 0 24px 8px 16px;
	}

	label > div {
		display: flex;
		width: 100%;
		justify-content: space-between;
	}

	.dollar-symbol {
		display: flex;
		align-items: center;
		margin-right: 8px;
	}

	.sats {
		width: 150px;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	input {
		width: 60%;
		margin: 0 16px 0 0;
		background-color: var(--input-background-color);
		color: var(--secondary-text-color);
		border-radius: 20px;
	}

	p {
		width: 100%;
		text-align: center;
		font-weight: 700;
		font-size: 1.1em;
		padding: 8px 0 8px 0;
		border-top: 1px solid var(--border-color);
		margin-bottom: 4px;
	}

	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
