<script lang="ts">
	import { page } from '$app/stores';
	import { skipPoints } from '$lib/util';
	export let data: PageData;
	const courts = Object.entries(data.courts);
</script>

<h1>Skapa nya matcher</h1>

<form method="POST" action="?/start">
	{#each courts as [court, players]}
		<div>
			<h2>{court}</h2>
			<p>{players.map((p) => p.name).join(', ')}</p>
			{#each players as courtPlayer, idx}
				<select name={`${court}-team${idx < players.length / 2 ? 1 : 2}`}>
					{#each data.allPlayers as player}
						{#if courtPlayer.id === player.id}
							<option value={player.id} selected>{player.name}</option>
						{:else}
							<option value={player.id}>{player.name}</option>
						{/if}
					{/each}
				</select>
				{#if idx + 1 === players.length / 2}
					<span style="margin: 0 6px 0 4px">mot</span>
				{/if}
			{/each}
		</div>
	{/each}

	{#if data.missingRound.length > 0}
		<h2>Missar denna runda</h2>
		<p>
			{data.missingRound.map((p) => p.name).join(', ')}
		</p>
	{/if}

	<input type="submit" value="lås in matcher" />
</form>

<p>
	Notera att alla som står över denna match kommer bli tilldelade {skipPoints(data.pointsPerGame)}p
</p>
