<script>
  import Image from "$functions/Image.svelte";
  import stripHtml from "striptags";
  import BoostButton from "./BoostButton.svelte";
  import getPendingValueBlock from "$functions/getPendingValueBlock";
  export let episode;
  import { showMobile, selectedPodcast, loggedIn } from "$/stores";

  $: valueBlock = getPendingValueBlock(episode, $selectedPodcast);

  function getStartTime(t) {
    try {
      let d = new Date(t);
      let date = d.toLocaleDateString();
      let time = d.toLocaleTimeString();
      let a = time.split(" ");
      let b = a[0].split(":");
      b.pop();
      b = b.join(":");
      a[0] = b;
      time = a.join(" ");
      return `${date} at ${time}`;
    } catch (error) {
      console.log(error);
    }
  }
</script>

<div class="card">
  {#if !$showMobile}
    <Image
      src={episode?.image || $selectedPodcast?.artwork}
      style={"margin:8px; border-radius:6px; width:130px; height: 130px; object-fit: contain;"}
    />
  {/if}

  <div class="description">
    <div class="head">
      <h1>{episode?.title}</h1>
    </div>
    <div class="slug">
      <p>{stripHtml(episode?.description).slice(0, 225)}</p>
    </div>
    <div class="footer">
      <p class="date">
        On Air Time:
        {getStartTime(episode.startTime)}
      </p>
      {#if valueBlock}
        <BoostButton {episode} {valueBlock} />
      {/if}
    </div>
  </div>
</div>

<style>
  .card {
    height: 144px;
    width: 100%;
    margin: 0;
    list-style: none;
    cursor: pointer;
    box-sizing: border-box;
    display: flex;
    position: relative;
    overflow: hidden;
    background-color: var(--episode-card-selected);
    border-radius: 8px;
    color: #333;
    margin-bottom: 8px;
  }

  .card:hover {
    background-color: var(--episode-card-hover);
  }

  .description {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .head {
    position: relative;
    width: 100%;
  }

  .head h1 {
    width: calc(100% - 32px);
    margin: 2px 0 2px 0;
    font-size: 1.17em;
    font-weight: 650;
    max-height: 48px;
    overflow: hidden;
    text-align: start;
    display: inline-block;
    line-height: 1.17em;
  }

  .slug {
    height: 100%;
    overflow: hidden;
    padding-right: 8px;
    flex-grow: 1;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
