<script>
  import confetti from "canvas-confetti";
  import { longpress } from "$functions/longpress.js";
  import Boostagram from "$lib/Modals/Wallet/Boostagram/BoostagramModal.svelte";
  import BoostStatus from "$lib/Modals/Wallet/Boostagram/BoostStatus.svelte";
  import satsToDollars from "$functions/satsToDollars.js";
  import dollarsToSats from "$functions/dollarsToSats";
  import boostSats from "$functions/boostSats";
  import getBaseRecord from "$functions/getBaseRecord";

  import {
    devMode,
    showWallet,
    satBalance,
    defaultBoostValue,
    playingBoostValue,
    defaultStream,
    playingStream,
    walletValueBlock,
    swiper,
    showInvoice,
    showBoost,
    loggedIn,
    showMobile,
    walletDisabled,
    modalSwiper,
    modalSwiperType,
    walletSwiper,
    walletSwiperType,
  } from "$/stores";

  async function processBoost(valueTag) {
    let satValue = $playingBoostValue ?? $defaultBoostValue;
    if ($satBalance > satValue) {
      throwConfetti();

      $satBalance -= satValue;

      if (valueTag) {
        let destinations = valueTag.destinations;
        let payments = [];

        let feesDestinations = destinations.filter((v) => {
          return v.fee;
        });
        let splitsDestinations = destinations.filter((v) => {
          return !v.fee;
        });
        let runningTotal = satValue;

        for (const dest of feesDestinations) {
          let feeRecord = getBaseRecord({ action: "boost", amount: satValue });

          let amount = Math.round((dest.split / 100) * satValue, 1);
          if (amount) {
            runningTotal -= amount;
            feeRecord[7629169].value_msat = amount * 1000;
            feeRecord[7629169].name = dest.name;

            payments.push({
              recepient: dest,
              splitAmount: amount,
              record: feeRecord,
            });
          }
        }

        for (const dest of splitsDestinations) {
          let record = await getBaseRecord({
            action: "boost",
            amount: satValue,
          });
          let amount = Math.round((dest.split / 100) * runningTotal);

          record[7629169].value_msat = amount * 1000;
          record[7629169].name = dest.name;
          if (amount >= 1) {
            payments.push({
              recepient: dest,
              splitAmount: amount,
              record: record,
            });
          }
        }

        boostSats(payments).then((data) => {
          console.log(data);
        });
      }
    }
  }

  function throwConfetti() {
    var end = Date.now() + 0.1 * 1000;

    var colors = [
      "#fa6060",
      "#faa560",
      "#faf760",
      "#b2fa60",
      "#60c1fa",
      "#7260fa",
      "#fa60f2",
    ];

    (function frame() {
      confetti({
        particleCount: 8,
        angle: 75,
        spread: 55,
        origin: { x: 0, y: 0.9 },
        colors: colors,
      });
      confetti({
        particleCount: 8,
        angle: 105,
        spread: 55,
        origin: { x: 1, y: 0.9 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }

  function displayShowSupport() {
    if ($showMobile) {
      $modalSwiperType = "boostagram";
      $modalSwiper.slideTo(1);
    } else {
      if (!$loggedIn) {
        $showWallet = true;
      } else {
        $showBoost = true;
      }
    }
  }

  let longBoost = false;

  function handleBoostPress() {
    if (!$loggedIn) {
      if (devMode) {
        window.location =
          "https://getalby.com/oauth?client_id=32dVOIuGiA&response_type=code&redirect_uri=http://localhost:3000&scope=account:read%20balance:read%20payments:send%20invoices:create%20transactions:read";
      } else {
        window.location =
          "https://getalby.com/oauth?client_id=CAVpd6denC&response_type=code&redirect_uri=https://curiocaster.com&scope=account:read%20balance:read%20payments:send%20invoices:create%20transactions:read";
      }
    } else {
      if (longBoost) {
        longBoost = false;
      } else {
        processBoost($walletValueBlock);
      }
      if ($swiper) {
        $swiper.allowSlideNext = true;
        $swiper.allowSlidePrev = true;
      }
    }
  }

  function enableSwiper() {
    longBoost = false;
    activeButton = false;
    if ($swiper) {
      $swiper.allowSlideNext = true;
      $swiper.allowSlidePrev = true;
    }
  }

  function handleLongBoost() {
    if (!$loggedIn) {
      if (devMode) {
        window.location =
          "https://getalby.com/oauth?client_id=32dVOIuGiA&response_type=code&redirect_uri=http://localhost:3000&scope=account:read%20balance:read%20payments:send%20invoices:create%20transactions:read";
      } else {
        window.location =
          "https://getalby.com/oauth?client_id=CAVpd6denC&response_type=code&redirect_uri=https://curiocaster.com&scope=account:read%20balance:read%20payments:send%20invoices:create%20transactions:read";
      }
    } else {
      longBoost = true;
      displayShowSupport();
    }
  }

  let activeButton = false;

  function openWallet() {
    if ($showMobile) {
      $modalSwiperType = "wallet";
      $modalSwiper.slideTo(1);
    } else {
      $showWallet = true;
    }
  }

  function openInvoice() {
    if ($showMobile) {
      $walletSwiperType = "invoice";
      $walletSwiper.slideTo(1);
    } else {
      $showWallet = true;
      $showInvoice = true;
    }
  }
</script>

{#if $showBoost}
  <Boostagram />
{/if}
<BoostStatus />
<div class="container">
  <div class="controls-container" class:hide={$walletDisabled}>
    {#if $satBalance !== null && $walletValueBlock}
      <p on:click={openInvoice}>
        {Math.floor($satBalance)} sats<br />remaining
      </p>
    {:else}
      <p />
    {/if}
    <div class="boost-container">
      {#if $walletValueBlock}
        <button
          class:active={activeButton}
          class="primary"
          on:touchstart|preventDefault={() => (activeButton = true)}
          on:touchend={enableSwiper}
          use:longpress={[400, $swiper]}
          on:longpress={handleLongBoost}
          on:shortpress={handleBoostPress}
        >
          <div>Boost</div>
          <div class="boost-value">
            {$playingBoostValue ?? $defaultBoostValue}
          </div>
        </button>
        <p>Hold to send a Boostagram</p>
      {/if}
    </div>

    {#if $satBalance !== null && $walletValueBlock}
      <p class="streaming" on:click={openWallet}>
        streaming<br />
        {$playingStream ?? $defaultStream} sats/min
      </p>
    {:else}
      <p />
    {/if}
  </div>
</div>

<style>
  .container {
    width: 100%;
    display: flex;
    justify-content: center;
    position: relative;
  }
  .controls-container {
    width: 100%;
    padding: 0 8px;
    display: flex;
    justify-content: space-between;
    margin: 4px 0 8px 0;
    align-items: center;
    max-width: 344px;
    position: relative;
  }

  .boost-container {
    width: 100%;
  }

  .boost-container > p {
    font-weight: 400;
    font-size: 0.75em;
    position: absolute;
    bottom: -28px;
    width: 100%;
    left: 0;
    color: var(--primary-text-color);
  }

  button {
    position: relative;
    margin: 0;
    height: 43px;
    width: 100%;
    display: flex;
    text-align: center;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  button.active,
  button:active {
    top: 1px;
  }

  .boost-value {
    text-shadow: initial;
  }

  button > div {
    margin: 0;
    text-align: center;
    width: 100%;
  }

  p {
    text-align: center;
    padding: 0;
    position: relative;
    min-width: 94px;
    color: var(--primary-text-color);
    font-weight: 500;
  }

  .streaming {
    cursor: pointer;
  }

  .hide {
    display: none;
  }
</style>
