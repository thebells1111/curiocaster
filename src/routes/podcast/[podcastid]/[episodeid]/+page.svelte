<script>
  import { page } from "$app/stores";

  import { initialPodcast, initialEpisode, currentDesktopView, remoteServer } from "$/stores";
  import getRSSEditorFeed from "$functions/getRSSFeed.js";
  import { onMount } from "svelte";

  import { fetchPodcast, fetchEpisode } from "$functions/fetchFromIndex";

  $: if ($initialEpisode) {
    $currentDesktopView = "nowPlaying";
  }

  async function fetchData(podcastId, episodeId) {
    try {
      if (Number(episodeId)) {
        return await Promise.all([
          fetchPodcast(podcastId),
          fetchEpisode(episodeId),
        ]);
      } else if (episodeId === "live") {
        const podcast = await fetchPodcast(podcastId);
        const feed = await getRSSEditorFeed(podcast.url);
        return [podcast, feed.live?.[0]];
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }

    return null;
  }

  onMount(async () => {
    const [podcast, episode] = await fetchData(
      $page.params.podcastid,
      $page.params.episodeid
    );

    initialPodcast.set(podcast);
    initialEpisode.set(episode);
  });
</script>
