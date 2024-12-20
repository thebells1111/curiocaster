<script>
	import NumberInput from './NumberInput.svelte';

	import Rewind5 from '$lib/Shared/Player/RewindButton5.svelte';
	import Rewind10 from '$lib/Shared/Player/RewindButton.svelte';
	import PlayPauseButton from '$lib/Shared/Player/PlayPauseButton.svelte';
	import Forward5 from '$lib/Shared/Player/FastForward5.svelte';
	import Forward10 from '$lib/Shared/Player/FastForward10.svelte';

	import convertTime from '$functions/convertTime';
	import encodeLink from '$functions/encodeLink';

	import {
		showShareClip,
		devMode,
		playingPodcast,
		playingEpisode,
		playerTime,
		playerDuration,
		player
	} from '$/stores';

	import { fade } from 'svelte/transition';

	let linkCopied = false;
	let link;

	let startHrs = '0';
	let startMins = '00';
	let startSecs = '00';

	let stopHrs = '0';
	let stopMins = '00';
	let stopSecs = '00';

	function setTime() {
		let startArr = convertTime($playerTime).split(':');
		let stopArr = convertTime($playerDuration).split(':');
		startHrs = startArr[0];
		startMins = startArr[1];
		startSecs = startArr[2];

		stopHrs = stopArr[0];
		stopMins = stopArr[1];
		stopSecs = stopArr[2];
	}

	$: if ($showShareClip) {
		setTime();
	}

	function copyLink() {
		console.log($playingEpisode?.liveStatus === 'live');
		let slug = `podcast/pi${$playingPodcast.id}/${
			$playingEpisode?.liveStatus === 'live' ? 'live' : $playingEpisode.id
		}`;

		clipType = $playingEpisode?.liveStatus === 'live' ? 'Episode' : 'Clip';
		console.log(slug);
		if (clipType === 'Clip') {
			let startTime = Number(startHrs) * 3600 + Number(startMins) * 60 + Number(startSecs);
			let stopTime = Number(stopHrs) * 3600 + Number(stopMins) * 60 + Number(stopSecs);
			slug = slug + `#t=${startTime},${stopTime}`;
		}

		if (devMode) {
			link = `http://localhost:3000/${slug}`;
		} else {
			link = `https://curiocaster.com/${slug}`;
		}

		console.log(link);
		const el = document.createElement('textarea');
		el.value = link;
		el.setAttribute('readonly', '');
		el.style.position = 'absolute';
		el.style.left = '-9999px';
		document.body.appendChild(el);
		el.select();
		document.execCommand('copy');
		document.body.removeChild(el);
		linkCopied = true;
		setTimeout(() => {
			$showShareClip = false;
			linkCopied = false;
			clipType = 'Clip';
		}, 750);
	}

	function setStart() {
		let startArr = convertTime($playerTime).split(':');
		startHrs = startArr[0];
		startMins = startArr[1];
		startSecs = startArr[2];
	}

	function setStop() {
		let stopArr = convertTime($playerTime).split(':');

		stopHrs = stopArr[0];
		stopMins = stopArr[1];
		stopSecs = stopArr[2];
		$player.pause();
	}

	let clipType = $playingEpisode?.liveStatus !== 'live' ? 'Clip' : 'Episode';
</script>

<section
	class:active={$showShareClip}
	on:mousedown|self={() => ($showShareClip = false)}
	on:touchstart|self={() => ($showShareClip = false)}
>
	<div class="scroll-bar-clipper">
		{#if $playingEpisode?.liveStatus !== 'live'}
			<div class="blur" class:hidden={clipType !== 'Episode'} />
		{/if}
		<div class="copied-card" out:fade={{ duration: 500 }}>
			<div class="radio-toolbar">
				<input type="radio" id="link-select-episode" bind:group={clipType} value={'Episode'} />
				<label for="link-select-episode">Episode</label>
				{#if $playingEpisode?.liveStatus !== 'live'}
					<input type="radio" id="link-select-clip" bind:group={clipType} value={'Clip'} />
					<label for="link-select-clip">Clip</label>
				{/if}
			</div>
			{#if linkCopied}
				<p>{clipType} Copied!</p>
			{:else}
				{#if $playingEpisode?.liveStatus !== 'live'}
					<div class="current-position">
						Current Position: {convertTime($playerTime)}
					</div>
					<div class="start-stop-times">
						<div class="time-container">
							<div class="time-text">Start Time</div>
							<div class="time-inputs">
								<NumberInput
									bind:value={startHrs}
									max="99"
									min="0"
									disabled={clipType === 'Episode'}
								/>:<NumberInput
									bind:value={startMins}
									max="59"
									min="0"
									disabled={clipType === 'Episode'}
								/>:<NumberInput
									bind:value={startSecs}
									max="59"
									min="0"
									disabled={clipType === 'Episode'}
								/>
							</div>
						</div>
						<div class="time-container">
							<div class="time-text">Stop Time</div>
							<div class="time-inputs">
								<NumberInput
									bind:value={stopHrs}
									max="99"
									min="0"
									disabled={clipType === 'Episode'}
								/>:<NumberInput
									bind:value={stopMins}
									max="59"
									min="0"
									disabled={clipType === 'Episode'}
								/>:<NumberInput
									bind:value={stopSecs}
									max="59"
									min="0"
									disabled={clipType === 'Episode'}
								/>
							</div>
						</div>
					</div>
					<div class="mark-container">
						<button on:click={setStart}>Set Start</button>
						<button on:click={setStop}>Set Stop</button>
					</div>
					<div class="control-buttons">
						<Rewind10 size="36" />
						<Rewind5 size="46" />
						<PlayPauseButton size="66" />
						<Forward5 size="46" />
						<Forward10 size="36" />
					</div>
				{:else}
					<h1>Live Episode</h1>
				{/if}

				<button class="copy-button primary" on:click={copyLink}>Copy {clipType}</button>
			{/if}
		</div>
	</div>
</section>

<style>
	section {
		position: fixed;
		top: 0;
		left: 0;
		background-color: hsla(0, 0%, 0%, 0.45);
		height: 100vh;
		width: 100vw;
		display: none;
		place-items: start center;
		z-index: 9999;
		backdrop-filter: blur(3px);
	}

	.active {
		display: grid;
	}

	.scroll-bar-clipper {
		width: calc(100% - 16px);
		max-width: 344px;
		height: 325px;
		border-radius: 4px;
		overflow: auto;
		margin-top: 84px;
		z-index: 3;
		position: relative;
		border: var(--modal-border);
		box-shadow: var(--modal-box-shadow);
	}

	.control-buttons {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 0 16px;
		color: var(--secondary-text-color);
	}

	.copied-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		background-color: var(--episode-card-color);
		height: 100%;
		width: 100%;
		border-radius: 4px;
		color: var(--primary-text-color);
	}

	.blur {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		background-color: hsla(0, 0%, 0%, 0.45);

		height: 100%;
		width: 100%;
		border-radius: 4px;
		z-index: 33;
		position: absolute;
		top: 0;
		backdrop-filter: blur(2px);
	}

	.hidden {
		display: none;
	}

	.current-position {
		margin-top: 8px;
	}

	.start-stop-times {
		flex: 1;
		display: flex;
		width: 100%;
		justify-content: space-around;
	}

	.mark-container {
		flex: 1;
		display: flex;
		width: 100%;
		justify-content: space-around;
	}
	.time-text {
		font-size: 1.1em;
		font-weight: 500;
		align-self: flex-start;
		text-align: center;
	}

	input {
		width: 40px;
		height: 40px;
		margin: 4px;
		text-align: center;
	}

	.mark-container {
		display: flex;
	}
	p {
		font-size: 2.2em;
		font-weight: 700;
		margin: 0;
		padding: 0;
		padding-bottom: 134px;
		z-index: 33;
	}
	button {
		height: 40px;
		width: 120px;
		margin-top: 8px;
		background-color: var(--secondary-color);
		color: var(--secondary-text-color);
		border-radius: 50px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		flex: none;
	}

	.copy-button {
		width: 90%;
		background-color: var(--secondary-color);
		z-index: 33;
		margin: 8px 0;
	}
	.radio-toolbar {
		width: 100%;
		display: flex;
		background-color: var(--episode-card-color);
		justify-self: flex-start;
		position: relative;
		top: -2px;
		z-index: 33;
	}

	.radio-toolbar input[type='radio'] {
		opacity: 0;
		position: fixed;
		width: 0;
	}

	.radio-toolbar label {
		display: inline-block;
		background-color: var(--primary-color);
		padding: 10px 20px;
		font-family: sans-serif, Arial;
		font-size: 16px;
		border-radius: 4px;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-weight: 500;
		cursor: pointer;
	}

	.radio-toolbar label:first-of-type {
		border-bottom-left-radius: 0;
	}

	.radio-toolbar label:last-of-type {
		border-bottom-right-radius: 0;
	}

	.radio-toolbar input[type='radio']:checked + label {
		background-color: var(--tertiary-color);
		color: var;
		font-weight: 700;
	}
</style>
