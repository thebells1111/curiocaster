<script>
  import MainSwiper from "./MainSwiper.svelte";
  import ModalSwiper from "./ModalSwiper.svelte";
  import WalletSwiper from "./WalletSwiper.svelte";

  import ChatPane from "./ChatPane/ChatPane.svelte";

  import BottomControlsBar from "./BottomControlsBar/BottomControlsBar.svelte";

  import { swiper, goFullscreen } from "$/stores";
</script>

<div id="mobile-viewer" class="viewer">
  <ChatPane />
  <main>
    <MainSwiper />
    <ModalSwiper />
    <WalletSwiper />
  </main>
  {#if !$goFullscreen}
    <BottomControlsBar />
  {/if}
</div>

<style>
  .viewer {
    height: 100%;
    width: 100%;
  }

  main {
    height: calc(100% - 65px);
    overflow: hidden;
  }

  .pane > div {
    display: none;
    height: 100%;
  }
</style>
