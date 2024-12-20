<script>
	import { playerDuration, isPlayerLoaded, playingEpisode } from '$/stores';
	import convertTime from '$functions/convertTime';
	$: time = convertTime($playerDuration) || '';
</script>

<div>
	{$playerDuration && !($playingEpisode.liveStatus === 'live') ? time : ''}
</div>
