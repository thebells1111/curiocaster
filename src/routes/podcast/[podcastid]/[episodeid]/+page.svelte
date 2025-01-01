<script>
  export let data;
  let podcast = data.podcast;
  let episode = data.episode;

  import { initialPodcast, initialEpisode, currentDesktopView } from "$/stores";

  $initialPodcast = podcast || undefined;
  $initialEpisode = episode || undefined;

  $: if ($initialEpisode) {
    $currentDesktopView = "nowPlaying";
  }
</script>

<svelte:head>
  {#if episode}
    <meta
      name="description"
      content={`CurioCaster - ${podcast.title} - ${episode.title}`}
    />
    <meta property="og:site_name" content="CurioCaster" />
    <meta property="og:title" content={`${podcast.title} - ${episode.title}`} />
    <meta property="og:description" content="Listen on CurioCaster" />
    <meta property="og:image" content={podcast.artwork || podcast.image} />
    <meta property="twitter:card" content="player" />
    <meta
      property="og:url"
      content={`https://curiocaster.com/podcast/pi${podcast.id}/${episode.id}`}
    />

    <meta
      property="twitter:player"
      content={`https://curiocaster.com/player/?podcast=${podcast.id}&episode=${episode.id}`}
    />
    <meta property="twitter:player:width" content="320" />
    <meta property="twitter:player:height" content="320" />
    <meta
      property="twitter:title"
      content={`${podcast.title} - ${episode.title}`}
    />
    <meta property="twitter:site" content="@CurioCaster" />
    <meta property="twitter:image" content={podcast.artwork || podcast.image} />
  {/if}
</svelte:head>
