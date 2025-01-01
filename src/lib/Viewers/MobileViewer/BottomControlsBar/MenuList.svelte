<script>
  import { slide } from "svelte/transition";
  import { goto } from "$app/navigation";

  import {
    swiper,
    modalSwiper,
    modalSwiperType,
    showLogin,
    loggedIn,
    satBalance,
    devMode,
    remoteServer,
  } from "$/stores";

  import MenuList from "$lib/icons/MenuList.svelte";
  import Refresh from "./Refresh/Refresh.svelte";

  import Login from "$lib/Modals/Login/Login.svelte";
  export let size = 30;
  let showList = false;

  function handleMenu() {
    showList = true;
    $swiper.allowSlideNext = false;
    $swiper.allowSlidePrev = false;
  }

  function hideMenu() {
    showList = false;
    $swiper.allowSlideNext = true;
    $swiper.allowSlidePrev = true;
  }

  function handleModalSwiper(type) {
    if (!$loggedIn && type === "wallet") {
      if (devMode) {
        goto(
          "https://getalby.com/oauth?client_id=32dVOIuGiA&response_type=code&redirect_uri=http://localhost:3000&scope=account:read%20balance:read%20payments:send%20invoices:create%20transactions:read"
        );
      } else {
        goto(
          "https://getalby.com/oauth?client_id=CAVpd6denC&response_type=code&redirect_uri=https://curiocaster.com&scope=account:read%20balance:read%20payments:send%20invoices:create%20transactions:read"
        );
      }
    } else {
      $modalSwiperType = type;
      $modalSwiper.slideTo(1);
    }
  }

  function handleLogIn() {
    if ($loggedIn) {
      $loggedIn = false;
      fetch(remoteServer + `/api/alby/logout`);
      $satBalance = null;
    } else {
      if (devMode) {
        goto(
          "https://getalby.com/oauth?client_id=32dVOIuGiA&response_type=code&redirect_uri=http://localhost:3000&scope=account:read%20balance:read%20payments:send%20invoices:create%20transactions:read"
        );
      } else {
        goto(
          "https://getalby.com/oauth?client_id=CAVpd6denC&response_type=code&redirect_uri=https://curiocaster.com&scope=account:read%20balance:read%20payments:send%20invoices:create%20transactions:read"
        );
      }
    }
  }
</script>

<button class="menu-button" on:click={handleMenu} aria-label="Menu">
  <MenuList {size} />
</button>
{#if showList}
  <div on:click={hideMenu}>
    <ul transition:slide={{ duration: 200 }}>
      <li on:click={handleLogIn}>Log {$loggedIn ? "Out" : "In"}</li>

      <li on:click={handleModalSwiper.bind(this, "preferences")}>
        Preferences
      </li>

      <li on:click={handleModalSwiper.bind(this, "wallet")}>Wallet</li>
      <li on:click={handleModalSwiper.bind(this, "opml")}>OPML</li>
      <li on:click={handleModalSwiper.bind(this, "disclaimer")}>Issues?</li>
      <li><Refresh /></li>
    </ul>
  </div>{/if}

{#if $showLogin}
  <Login />
{/if}

<style>
  div {
    position: absolute;
    height: 100vh;
    width: 100vw;
    z-index: 3;
    bottom: 0;
    left: 0;
  }
  ul {
    background-color: var(--secondary-color);
    color: var(--primary-text-color);
    border-radius: 3px;
    width: 200px;
    padding: 0;
    margin: 0;
    text-align: right;
    display: initial;
    position: absolute;
    bottom: 64px;
    right: 4px;
    overflow: hidden;
    box-shadow: 0px 3px 10px 0px rgba(50, 50, 50, 0.5);
    z-index: 10;
    background: linear-gradient(var(--quadary-color), var(--secondary-color));
  }

  li {
    position: relative;
    list-style: none;
    cursor: pointer;
    padding: 0 8px;
    height: 42px;
    line-height: 42px;
    font-size: 1.2em;
    font-weight: 600;
  }
  button {
    background-color: transparent;
    margin: 0.5em 0.25em 0.25em.25em;
    padding: 0;
    border: none;
    color: var(--primary-text-color);
  }
  button {
    border: none;
    padding: 0;
    margin: 0;
    background-color: transparent;
  }
</style>
