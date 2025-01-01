<script>
  import {
    currentList,
    currentDesktopView,
    showSubscriptionShowNotes,
    loggedIn,
    satBalance,
    playingEpisode,
    devMode,
    remoteServer,
  } from "$/stores";

  import Settings from "./Settings/Settings.svelte";
</script>

<div class="container">
  <ul>
    <li
      class:active={$currentDesktopView === "mainScreen"}
      on:click={() => {
        $currentList = "podcastList";
        $currentDesktopView = "mainScreen";
        $showSubscriptionShowNotes = false;
      }}
    >
      Subscriptions
    </li>

    <li
      class:active={$currentDesktopView === "nowPlaying"}
      on:click={() => {
        $currentDesktopView = "nowPlaying";
        $showSubscriptionShowNotes = false;
      }}
    >
      Now Playing
    </li>

    <Settings />

    {#if $loggedIn}
      <li
        on:click={() => {
          fetch(remoteServer + `/api/alby/logout`);
          $loggedIn = false;
          $satBalance = null;
        }}
      >
        Log Out
      </li>
    {:else}
      <li>
        {#if devMode}
          <a
            href="https://getalby.com/oauth?client_id=32dVOIuGiA&response_type=code&redirect_uri=http://localhost:3000&scope=account:read%20balance:read%20payments:send%20invoices:create%20transactions:read"
            target="_self"
            class="alby-login"
          >
            Log In
          </a>
        {:else}
          <a
            href="https://getalby.com/oauth?client_id=CAVpd6denC&response_type=code&redirect_uri=https://curiocaster.com&scope=account:read%20balance:read%20payments:send%20invoices:create%20transactions:read"
            target="_self"
            class="alby-login"
          >
            Log In
          </a>
        {/if}
      </li>
    {/if}
    {#if $playingEpisode.chat}
      <li
        class:active={$currentDesktopView === "chat"}
        on:click={() => {
          $currentDesktopView = "chat";
          $showSubscriptionShowNotes = false;
        }}
      >
        Chat
      </li>
    {/if}
  </ul>
</div>

<style>
  .container {
    display: flex;
  }
  ul {
    display: flex;
    color: var(--tertiary-text-color);
  }
  li {
    padding: 8px;
    cursor: pointer;
    list-style: none;
    font-weight: 550;
  }

  a.alby-login {
    display: flex;
    color: var(--primary-text-color);
  }

  li:hover,
  a.alby-login:hover {
    color: var(--menu-hover-color);
  }

  .active,
  .active:hover {
    color: var(--menu-active-color);
  }
</style>
