<script>
  import {
    userState,
    userStateDB,
    enableAutoplay,
    recentSettings,
  } from "$/stores";
  import AnonSettings from "$lib/Shared/Preferences/AnonSettings/AnonSettings.svelte";

  function handleEnableAutoplay(e) {
    $enableAutoplay = e.target.checked;
    $userState.enableAutoplay = $enableAutoplay;
    userStateDB.setItem("userState", $userState);

    console.log($enableAutoplay);
  }

  function handleChangeMaxEps(e) {
    $recentSettings.maxEps = Number($recentSettings.maxEps) || 3;
    handleRecentSettingsChange();
  }

  function handleChangeDays(e) {
    $recentSettings.time = Number($recentSettings.time) || 7;
    handleRecentSettingsChange();
  }

  function handleRecentSettingsChange() {
    $userState.recentSettings = $recentSettings;
    userStateDB.setItem("userState", $userState);
  }
</script>

<ul>
  <li>
    <label class="checkbox">
      <input
        type="checkbox"
        on:change={handleEnableAutoplay}
        checked={$enableAutoplay}
      />
      <span> Enable Autoplay</span>
      <p>
        Continue to next episode in episode list when current episode completes.
      </p>
    </label>
  </li>
  <li>
    <label class="max-eps">
      <input
        type="number"
        on:blur={handleChangeMaxEps}
        bind:value={$recentSettings.maxEps}
      />
      <span> Max Episodes</span>
      <p>Maxiumum episodes per podcast to display in Recent Episodes.</p>
    </label>
  </li>
  <li>
    <label class="days">
      <input
        type="number"
        on:blur={handleChangeDays}
        bind:value={$recentSettings.time}
      />
      <span> Days</span>
      <p>
        Displays episodes that have released with this number of days in Recent
        Episodes
      </p>
    </label>
  </li>
</ul>

<AnonSettings />

<style>
  ul {
    width: 100%;
    padding: 0;
    margin: 0;
    display: initial;
    overflow: hidden;
  }

  li {
    list-style: none;
    cursor: pointer;
    position: relative;
  }

  .checkbox {
    cursor: pointer;
    position: relative;
    height: 100%;
    width: 100%;
  }

  .checkbox > span {
    padding: 0 0.25em;
  }

  .checkbox > input {
    height: 15px;
    width: 15px;
    -webkit-appearance: none;
    -moz-appearance: none;
    -o-appearance: none;
    appearance: none;
    border: 1px solid var(--primary-text-color);
    border-radius: 4px;
    outline: none;
    background-color: transparent;
    cursor: pointer;
    margin: 0;
    position: relative;
    top: 3px;
  }

  .checkbox > input:checked::before {
    content: "\2713";
    display: block;
    text-align: center;
    position: absolute;
    right: -4px;
    bottom: -4px;
    font-size: 1.4em;
    font-weight: 700;
    color: var(--primary-text-color);
  }

  p {
    font-size: 12px;
    margin-left: 24px;
  }

  input[type="number"] {
    width: 4em;
    text-align: center;
    -moz-appearance: textfield;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
