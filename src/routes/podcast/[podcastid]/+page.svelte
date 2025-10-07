<script>
  import { page } from "$app/stores";
  import { initialPodcast, currentDesktopView } from "$/stores";

  import { onMount } from "svelte";
  import { fetchPodcast } from "$functions/fetchFromIndex";

  if ($initialPodcast?.id) {
    $currentDesktopView = "mainScreen";
  }

  onMount(async () => {
    const podcast = await fetchPodcast($page.params.podcastid);
    $initialPodcast = podcast;
  });

</script>