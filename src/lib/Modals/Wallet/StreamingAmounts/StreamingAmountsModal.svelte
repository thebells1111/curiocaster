<script>
  import StreamingAmounts from "./StreamingAmounts.svelte";
  export let showAmounts = false;
</script>

<section
  on:mousedown|self={() => (showAmounts = false)}
  on:touchstart|self={() => (showAmounts = false)}
>
  <div class="scroll-bar-clipper">
    <StreamingAmounts bind:showAmounts />
  </div>
</section>

<style>
  section {
    position: fixed;
    top: 0;
    left: 0;
    background-color: hsla(0, 0%, 0%, 0);
    height: 100vh;
    width: 100vw;
    color: var(--primary-text-color);
    display: grid;
    place-items: center;
    z-index: 10;
  }

  .scroll-bar-clipper {
    width: calc(100% - 8px);
    max-width: 360px;
    max-height: 700px;
    padding: 8px;
    background-color: var(--primary-color);
    color: var(--primary-text-color);
    border-radius: 5px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    position: absolute;
    border: var(--modal-border);
    box-shadow: var(--modal-box-shadow);
  }
</style>
