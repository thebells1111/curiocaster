<script>
  import convertTime from "$functions/convertTime";
  import Image from "$functions/Image.svelte";
  import sortChapters from "$functions/sortChapters";

  import {
    selectedEpisode,
    selectedPodcast,
    playingEpisode,
    player,
    playerTime,
    selectedEpisodeChapters,
    chapterIndex,
    middlePane,
    playerSaveTime,
    showNotesVerticalSwiper,
    listSwiper,
    useDefaultChapter,
  } from "$/stores";

  export let showChapters = false;
  let imageSizer = "&w=480&h=480";

  export let episode = $selectedEpisode;

  $: if (episode && episode?.chaptersUrl) {
    getChapters(episode.chaptersUrl, "selected");
  } else {
    $selectedEpisodeChapters = undefined;
  }

  async function getChapters(url, selector) {
    let chapters;
    if (url) {
      let res = await fetch(`/api/httpsproxy?url=` + encodeURIComponent(url));
      let text = await res.text();
      chapters = hasJsonStructure(text);
    }
    if (selector === "selected") {
      $selectedEpisodeChapters = sortChapters(chapters);
    }

    function hasJsonStructure(str) {
      if (typeof str !== "string") return false;
      try {
        return JSON.parse(str);
      } catch (err) {
        return false;
      }
    }
  }

  function jumpToChapter(chapter, index) {
    showChapters = false;
    if ($playingEpisode.guid === episode.guid) {
      if (chapter.startTime) {
        $playerTime = chapter.startTime;
        $player.currentTime = $playerTime;
        console.log($player.currentTime);
        $chapterIndex = index;
        $playerSaveTime = 0;
      }
      $middlePane = "nowPlaying";
    }
  }

  let yScroll = 0;
  let yPosStart;
  let scrollTopStart;
</script>

{#if $selectedEpisodeChapters}
  <ul
    on:scroll={(e) => {
      yScroll = e.target.scrollTop;
    }}
    on:touchstart={(e) => {
      let touch = e.touches[0] || e.changedTouches[0];
      yPosStart = touch.pageY;
      $listSwiper.allowTouchMove = false;
      $showNotesVerticalSwiper.allowTouchMove = false;
      scrollTopStart = yScroll;
    }}
    on:touchmove={(e) => {
      let touch = e.touches[0] || e.changedTouches[0];
      if (scrollTopStart === 0 && yPosStart < touch.pageY) {
        $listSwiper.allowTouchMove = true;
        $showNotesVerticalSwiper.allowTouchMove = true;
      }
    }}
    on:touchend={() => {
      $listSwiper.allowTouchMove = true;
      $showNotesVerticalSwiper.allowTouchMove = true;
    }}
  >
    {#each $selectedEpisodeChapters as chapter, index}
      <li
        on:click={jumpToChapter.bind(this, chapter, index)}
        class:active={$playingEpisode.guid === episode.guid &&
          index === $chapterIndex &&
          !$useDefaultChapter}
      >
        <div class="img-container">
          <!-- svelte-ignore a11y-img -->
          <Image
            alt="chapter"
            src={chapter?.img ||
              episode?.image ||
              $selectedPodcast?.artwork ||
              $selectedPodcast?.image}
            style={`height: 100%;	width: 100%;`}
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
    height: 100%;
    overflow: auto;
    overflow-x: hidden;
  }

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 3px 0;
    border-bottom: 1px solid var(--border-color);
    font-weight: 500;
  }

  .active {
    background-color: var(--selected-secondary-color);
  }

  .img-container {
    height: 60px;
    width: 60px;
    min-width: 60px;
    background-color: var(--dark-primary-color);
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
