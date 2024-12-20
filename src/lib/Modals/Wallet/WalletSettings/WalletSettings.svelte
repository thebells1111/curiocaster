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
    showFiat,
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

  function toggleCurrency(e, state) {
    const checked = e?.detail?.checked || state;
    $showFiat = checked;
    $userState.showFiat = $showFiat;
    userStateDB.setItem("userState", $userState);

    if (checked) {
      $playingBoostValue = satsToDollars($playingBoostValue);
      $playingStream = satsToDollars($playingStream);
      $defaultBoostValue = satsToDollars($defaultBoostValue);
      $defaultStream = satsToDollars($defaultStream);
      $playingPodcastState.usdBoost = $playingBoostValue;
      $playingPodcastState.usdStream = $playingStream;
    } else {
      $playingBoostValue = dollarsToSats($playingBoostValue);
      $playingStream = dollarsToSats($playingStream);
      $defaultBoostValue = dollarsToSats($defaultBoostValue);
      $defaultStream = dollarsToSats($defaultStream);
      $playingPodcastState.boost = $playingBoostValue;
      $playingPodcastState.stream = $playingStream;
    }
    savePlayingPodcastState();
  }
</script>

<div class="header">
  <h2>
    {#if $showFiat}
      {Number($satBalance) > -1
        ? `$${satsToDollars($satBalance)} remaining`
        : "$0.00 remaining"}
    {:else}
      {Number($satBalance) > -1 ? `${$satBalance} sats remaining` : ""}
    {/if}
  </h2>
</div>
<ul>
  <li on:click={handleShowAmounts}>Boost / Stream Settings</li>
  <li on:click={saveDisabled}>
    Turn {$walletDisabled ? "On" : "Off"} Wallet
  </li>
</ul>

<div class="switch">
  <span on:click={toggleCurrency.bind(null, null, !$showFiat)}>₿</span>
  <Switch
    on:change={toggleCurrency}
    checked={$showFiat}
    onColor="#888"
    handleDiameter={15}
    unCheckedIcon={false}
    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
    height={10}
    width={30}
  >
    <span slot="checkedIcon" />
    <span slot="unCheckedIcon" />
  </Switch>
  <span on:click={toggleCurrency.bind(null, null, !$showFiat)}>$</span>
</div>

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
