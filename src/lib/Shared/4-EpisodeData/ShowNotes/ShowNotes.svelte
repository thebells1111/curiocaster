<script>
  import {
    selectedEpisode,
    showNotesVerticalSwiper,
    listSwiper,
  } from "$/stores";
  // import DOMPurify from 'isomorphic-dompurify';

  let persons = [];

  export let episode = $selectedEpisode;

  function handleImgError(e) {
    let elem = e.target;
    elem.parentNode.removeChild(elem);
  }

  let yScroll = 0;
  let yPosStart;
  let scrollTopStart;
</script>

<section>
  {#if episode && episode.description}
    <div
      class="show-notes"
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
      <!-- <div class="persons">
        {#each persons as person}
          <div>
            <img
              class="person-img"
              src={person.img}
              on:error={(e) => handleImgError(e)}
            />
            <p>{`${person.role}: ${person['#text']}`}</p>
          </div>
        {/each}
      </div> -->

      <div class="description">
        {@html typeof episode.description === "string"
          ? episode.description
              .trim()
              .replace(/<img[^>"']*((("[^"]*")|('[^']*'))[^"'>]*)*>/g, "")
              .replace(/<audio[^>"']*((("[^"]*")|('[^']*'))[^"'>]*)*>/g, "")
              .replace(/<video[^>"']*((("[^"]*")|('[^']*'))[^"'>]*)*>/g, "")
              .replace(/<source[^>"']*((("[^"]*")|('[^']*'))[^"'>]*)*>/g, "")
              .replace(/<p>\s*<\/p>/g, "")
          : // .replace(
            // 	/(([0-9]{1,2}):([0-9]{1,2}):?([0-9]{1,2})?)/gs,
            // 	'<a href=\'#\' class="timestampLink">$1</a>'
            // )
            ""}
      </div>
    </div>
  {/if}
</section>

<style>
  head {
    display: flex;
  }

  .show-notes {
    padding-right: 8px;
    height: 100%;
    overflow: auto;
  }

  section {
    height: 100%;
  }

  .description {
    word-wrap: break-word;
    display: flex;
    flex-direction: column;
    color: var(--primary-text-color);
    padding: 0 8px;
  }

  :global(.shownotes-load-episode-button:hover > svg) {
    color: #111;
    transform: scale(1.2);
    transition-duration: 0.2s;
  }
</style>
