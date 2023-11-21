<script lang="ts">
	import { page } from '$app/stores';
	import Standings from './Standings.svelte';
	export let data: PageData;
	export let form: ActionData;

	const teamMembers = (team: { name: string }[]): string =>
		team.map((player) => player.name).join(' & ');
</script>

<h1>Turnering</h1>
<p>Antal poäng per match: {data.pointsPerGame}p</p>

<h2>Spelare</h2>
<Standings players={data.players} />

<h2>Matcher</h2>
<a href={`${$page.url.pathname}/new`}>Ny match</a>

<ul>
	{#each data.games as match}
		<li>
			<strong>{match.courtName}</strong>: {teamMembers(match.team1)} vs. {teamMembers(match.team2)}
		</li>
	{/each}
</ul>

<h2>Planer</h2>
<ul>
	{#each data.courts as court (court.id)}
		<li>
			{court.name} - {court.numberOfPlayers} spelare
		</li>
	{/each}
</ul>

<h2>Lägg till spelare</h2>
<form method="POST" action="?/addPlayer">
	<label>
		Namn:
		<input type="string" name="name" />
	</label>
	<input type="submit" value="lägg till" />
</form>
{#if form?.action === 'addPlayer'}
	<p>Kunde inte lägga till spelare: {form.error}</p>
{/if}

<h2>Lägg till bana</h2>
<form method="POST" action="?/addCourt">
	<label>
		Namn:
		<input type="string" name="name" required />
	</label>
	<label>
		Antal spelare på banan
		<input type="number" name="players" min="2" step="1" required />
	</label>
	<input type="submit" value="lägg till" />
</form>
{#if form?.action === 'addCourt'}
	<p>Kunde inte lägga till plan: {form.error}</p>
{/if}
