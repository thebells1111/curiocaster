<script>
  import PlayArrow from "$lib/icons/PlayArrow.svelte";
</script>

<div class="container">
  <button class="load-episode-button episode-button">
    <PlayArrow size="36px" />
  </button>

  <div class="placeholder" />
</div>

<style>
  .container {
    margin: 0 8px;
    border-bottom: 1px solid var(--border-color);
    list-style: none;
    cursor: pointer;
    box-sizing: border-box;
    height: 50px;
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
  }

  .placeholder {
    width: 100%;
    height: 1.5em;
    margin: 0 0.5em;
    background-color: var(--primary-color);
  }

  button {
    background-color: transparent;
    border: none;
    padding: 0;
    width: 42px;
    margin: 0;
    color: #ddd;
  }
</style>
