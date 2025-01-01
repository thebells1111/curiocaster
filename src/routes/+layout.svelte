<script>
  import DesktopViewer from "$lib/Viewers/DesktopViewer/DesktopViewer.svelte";
  import MobileViewer from "$lib/Viewers/MobileViewer/MobileViewer.svelte";
  import Loader from "$lib/Loader/Loader.svelte";
  import Disclaimer from "$lib/Modals/Disclaimer/DisclaimerModal.svelte";
  import Wallet from "$lib/Modals/Wallet/Wallet.svelte";
  import ShareClip from "$lib/Modals/ShareClip/ShareClip.svelte";
  import OPML from "$lib/Modals/OPML/OPMLModal.svelte";
  import Preferences from "$lib/Modals/Preferences/Preferences.svelte";
  import PendingEpisodes from "$lib/Modals/PendingEpisodes/PendingEpisodesModal.svelte";
  import { onMount } from "svelte";
  import { page } from "$app/stores";

  import {
    showMobile,
    showPending,
    deviceType,
    loggedIn,
    satBalance,
    userState,
    remoteServer,
    walletValueBlock,
  } from "$/stores";
  import "../app.css";
  let mounted = false;

  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      console.log(code);
      const url = new URL(window.location.href);
      let constructedUrl = `${url.protocol}//${url.host}${url.pathname}`;
      constructedUrl = constructedUrl.endsWith("/")
        ? constructedUrl.slice(0, -1)
        : constructedUrl;

      fetch(
        remoteServer +
          "api/alby/auth?code=" +
          code +
          "&redirect_uri=" +
          constructedUrl,
        {
          credentials: "include",
        }
      ).then(async (res) => {
        let data = await res.text();
        try {
          let user = JSON.parse(data);
          console.log(user);
          if (user.lightning_address) {
            $loggedIn = true;
            $userState.wallet.address = {};
            $userState.wallet.address.keysend_custom_key =
              user.keysend_custom_key;
            $userState.wallet.address.keysend_custom_value =
              user.keysend_custom_value;
            $userState.wallet.address.keysend_pubkey = user.keysend_pubkey;
            $userState.wallet.address.lightning_address =
              user.lightning_address;
          }

          if (user.balance) {
            $satBalance = user.balance;
          }
          window.history.replaceState(null, null, window.location.origin);
        } catch (error) {
          console.log(data);
        }
      });
    } else {
      console.log("refresh");
      fetch(remoteServer + "api/alby/refresh", {
        credentials: "include",
      }).then(async (res) => {
        let data = await res.text();
        try {
          let user = JSON.parse(data);
          if (user.lightning_address) {
            $loggedIn = true;
            $userState.wallet.address = {};
            $userState.wallet.address.keysend_custom_key =
              user.keysend_custom_key;
            $userState.wallet.address.keysend_custom_value =
              user.keysend_custom_value;
            $userState.wallet.address.keysend_pubkey = user.keysend_pubkey;
            $userState.wallet.address.lightning_address =
              user.lightning_address;
          }
          if (user.balance) {
            $satBalance = user.balance;
          }
        } catch (error) {
          console.log("error: ", error);
        }
      });
    }
    mounted = true;
    const mediaQueryHandler = (e) => {
      // Reset mobile state
      if (Math.max(window.innerHeight, window.innerWidth) < 900) {
        $showMobile = true;
      } else if (window.innerHeight < 500) {
        $showMobile = true;
      } else {
        $showMobile = false;
      }

      $deviceType = getType();
      console.log($deviceType);

      navigator.serviceWorker &&
        navigator.serviceWorker
          .register("/serviceworker.js")
          .then(function (registration) {});
    };

    const widthListener = window.matchMedia(
      `(max-width: ${Math.min(window.innerHeight, window.innerWidth)}px)`
    );

    mediaQueryHandler(widthListener);

    try {
      // Chrome & Firefox
      widthListener.addEventListener("change", mediaQueryHandler);
    } catch (e1) {
      try {
        // Safari
        widthListener.addListener(mediaQueryHandler);
      } catch (e2) {
        console.error(e2);
      }
    }
  });

  function getType() {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return "tablet";
    } else if (
      /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        ua
      )
    ) {
      return "mobile";
    }
    return "desktop";
  }

  $: route = $page.route.id;
  console.log(route);
</script>

{#if route !== "/player"}
  <slot />
  <Loader />

  <main class:show={mounted}>
    {#if $showMobile}
      <MobileViewer />
    {:else}
      <DesktopViewer />
    {/if}
  </main>

  <Disclaimer />

  <Wallet />

  <ShareClip />
  <OPML />

  <Preferences />

  {#if $showPending}
    <PendingEpisodes />
  {/if}
{:else}
  <div>
    <slot />
  </div>
{/if}

<style>
  main {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    display: none;
  }

  .show {
    display: initial;
  }

  div {
    display: grid;
    place-content: center;
    width: 100%;
    height: 100%;
    background-color: var(--secondary-color);
  }
</style>
