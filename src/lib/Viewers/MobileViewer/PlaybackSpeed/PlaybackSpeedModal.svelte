<script>
 

  import { userState, userStateDB, player, showMobile, swiper } =
    getContext('app');
  import { hidePlaybackSpeed } = getContext('mobile');
  import Slider from './Slider.svelte';

  const speedTicks = [0.5, 1, 1.5, 2];

  function changeSpeed() {
    $player.playbackRate($userState.playbackSpeed);
    $player.defaultPlaybackRate($userState.playbackSpeed);

    userStateDB.setItem('userState', $userState);
		console.log('nosedive')
  }

  function hideRange() {
    $hidePlaybackSpeed = true;
    $swiper.allowSlideNext = true;
    $swiper.allowSlidePrev = true;
  }

  function handleSpeedButtonClick(tick) {
    $userState.playbackSpeed = tick;
    changeSpeed();
  }
</script>

<section class:hide={$hidePlaybackSpeed} class:blur={$showMobile} on:click|self={hideRange}>
	<div class="playback-speed-controls">
		<h1>{$userState.playbackSpeed.toFixed(2)}X</h1>
		<div class="slider-container">
			<Slider
				handleChange={changeSpeed}
				bind:value={$userState.playbackSpeed}
				min="0.5"
				max="2"
				step="0.05"
			/>
			<div class="slidertick-axis">
				<div class="slidertick-container">
					{#each speedTicks as tick}
						<div class="slidertick" />
					{/each}
				</div>

				<div class="slider-button-container">
					{#each speedTicks as tick}
						<button class="speed-buttons" on:click={handleSpeedButtonClick.bind(this, tick)}
							>{tick.toFixed(2)}</button
						>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	section {
		position: fixed;
		top: 0;
		left: 0;
		background-color: hsla(0, 0%, 0%, 0.65);
		height: 100vh;
		width: 100vw;
		color: #ddd;
		display: grid;
		place-items: center;
		z-index: 9999;
	}

	.blur {
		backdrop-filter: blur(3px);
		background-color: hsla(0, 0%, 0%, 0.45);
	}

	.hide {
		display: none;
	}

	.playback-speed-controls {
		height: 300px;
		width: 600px;
		max-width: calc(100vw - 8px);
		background-color: #fff;
		color: #333;
		border-radius: 5px;
		overflow: auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.slider-container {
		width: 90%;
	}

	.slidertick-axis {
		display: flex;
		flex-direction: column;
	}

	.slidertick-container {
		display: flex;
		justify-content: space-between;
		position: relative;
		bottom: 0.5em;
	}

	.slider-button-container {
		width: calc(100% + 36px);
		/*add button width to container width */
		display: flex;
		justify-content: space-between;
		position: relative;
		left: -18px;
	}

	.slider-button-container button {
		display: flex;
		justify-content: center;
		text-align: center;
		background-color: #333;
		color: #eee;
		height: 36px;
		width: 36px;
		border-radius: 5px;
	}

	.slidertick {
		display: flex;
		justify-content: center;
		text-align: center;
		background-color: #333;
		height: 12px;
		width: 1px;
	}

	h1 {
		font-size: 4em;
		margin-top: 0;
	}
</style>
