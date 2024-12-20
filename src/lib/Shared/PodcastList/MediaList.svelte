<script>
	import SubscriptionList from './SubscriptionList.svelte';
	import MediaSelect from './MediaSelect.svelte';
	import MusicList from './MusicList.svelte';

	import { selectedMediaType } from '$/stores';
</script>

{#if $selectedMediaType === 'podcast'}
	<SubscriptionList />
{:else if $selectedMediaType === 'music'}
	<MusicList />
{/if}
