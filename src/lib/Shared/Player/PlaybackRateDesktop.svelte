<script>
	//this is contained in DesktopViewer.svelte to the list can be expanded up
	import {
		player,
		userState,
		userStateDB,
		showMobile,
		playingEpisode,
		showSleepTimer,
		sleepStopTime,
		sleepOnEpisodeEnd,
		deviceType
	} from '$/stores';

	import SleepTimer from '$lib/icons/SleepTimer.svelte';

	const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5];

	function nextPlaybackRate(i) {
		showPlaybackRates = !showPlaybackRates;
		if ($player) {
			let index = i - 1;
			let nextIndex = index < playbackRates.length - 1 ? index + 1 : 0;
			$player.playbackRate = playbackRates[nextIndex];
			$userState.playbackSpeed = $player.playbackRate;

			userStateDB.setItem('userState', $userState);
		}
	}

	export let showPlaybackRates = false;
</script>

<div class="container" class:tablet={$deviceType === 'tablet'}>
	<button
		on:click={() => ($showSleepTimer = true)}
		class:active-timer={$sleepStopTime || $sleepOnEpisodeEnd}
	>
		<SleepTimer size={deviceType === 'tablet' ? '48' : '30'} />
	</button>
	<div class:hide={$playingEpisode.liveStatus === 'live'}>
		<button
			on:click={() => (showPlaybackRates = !showPlaybackRates)}
			class="playbackRateButton"
			class:tablet={$deviceType === 'tablet'}
		>
			{$player?.playbackRate}x
		</button>
		<ul class:show={showPlaybackRates} class:tablet={$deviceType === 'tablet'}>
			{#each playbackRates as rate, i}
				<li
					on:click={nextPlaybackRate.bind(this, i)}
					class:active={playbackRates.findIndex((v) => v === $player?.playbackRate) === i}
					class="playbackRateList"
					class:tablet={$deviceType === 'tablet'}
				>
					{rate.toFixed(2)}x
				</li>
			{/each}
		</ul>
	</div>
</div>

<style>
	.container {
		position: absolute;
		bottom: 12px;
		left: 250px;
		z-index: 9;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.container.tablet {
		left: 330px;
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
		top: -275px;
		right: -6px;
		z-index: 4;
		display: none;
	}

	ul.show {
		display: initial;
	}

	ul.tablet {
		top: -360px;
	}

	li {
		list-style: none;
		color: var(--secondary-text-color);
		text-align: right;
		font-size: 1em;
		filter: drop-shadow(0px 2px 3px #000);
		font-weight: 700;
		background-color: var(--episode-card-color);
		border: none;
		margin: 0;
		padding: 6px 8px 6px 12px;
		cursor: pointer;
	}

	li:hover {
		background-color: var(--episode-card-hover);
		color: var(--tertiary-text-color);
	}

	li.tablet {
		font-size: 24px;
	}

	.active {
		background-color: var(--episode-card-selected);
		color: var(--primary-text-color);
	}

	.active-timer,
	.active-timer:active {
		color: hsl(120, 100%, 33%);
	}

	.hide {
		display: none;
	}

	button.tablet,
	button.tablet:active {
		font-size: 24px;
	}
</style>
