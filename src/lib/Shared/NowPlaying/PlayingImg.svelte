<script>
	import Image from '$functions/Image.svelte';
	import { nowPlayingLoaded, posterUrl, showMobile } from '$/stores';

	export let controlImg = false;
	export let imageNode;
</script>

<Image
	alt="Now Playing"
	style={controlImg
		? `margin: 0;	margin-left: 2px;	border-radius: 4px; width: 100%; height: 100%; object-fit: contain;`
		: `width: 100%; height: 100%; max-height: ${$showMobile ? '320px' : '400px'}; max-width: ${
				$showMobile ? '320px' : '400px'
		  }; object-fit: contain; border-radius: 8px;`}
	src={$posterUrl}
	bind:img={imageNode}
/>

<style></style>
