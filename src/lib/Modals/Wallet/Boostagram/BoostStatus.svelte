<script>
  import { fade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  import { showBoostStatus } from '$/stores';
  // $showBoostStatus = true;

  function grow(node, { duration }) {
    setTimeout(() => ($showBoostStatus = false), duration);
    return {
      duration,
      css: (t) => {
        const eased = cubicOut(t);

        return `
					transform: scale(${eased}) ;	`;
      },
    };
  }
</script>

{#if $showBoostStatus}
  <div
    class="centered"
    in:grow={{ duration: 1000 }}
    out:fade={{ duration: 750 }}
  >
    <span class="boost-sent">Boost Sent</span>
  </div>
{/if}

<style>
  .centered {
    position: absolute;
    left: 50%;
    top: 25%;
    transform: translate(-50%, -50%);
    z-index: 9999;
  }

  .boost-sent {
    position: absolute;
    font-size: 4em;
    color: black;
    transform: translate(-50%, -50%);
    text-align: center;
    font-weight: 700;
    background-color: white;
    padding: 0.5em;
    border-radius: 4em;
    box-shadow: 0px 0px 15px 5px #333, 0px 0px 3px 0px #000000;
  }
</style>
