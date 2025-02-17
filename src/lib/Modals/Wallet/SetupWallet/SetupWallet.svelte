<script>
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { devMode } from "$/stores";

  onMount(() => {
    if (devMode) {
      window.location =
        "https://getalby.com/oauth?client_id=32dVOIuGiA&response_type=code&redirect_uri=http://localhost:3000&scope=account:read%20balance:read%20payments:send%20invoices:create%20transactions:read";
    } else {
      window.location =
        "https://getalby.com/oauth?client_id=CAVpd6denC&response_type=code&redirect_uri=https://curiocaster.com&scope=account:read%20balance:read%20payments:send%20invoices:create%20transactions:read";
    }
  });
</script>
