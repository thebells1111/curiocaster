<script>
	import savePlayingPodcastState from '$functions/savePlayingPodcastState';
	import satsToDollars from '$functions/satsToDollars.js';

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
	export let showAmounts = false;

	function saveBoostAmount() {
		$userState.wallet.defaultBoost = $defaultBoostValue;
		userStateDB.setItem('userState', $userState);
	}

	function saveStreamAmount() {
		$userState.wallet.defaultStream = $defaultStream;
		userStateDB.setItem('userState', $userState);
	}

	function savePlayingBoost() {
		$playingPodcastState.boost = $playingBoostValue;
		savePlayingPodcastState();
	}

	function savePlayingStream() {
		$playingPodcastState.stream = $playingStream;
		savePlayingPodcastState();
	}

	function handleInput(e) {
		if (e.key === '-' || e.key === '+' || e.key === '.' || e.key === ',' || e.key === 'e') {
			e.preventDefault();
		}

		// test = satsToDollars(e.target.value);

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
</script>

<!-- svelte-ignore a11y-label-has-associated-control-->
<label
	>Default Boost Amount:
	<div>
		<input
			class="sat-input"
			bind:value={$defaultBoostValue}
			on:keypress={handleInput}
			on:focus={(e) => {
				tempValue = e.target.value;
				e.target.select();
			}}
			on:blur={(e) => {
				if (e.target.value === '') {
					e.target.value = tempValue;
				}
				saveBoostAmount();
			}}
			type="number"
		/>
		<span>
			{#if $btcPrice}
				${satsToDollars($defaultBoostValue)}
			{:else}
				{`${$defaultBoostValue} sats`}
			{/if}
		</span>
	</div>
</label>

<!-- svelte-ignore a11y-label-has-associated-control-->
<label
	>Default Streaming Amount:
	<div>
		<input
			class="sat-input"
			bind:value={$defaultStream}
			on:keypress={handleInput}
			on:focus={(e) => {
				tempValue = e.target.value;
				e.target.select();
			}}
			on:blur={(e) => {
				if (e.target.value === '') {
					e.target.value = tempValue;
				}
				saveStreamAmount();
			}}
			type="number"
		/>
		<span>
			{#if $btcPrice}
				${satsToDollars($defaultStream)}
			{:else}
				{`${$defaultStream} sats`}
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
			<input
				class="sat-input"
				bind:value={$playingBoostValue}
				on:keypress={handleInput}
				on:focus={(e) => {
					tempValue = e.target.value;
					e.target.select();
				}}
				on:blur={(e) => {
					if (e.target.value === '') {
						e.target.value = tempValue;
					}
					savePlayingBoost();
				}}
				type="number"
			/>
			<span>
				{#if $btcPrice}
					${satsToDollars($playingBoostValue)}
				{:else}
					{`${$playingBoostValue} sats`}
				{/if}
			</span>
		</div>
	</label>

	<!-- svelte-ignore a11y-label-has-associated-control-->
	<label
		>Streaming Amount:
		<div>
			<input
				class="sat-input"
				bind:value={$playingStream}
				on:keypress={handleInput}
				on:focus={(e) => {
					tempValue = e.target.value;
					e.target.select();
				}}
				on:blur={(e) => {
					if (e.target.value === '') {
						e.target.value = tempValue;
					}

					savePlayingStream();
				}}
				type="number"
			/>
			<span>
				{#if $btcPrice}
					${satsToDollars($playingStream)}
				{:else}
					{`${$playingStream} sats`}
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
		margin: 0 24px 0 16px;
	}

	label > div {
		display: flex;
		width: 100%;
		justify-content: space-between;
	}

	label > div > span {
		margin: 8px;
	}

	input {
		width: 60%;
		margin-left: 16px;
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

	input[type='number'] {
		-moz-appearance: textfield;
	}
</style>
