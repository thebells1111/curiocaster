<script>
	import { player, userState, userStateDB } from '$/stores';

	const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5];

	function nextPlaybackRate(i) {
		$userState.playbackSpeed = $player.playbackRate;
		if ($player) {
			const index = i > -1 ? i - 1 : playbackRates.findIndex((v) => v === $player.playbackRate);
			const nextIndex = index < playbackRates.length - 1 ? index + 1 : 0;
			$player.playbackRate = playbackRates[nextIndex];

			userStateDB.setItem('userState', $userState);
		}
	}
</script>

<div>
	<button on:click|stopPropagation={nextPlaybackRate}>
		{$player?.playbackRate}x
	</button>
	<ul>
		{#each playbackRates as rate, i}
			<li
				on:click|stopPropagation={nextPlaybackRate.bind(this, i)}
				class:active={playbackRates.findIndex((v) => v === $player?.playbackRate) === i}
			>
				{rate.toFixed(2)}x
			</li>
		{/each}
	</ul>
</div>

<style>
	div {
		position: relative;
	}
	button,
	button:active {
		color: white;
		text-align: center;
		font-size: 1.1em;
		filter: drop-shadow(0px 2px 3px #000);
		font-weight: 700;
		background-color: transparent;
		border: none;
		margin: 0;
		padding: 0 8px;
	}

	ul {
		position: absolute;
		top: 23px;
		right: 4px;
		z-index: 4;
		display: none;
	}

	button:hover + ul,
	ul:hover {
		display: initial;
	}

	li {
		list-style: none;
		color: white;
		text-align: right;
		font-size: 1em;
		filter: drop-shadow(0px 2px 3px #000);
		font-weight: 700;
		background-color: rgb(61, 61, 61);
		border: none;
		margin: 0;
		padding: 6px 8px 6px 12px;
		cursor: pointer;
	}

	li:hover {
		background-color: rgb(182, 182, 182);
		color: black;
	}

	.active {
		background-color: white;
		color: black;
	}
</style>
