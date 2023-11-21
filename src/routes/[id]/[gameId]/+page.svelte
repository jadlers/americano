<script lang="ts">
	import { teamMembers } from '$lib/util';
	export let data: PageLoad;
</script>

<h1>Match {data.game.id}</h1>

<form method="POST">
	<label>
		<input name="score1" type="number" min="0" value={data.game.score1} />
		{teamMembers(data.team1)}
	</label>
	<br />
	vs.
	<br />
	<label>
		<input name="score2" type="number" min="0" value={data.game.score2} />
		{teamMembers(data.team2)}
	</label>
	<br />
	<input type="submit" value="skicka in" />
</form>
