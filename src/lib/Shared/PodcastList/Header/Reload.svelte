<script>
  import updateEpisodes from "$lib/Loader/updateEpisodes";
  import Loading from "$lib/icons/Loading.svelte";
</script>

<div>
  <button
    id="podcast-settings-button"
    on:click={updateEpisodes.bind(this, false)}
  >
    <Loading size="27" />
  </button>
</div>

<style>
  div {
    position: relative;
    height: 36px;
  }

  button {
    background-color: transparent;
    margin: 0;
    padding: 0;
    border: none;
    height: 36px;
    min-width: 36px;
    display: grid;
    place-content: center center;
  }
</style>
