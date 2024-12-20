<script>
 

  import { userState, swiper } from '$/stores'
  import { hidePlaybackSpeed } = getContext('mobile');

  function showRange() {
    $hidePlaybackSpeed = false;
    setTimeout(() => {
      $swiper.allowSlideNext = false;
      $swiper.allowSlidePrev = false;
    }, 1);
  }
</script>

<div class="playback-speed">
  <div on:click={showRange}>
    Playback Speed ({$userState.playbackSpeed.toFixed(2)}x)
  </div>
</div>

<style>
</style>
