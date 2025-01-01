<script>
  import ImageLoader from "$lib/Shared/ImageLoader.svelte";
  import getRSS from "$functions/getRSSFeed";

  import {
    episodesList,
    filteredEpisodesList,
    episodesListPane,
    selectedPodcast,
    playingPodcast,
    selectedEpisode,
    displayShowNotesPane,
    middlePane,
    podcastSearchResults,
    searchListPodcastSelected,
    rightPane,
    remoteServer,
    showMobile,
    podcastListPane,
    mobileMiddlePane,
    showSubscriptionShowNotes,
    listSwiper,
    showRecentEpisodes,
  } from "$/stores";

  async function getPodcast(podcast, index) {
    history.replaceState(
      null,
      null,
      window.location.origin + `/podcast/pi${podcast.id}`
    );
    $rightPane = "showNotes";
    $showSubscriptionShowNotes = false;
    $showRecentEpisodes = false;

    //check to see if episodes are stored, if not, retrieves episodes
    if (!podcast.episodes) {
      let urls = [
        remoteServer + `api/queryindex?q=podcasts/byfeedid?id=` + podcast.id,
        remoteServer +
          `api/queryindex?q=episodes/byfeedid?` +
          encodeURIComponent(`id=${podcast.id}&max=1000`),
      ];
      Promise.all(
        urls.map((url) => fetch(url).then((response) => response.json()))
      ).then((data) => {
        if (data[0].status) {
          let feed = data[0].feed;
          feed.episodes = data[1].items;
          $selectedPodcast = feed;
          $episodesList = feed.episodes || [];
          $filteredEpisodesList = feed.episodes || [];
          podcast = feed;
          $podcastSearchResults.feeds[index] = feed;
          console.log(feed);
          $selectedEpisode = $filteredEpisodesList[0];

          $displayShowNotesPane = true;
        }
      });
      $filteredEpisodesList = [];
      $episodesList = [];
    } else {
      $episodesList = podcast.episodes;
      $filteredEpisodesList = podcast.episodes;
      $selectedEpisode = $filteredEpisodesList[0];
    }

    $searchListPodcastSelected = true;
    if ($showMobile) {
      $mobileMiddlePane = "episodeList";
      if ($showMobile) {
        $listSwiper.slideTo(1);
      }
    }
    $middlePane = "episodesList";
    $selectedPodcast = podcast;

    $middlePane = "episodesList";

    if ($episodesListPane) {
      $episodesListPane.scrollTop = 0;
    }

    getRSS(podcast.url);
  }

  let podcastBindings = [];
</script>

<button
  on:click={() => {
    $podcastListPane = "subscriptions";
  }}><span class="back-arrow">&#8249;</span> Subscriptions</button
>

<ul>
  {#each $podcastSearchResults && $podcastSearchResults.feeds as podcast, index}
    <li
      data-id={podcast.id}
      data-_id={podcast._id}
      data-index={index}
      data-type="podcastList"
      bind:this={podcastBindings[index]}
      class="podcast-title"
      on:click={getPodcast.bind(null, podcast, index)}
    >
      <ImageLoader
        url={podcast?.artwork || podcast?.image}
        alt={`${podcast?.title} Logo`}
        title={podcast?.title}
        imageSize="50"
        styling="border-radius: 2px; 
    margin-right: 6px; min-width: 50px"
      />
      <div class="title" class:selected={podcast.id === $selectedPodcast?.id}>
        {podcast?.title}
      </div>
    </li>
  {/each}
</ul>

<style>
  button {
    margin: 0;
    padding: 0;
    background-color: transparent;
    outline: none;
    border: none;
    display: flex;
    align-items: center;
    position: relative;
    background-color: var(--primary-color);
    height: 44px;
    line-height: 2em;
  }
  .back-arrow {
    font-size: 1.5em;
    font-weight: 650;
    padding: 0;
    height: 36px;
    margin: 0 2px 0 8px;
  }
  ul {
    padding: 0;
    margin: 0;
    height: calc(100% - 44px);
    overflow: auto;
    user-select: none;
  }

  li {
    list-style-type: none;
  }

  .podcast-title {
    display: flex;
    align-items: center;
    overflow: hidden;
    width: calc(100% - 8px);
    padding: 4px;
    margin: 0;
    border: none;
    text-align: left;
    cursor: pointer;
    height: auto;
    color: var(--primary-text-color);
    background-color: var(--episode-card-color);
    margin: 4px;
    border-radius: 4px;
  }
  .podcast-title:hover {
    background-color: var(--hover-primary-color);
    background: linear-gradient(
      -90deg,
      var(--hover-primary-color) 0%,
      var(--hover-secondary-color) 100%
    );
  }

  .title {
    width: 100%;
  }
</style>
