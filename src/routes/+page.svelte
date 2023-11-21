<script lang="ts">
	export let data: PageData;
	export let form: ActionData;
</script>

<h1>Padel turnering</h1>

<h2>Existerande turneringar</h2>
<ul>
	{#each data.tournaments as tournament}
		<li>
			<a href={`/${tournament.id}`}>{tournament.createdAt.toISOString()} - {tournament.id}</a>
		</li>
	{/each}
</ul>

<h2>Skapa ny</h2>
<form method="POST" action="?/create">
	<label>
		Poäng per spel
		<input name="points" type="number" min="0" step="1" />
	</label>
	<input type="submit" value="skapa" />
</form>
{#if form?.id}
	<p>Ny turnering skapad: <a href={`/${form.id}`}>här</a></p>
{:else if form?.error}
	<p>Fel: {form.error}</p>
{/if}
