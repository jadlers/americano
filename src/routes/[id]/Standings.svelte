<script lang="ts">
	export let players;
</script>

<table>
	<thead>
		<tr>
			<td>Poäng</td>
			<td>Namn</td>
			<td>Matcher</td>
		</tr>
	</thead>
	<tbody>
		{#each players as player (player.id)}
			<tr>
				<td class="right-align">{player.points}p</td>
				<td>{player.name}</td>
				<td class="right-align">{player.numberOfGames}</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	table,
	td {
		border: 1px solid #333;
		border-collapse: collapse;
		padding: 4px;
	}

	thead,
	tfoot {
		background-color: #333;
		color: #fff;
	}

	.right-align {
		text-align: right;
	}
</style>
