<script>
	import convertTime from '$functions/convertTime';

	import { playerTime, playerDuration } from '$/stores';
</script>

<div>
	{$playerDuration ? `${convertTime($playerDuration)}` : ''}
</div>
