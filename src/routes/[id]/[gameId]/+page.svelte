<script lang="ts">
	import { teamMembers } from '$lib/util';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<h1>Match {data.game.id}</h1>

<form method="POST">
	<label>
		<input
			name="score1"
			type="number"
			min="0"
			value={data.game.score1 === 0 ? '' : data.game.score1}
		/>
		{teamMembers(
			data.team1.filter((player) => player !== undefined).map((player) => ({ name: player.name }))
		)}
	</label>
	<br />
	vs.
	<br />
	<label>
		<input
			name="score2"
			type="number"
			min="0"
			value={data.game.score2 === 0 ? '' : data.game.score2}
		/>
		{teamMembers(
			data.team2.filter((player) => player !== undefined).map((player) => ({ name: player.name }))
		)}
	</label>
	<br />
	<input type="submit" value="skicka in" />
</form>

{#if form?.error}
	<p style="color: red;">{form.error}</p>
{/if}
