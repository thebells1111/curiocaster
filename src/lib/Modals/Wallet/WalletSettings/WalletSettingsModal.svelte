<script>
  import WalletSettings from "./WalletSettings.svelte";
  import StreamingAmounts from "../StreamingAmounts/StreamingAmountsModal.svelte";
  import { showWallet } from "$/stores";

  let showAmounts = false;
  function hideWallet() {
    $showWallet = false;
    showAmounts = false;
  }
</script>

<section class:active={$showWallet} on:click|self={hideWallet}>
  <div class="scroll-bar-clipper">
    <WalletSettings bind:showAmounts />
  </div>
</section>

{#if showAmounts}
  <StreamingAmounts bind:showAmounts />
{/if}

<style>
  section {
    position: fixed;
    top: 0;
    left: 0;
    background-color: hsla(0, 0%, 0%, 0.45);
    height: 100vh;
    width: 100vw;
    color: #ddd;
    display: none;
    place-items: center center;
    z-index: 10;
    backdrop-filter: blur(3px);
  }

  .active {
    display: grid;
  }

  .scroll-bar-clipper {
    width: calc(100% - 16px);
    max-width: 360px;
    max-height: 700px;
    padding: 0;
    background-color: var(--primary-color);
    color: var(--tertiary-text-color);
    border-radius: 5px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    position: relative;
    border: var(--modal-border);
    box-shadow: var(--modal-box-shadow);
  }
</style>
