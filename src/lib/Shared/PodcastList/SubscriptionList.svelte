<script>
  import ImageLoader from "$lib/Shared/ImageLoader.svelte";
  import SubscriptionContextMenu from "../PodcastList/SubscriptionContextMenu.svelte";
  import PodcastSearch from "$lib/Shared/PodcastSearch/PodcastSearch.svelte";
  import Search from "$lib/icons/Search.svelte";
  import FilterPodcasts from "../PodcastList/FilterPodcasts.svelte";
  import getRSS from "$functions/getRSSFeed";
  import Loading from "$lib/icons/LoadingRotate.svelte";
  import sortEpisodes from "$functions/sortEpisodes";

  import {
    podcastList,
    selectedPodcast,
    podcastStateDB,
    selectedPodcastState,
    episodesList,
    filteredEpisodesList,
    selectedEpisode,
    displayShowNotesPane,
    rightPane,
    showMobile,
    listSwiper,
    liveEpisodes,
    showPodcastFilter,
    recentEpisodes,
    showRecentEpisodes,
    newEpisodesFlag,
    showSubscriptionShowNotes,
    isUpdatingEpisodes,
    episodeSorter,
    feedTitle,
    feedItems,
    remoteServer,
  } from "$/stores";

  let podcastBindings = [];

  async function getPodcast(podcast) {
    $feedTitle = "Recent Episodes";
    $showRecentEpisodes = false;
    $liveEpisodes = [];
    history.replaceState(
      null,
      null,
      window.location.origin + `/podcast/pi${podcast.id}`
    );
    $rightPane = "showNotes";
    // $currentList = 'episodesList';

    console.log(podcast);

    $selectedPodcast = podcast;
    $selectedPodcastState =
      (await podcastStateDB.getItem(`${podcast.id}`)) || {};
    $episodeSorter = $selectedPodcastState.episodeSorter || "newest";
    if (podcast.episodes) {
      $episodesList = podcast.episodes;
    } else {
      let res = await fetch(
        `${remoteServer}api/queryindex?q=episodes/byfeedid?` +
          encodeURIComponent(`id=${podcast.id}` + "&max=1000")
      );
      let data = await res.json();
      podcast.episodes = data.items;
      $episodesList = podcast.episodes;
    }
    $filteredEpisodesList = sortEpisodes($episodesList, $episodeSorter);
    $selectedEpisode = $filteredEpisodesList[0];

    $displayShowNotesPane = true;

    if ($showMobile) {
      $listSwiper.slideTo(1);
    }

    getRSS(podcast.url);
    console.log($feedItems);
  }

  let isSearchFocused = false;
</script>

{#if $showMobile}
  {#if $showPodcastFilter}
    <FilterPodcasts />
  {:else}
    <div class="search">
      <PodcastSearch bind:isSearchFocused />
      <div class="search-icon" class:hide={isSearchFocused}>
        <Search size="27px" />
      </div>
    </div>
  {/if}
{:else}
  <FilterPodcasts />
{/if}

<ul>
  {#if $podcastList?.length}
    <li
      class="podcast-title"
      class:selected={$showRecentEpisodes}
      on:click={async () => {
        $showRecentEpisodes = true;
        $newEpisodesFlag = false;
        $showSubscriptionShowNotes = false;

        $selectedPodcastState = (await podcastStateDB.getItem(`recent`)) || {};
        $episodeSorter = $selectedPodcastState.episodeSorter || "newest";
        $episodesList = $recentEpisodes;
        $filteredEpisodesList = sortEpisodes($episodesList, $episodeSorter);

        if ($filteredEpisodesList?.length) {
          $selectedEpisode = $filteredEpisodesList[0];
        } else {
          $selectedEpisode = undefined;
        }
        if ($showMobile) {
          $listSwiper.slideTo(1);
        }
      }}
    >
      <ImageLoader
        url="https://curiocaster.com/CurioLogo64.png"
        alt="CurioCaster Logo"
        title="Recent Episodes"
        imageSize="50"
        styling="border-radius: 2px; 
margin-right: 6px; min-width: 50px"
      />
      <div class="title" class:selected={$showRecentEpisodes}>
        Recent Episodes
      </div>
      {#if $newEpisodesFlag}
        <div class="count-container">
          <div class="count" />
        </div>
      {/if}
      {#if $isUpdatingEpisodes}
        <div class="loading-icon">
          <Loading size="32px" color={"var(--primary-text-color)"} />
        </div>
      {/if}
    </li>

    {#each [].concat($podcastList) as podcast, index}
      <li
        data-id={podcast.id}
        data-_id={podcast._id}
        data-index={index}
        data-type="podcastList"
        bind:this={podcastBindings[index]}
        class="podcast-title"
        class:selected={podcast.id === $selectedPodcast?.id &&
          !$showRecentEpisodes}
        on:click={getPodcast.bind(null, podcast)}
      >
        <ImageLoader
          url={podcast?.artwork || podcast?.image}
          alt={`${podcast?.title} Logo`}
          title={podcast?.title}
          imageSize="50"
          styling="border-radius: 2px; 
    margin-right: 6px; min-width: 50px"
        />
        <div
          class="title"
          class:selected={podcast.id === $selectedPodcast?.id &&
            !$showRecentEpisodes}
        >
          {podcast?.title}
        </div>
      </li>
    {/each}
  {/if}
</ul>

<SubscriptionContextMenu />

<style>
  ul {
    padding: 0;
    margin: 0;
    height: 100%;
    overflow: auto;
    user-select: none;
  }

  li {
    list-style-type: none;
    position: relative;
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
  .podcast-title.selected {
    background-color: var(--selected-primary-color);
    background: linear-gradient(
      -90deg,
      var(--selected-primary-color) 0%,
      var(--selected-secondary-color) 100%
    );
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

  .count-container {
    padding-left: 8px;
  }

  .count-container > .count {
    display: inline-flex;
    color: var(--tertiary-color);
    background-color: var(--primary-accent-color);
    height: 0.75em;
    width: 0.75em;
    align-items: center;
    justify-content: center;
    border-radius: 4em;
    overflow: hidden;
    position: relative;
    right: 6px;
  }

  .search {
    margin: 4px 8px;
    height: 30px;
    background-color: transparent;
    border-radius: 30px;
    border: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    padding: 0;
    position: relative;
  }

  .search-icon {
    color: var(--primary-text-color);
    position: absolute;
    right: 2px;
    top: 1px;
  }

  .hide {
    opacity: 0;
  }
  .loading-icon {
    position: absolute;
    right: 0px;
    top: 14px;
  }

  .promoted {
    margin: 0;
    padding: 40px 40px 2px 40px;
    text-align: center;
    position: absolute;
    top: -20px;
    right: -50px;
    color: var(--secondary-text-color);
    background-color: var(--promoted-color);
    transform: rotateY(0deg) rotate(45deg);
    filter: drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));
    z-index: 2;
  }

  .promoted p {
    margin: 0;
    padding: 0;
    font-size: 0.75em;
    text-align: center;
    width: 100%;
  }
</style>
