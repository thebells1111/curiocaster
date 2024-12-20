<script>
	import { sleepStopTime, sleepOnEpisodeEnd } from '$/stores';

	let times = [
		{ time: 0, text: 'Off' },
		{ time: 5, text: '5 minutes' },
		{ time: 10, text: '10 minutes' },
		{ time: 15, text: '15 minutes' },
		{ time: 30, text: '30 minutes' },
		{ time: 45, text: '45 minutes' },
		{ time: 60, text: '1 hour' },
		{ time: 120, text: '2 hours' },
		{ time: 'end', text: 'End of Episode' }
	];

	function setSleepTime(t) {
		if (Number(t) > -1) {
			$sleepStopTime = new Date().getTime() + t * 1000 * 60;
			$sleepOnEpisodeEnd = false;
		} else {
			$sleepStopTime = 0;
			$sleepOnEpisodeEnd = true;
		}
	}
</script>

<h1>Set Sleep Timer</h1>
{#each times as timer}
	<button on:click={setSleepTime.bind(this, timer.time)}>{timer.text}</button>
{/each}

<div class="stop-text">
	{#if $sleepStopTime}
		<p>Player will stop at:</p>
		<p>{new Date($sleepStopTime).toLocaleTimeString()}</p>
	{:else if $sleepOnEpisodeEnd}
		<p>Player will stop when episode ends.</p>
	{/if}
</div>

<style>
	h1 {
		text-align: center;
		border-bottom: 1px solid var(--border-color);
		margin: 0;
		padding: 12px 0;
	}
	button {
		width: 100%;
		margin: 0;
		border: none;
		height: 50px;
		border-radius: 0;
		border-bottom: 1px solid var(--border-color);
		background-color: transparent;
	}

	.stop-text {
		margin-top: 16px;
	}

	p {
		padding: 0;
		margin: 0;
		font-size: 1.1em;
		text-align: center;
	}
</style>
