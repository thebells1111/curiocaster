<script>
  import SendIcon from "$lib/icons/Send.svelte";
  import throwConfetti from "$functions/throwConfetti";
  import satsToDollars from "$functions/satsToDollars.js";
  import boostSats from "$functions/boostSats";
  import clone from "just-clone";
  import getBaseRecord from "$functions/getBaseRecord";

  import {
    showBoost,
    satBalance,
    showBoostStatus,
    nickName,
    userState,
    userStateDB,
    btcPrice,
    walletValueBlock,
    pendingEpisodesWallet,
    modalSwiper,
    modalSwiperType,
    anonBoostagram,
    showMobile,
    boostBacks,
  } from "$/stores";

  let destinations = [];
  let textarea;
  let satValue = 0;

  let sender = $nickName;
  let isAnon = $anonBoostagram;
  export let textLength = 0;
  let submitButton;

  export let saveText = "";
  export let displayText = "";

  function checkSatValue(lastKeystroke) {
    if ($satBalance < satValue) {
      if (lastKeystroke) {
        satValue = "";
      } else satValue = $satBalance;
    }
    displayText = saveText;
    textLength = displayText?.length || 0;

    if (submitButton) {
      submitButton.disabled = textLength > 500;
    }
  }

  function handleTextChange(e) {
    saveText = displayText;
    textLength = displayText.length;
    submitButton.disabled = textLength > maxTextLength;
  }

  const maxTextLength = 500;

  $: if ($walletValueBlock) {
    if ($pendingEpisodesWallet) {
      destinations = $pendingEpisodesWallet.destinations;
    } else {
      destinations = $walletValueBlock.destinations;
    }
  }

  function saveNickName() {
    $nickName = sender;
    $userState.nickName = sender;
    userStateDB.setItem("userState", $userState);
  }

  function handleInput(e) {
    if (
      e.key === "-" ||
      e.key === "+" ||
      e.key === "." ||
      e.key === "," ||
      e.key === "e"
    ) {
      e.preventDefault();
    }

    if (e.key === "Enter") {
      e.target.blur();
    }
    setTimeout(checkSatValue.bind(this, e.key), 0);
  }

  async function handleSubmit() {
    let memo = textarea.value.substring(0, maxTextLength);

    if ($showMobile) {
      $showBoostStatus = true;
      processBoost(satValue, destinations, memo);
      $showBoost = false;
      if ($modalSwiperType === "boostagram") {
        $modalSwiper.slideTo(0, 0);
      }
    } else {
      $showBoostStatus = true;
      processBoost(satValue, destinations, memo);
      $showBoost = false;
    }
  }

  async function processBoost(satValue, destinations, memo) {
    throwConfetti();
    let record = {};

    record = await getBaseRecord({
      action: "boost",
      amount: satValue,
    });

    $satBalance -= satValue;

    let runningTotal = satValue;

    let payments = [];

    let feesDestinations = destinations.filter((v) => v.fee);
    let splitsDestinations = destinations.filter((v) => !v.fee);

    record[7629169].message = memo;

    for (const dest of feesDestinations) {
      let amount = Math.round(Math.max((dest.split / 100) * satValue, 1));

      if (satValue - amount > 0) {
        let tempRecord = clone(record);
        runningTotal -= amount;
        tempRecord[7629169].value_msat = amount * 1000;
        tempRecord[7629169].name = dest.name;

        payments.push({
          recepient: dest,
          splitAmount: amount,
          record: tempRecord,
        });
      }
    }
    for (const dest of splitsDestinations) {
      let tempRecord = clone(record);
      let amount = Math.round((dest.split / 100) * runningTotal);
      tempRecord[7629169].value_msat = amount * 1000;
      console.log(dest.name);
      tempRecord[7629169].name = dest.name;

      if (amount >= 1) {
        payments.push({
          recepient: dest,
          splitAmount: amount,
          record: tempRecord,
        });
      }
    }
    console.log("boosts: ", payments);
    boostSats(payments).then((data) => {
      console.log(data);
    });
  }

  function handleBoostBackChange(e) {
    $boostBacks = !$boostBacks;
    $userState.boostBacks = $boostBacks;
    userStateDB.setItem("userState", $userState);
  }
</script>

<div class="header">
  <div class="sats-header">
    <h2>
      {$satBalance ? `${$satBalance} sats remaining` : ""}
    </h2>
  </div>
</div>

<label for="sat-tipper">
  <div class="value-header">
    Boost Amount:
    <span>
      {#if $btcPrice}
        ${satsToDollars(satValue)}
      {/if}
    </span>
  </div>
  <div class="sat-value">
    <input
      type="number"
      id="sat-tipper"
      min="0"
      step="1"
      bind:value={satValue}
      on:keypress={handleInput}
      on:click={(e) => {
        e.target.value = "";
      }}
      on:blur={(e) => {
        e.target.value = e.target.value || satValue || $satBalance;
      }}
    />
    <span>sats</span>
  </div>
</label>

<label>
  From:
  <input class="sender-input" bind:value={sender} on:blur={saveNickName} />
</label>

<checkbox-container>
  <label class="boost-backs">
    <input
      type="checkbox"
      checked={$boostBacks}
      on:change={handleBoostBackChange}
    />
    Allow BoostBack?
  </label>

  <label class="send-anon">
    <input type="checkbox" checked={isAnon} />
    Send anonymously?
  </label>
</checkbox-container>

<textarea
  bind:this={textarea}
  bind:value={displayText}
  on:input={handleTextChange}
  placeholder={`Type Boostagram Here`}
/>
<div class="bottom-bar">
  <span class:red={textLength > maxTextLength}
    >{maxTextLength - textLength} chars remaining</span
  >

  <button bind:this={submitButton} on:click={handleSubmit}>
    <div><SendIcon /></div>
  </button>
</div>

<style>
  .value-header {
    display: flex;
    justify-content: space-between;
  }

  .value-header > span {
    margin-right: 8px;
  }

  input {
    height: 42px;
    outline: none;
    background-color: var(--input-background-color);
    color: var(--primary-text-color);
  }

  textarea {
    background-color: var(--input-background-color);
    color: var(--primary-text-color);
  }

  textarea:focus,
  input:focus {
    border: 1px solid var(--primary-text-color);
    background-color: var(--input-background-color);
  }

  textarea:hover,
  input:hover {
    border: 1px solid var(--tertiary-text-color);
  }

  .sat-value {
    position: relative;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .sat-value > span {
    position: absolute;
    right: 8px;
    bottom: 18px;
  }

  .sat-value > input {
    padding-right: 40px;
    text-align: right;
    width: 100%;
  }

  h1 {
    margin: 0 0 4px 0;
    font-size: 1.75em;
    text-align: center;
  }

  h2 {
    margin: 0 0 8px 0;
    text-align: end;
  }

  .sender-input {
    width: calc(100%);
  }

  textarea {
    margin: 0;
    padding: 8px;
    height: 100%;
    min-height: 100px;
    width: 100%;
    resize: none;
    flex-grow: 1;
    outline: none;
  }

  .bottom-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .red {
    color: red;
  }

  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  button {
    min-height: 40px;
    width: 100%;
    max-width: 86px;
    align-self: center;
    background-color: var(--primary-button-background-color);
    color: var(--primary-text-color);
    border-radius: 20px;
  }

  .bottom-bar > button {
    width: 40px;
    min-width: 40px;
    position: relative;
    margin-top: 8px;
    top: 0;
    left: 0;
  }

  .bottom-bar > button:disabled {
    background-color: var(--tertiary-color);
    cursor: not-allowed;
  }

  .bottom-bar > button > div {
    position: relative;
    left: 2px;
    transform: rotate(-30deg);
  }

  checkbox-container {
    display: flex;
  }

  .boost-backs {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    cursor: pointer;
    width: 50%;
  }

  .send-anon {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    cursor: pointer;
    width: 50%;
  }

  .send-anon > input,
  .boost-backs > input {
    margin: 0 8px;
  }

  .sats-header {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    align-items: center;
    margin-bottom: 4px;
  }
</style>
