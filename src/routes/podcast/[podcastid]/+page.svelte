<script>
  import { initialPodcast, currentDesktopView } from "$/stores";

  export let data;

  $initialPodcast = data.podcast || undefined;
  if ($initialPodcast.id) {
    $currentDesktopView = "mainScreen";
  }
</script>

<svelte:head>
  {#if $initialPodcast.id}
    <meta
      name="description"
      content={`CurioCaster - ${$initialPodcast.title}`}
    />
    <meta property="og:site_name" content="CurioCaster" />
    <meta property="og:title" content={`${$initialPodcast.title}`} />
    <meta property="og:description" content="Listen on CurioCaster" />
    <meta
      property="og:image"
      content={$initialPodcast.artwork || $initialPodcast.image}
    />
    <meta property="twitter:card" content="player" />
    <meta
      property="og:url"
      content={`https://curiocaster.com/podcast/pi${$initialPodcast.id}`}
    />
  {/if}
</svelte:head>
