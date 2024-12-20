<script>
	import { player, userState, userStateDB, isLoaded } from '$/stores';

	import SpeakerLow from '$lib/icons/SpeakerLow.svelte';
	import SpeakerOff from '$lib/icons/SpeakerOff.svelte';
	import SpeakerMed from '$lib/icons/SpeakerMed.svelte';
	import SpeakerHigh from '$lib/icons/SpeakerHigh.svelte';
	import Slider from './Slider.svelte';
	const size = 30;
	const volumeIcons = [SpeakerOff, SpeakerLow, SpeakerMed, SpeakerHigh, SpeakerHigh];
	let volume = 100;

	$: if ($isLoaded) {
		setVolume();
	}

	function setVolume() {
		volume = Math.round($player.volume * 100);
	}
	async function handleChange() {
		$player.volume = volume / 100;
		$userState.volume = volume / 100;
		userStateDB.setItem('userState', $userState);
	}
</script>

<div>
	<svelte:component
		this={volumeIcons[Math.ceil(volume / 33)]}
		{size}
		color={'var(--primary-text-color)'}
	/>
	<Slider bind:value={volume} {handleChange} />
	<span>{volume}</span>
</div>

<style>
	div {
		display: flex;
		align-items: center;
		color: var(--primary-text-color);
	}

	span {
		width: 2em;
	}
</style>
