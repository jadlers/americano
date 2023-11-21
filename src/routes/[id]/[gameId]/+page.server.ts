import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';

export const load = (async ({ params: { id, gameId } }) => {
	const game = await prisma.game.findFirstOrThrow({
		where: { tournamentId: id, id: gameId }
	});
	const playerIds = game.team1.concat(game.team2);
	const players = await prisma.player.findMany({
		where: { id: { in: playerIds } }
	});
	const team1 = game.team1.map((pid) => players.find((p) => pid === p.id));
	const team2 = game.team2.map((pid) => players.find((p) => pid === p.id));
	return { game, team1, team2 };
}) satisfies PageServerLoad;
