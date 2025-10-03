<script>
  import convertTime from "$functions/convertTime";
  import Image from "$functions/Image.svelte";

  import {
    playingEpisode,
    player,
    playerTime,
    playingEpisodeChapters,
    chapterIndex,
    playingPodcast,
    playerSaveTime,
    useDefaultChapter,
  } from "$/stores";

  export let showChapters = false;
  let imageSizer = "&w=480&h=480";

  function jumpToChapter(chapter, index) {
    showChapters = false;
    if (chapter.startTime) {
      $playerTime = chapter.startTime;
      $player.currentTime = $playerTime;
      console.log($player.currentTime);
      $chapterIndex = index;
      $playerSaveTime = 0;
    }
  }
</script>

{#if $playingEpisodeChapters}
  <ul>
    {#each $playingEpisodeChapters as chapter, index}
      <li
        on:click={jumpToChapter.bind(this, chapter, index)}
        class:active={index === $chapterIndex && !$useDefaultChapter}
      >
        <div class="img-container">
          <!-- svelte-ignore a11y-img -->
          <Image
            alt="chapter"
            src={chapter.img ||
              $playingEpisode.image ||
              $playingPodcast.artwork ||
              $playingPodcast.image}
            style="height: 60px; border-radius:3px"
          />
        </div>
        <p class="title">{chapter.title}</p>
        <p class="time">{convertTime(chapter.startTime)}</p>
      </li>
    {/each}
  </ul>
{/if}

<style>
  ul {
    padding: 0;
  }

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 3px 0;
    border-bottom: 1px solid var(--border-color);
  }

  .active {
    background-color: var(--tertiary-color);
    font-weight: 500;
  }

  .img-container {
    height: 60px;
    width: 60px;
    min-width: 60px;
    background-color: lightgray;
  }

  .img-container img {
    height: 100%;
    width: 100%;
  }

  p {
    padding: 0 0 0 8px;
  }

  p.title {
    width: 100%;
  }

  p.time {
    padding-right: 8px;
  }
</style>
