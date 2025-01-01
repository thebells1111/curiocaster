<script>
  import savePlayingPodcastState from "$functions/savePlayingPodcastState";
  import Switch from "svelte-switch";

  import satsToDollars from "$functions/satsToDollars.js";
  import dollarsToSats from "$functions/dollarsToSats.js";

  import {
    userState,
    userStateDB,
    walletDisabled,
    satBalance,
    showMobile,
    walletSwiperType,
    walletSwiper,
    playingBoostValue,
    playingStream,
    defaultBoostValue,
    defaultStream,
    playingPodcastState,
  } from "$/stores";

  export let showAmounts = false;

  function saveDisabled() {
    $walletDisabled = !$walletDisabled;
    $userState.wallet.disabled = $walletDisabled;

    userStateDB.setItem("userState", $userState);
  }

  function handleShowAmounts() {
    if ($showMobile) {
      $walletSwiperType = "streamingAmounts";
      $walletSwiper.slideTo(1);
    } else {
      showAmounts = true;
    }
  }
</script>

<div class="header">
  <h2>
    {Number($satBalance) > -1 ? `${$satBalance} sats remaining` : ""}
  </h2>
</div>
<ul>
  <li on:click={handleShowAmounts}>Boost / Stream Settings</li>
  <li on:click={saveDisabled}>
    Turn {$walletDisabled ? "On" : "Off"} Wallet
  </li>
</ul>

<style>
  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  h2 {
    margin: 8px 0;
    text-align: end;
  }

  li {
    border-top: 1px solid var(--border-color);
    height: 42px;
    padding: 8px;
    font-weight: 700;
    font-size: 1.1em;
    cursor: pointer;
  }

  .switch {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 0 24px 0;
    cursor: pointer;
  }

  .switch span {
    font-size: 1.4em;
    font-weight: 600;
    padding: 0 8px;
    color: var(--primary-text-color);
  }
</style>
