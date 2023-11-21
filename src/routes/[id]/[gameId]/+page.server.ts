import prisma from '$lib/prisma';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

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

export const actions = {
	default: async ({ request, params: { id, gameId } }) => {
		const data = await request.formData();

		// Remove previous score from user, if first time adding will remove 0
		const game = await prisma.game.findFirstOrThrow({
			where: { id: gameId }
		});

		const score1str = data.get('score1');
		const score2str = data.get('score2');
		if (!score1str || typeof score1str !== 'string' || !score2str || typeof score2str !== 'string')
			return fail(400, { error: 'missing required score' });
		const score1 = parseInt(score1str);
		const score2 = parseInt(score2str);

		// reset if points are already given
		if (game.score1 !== 0 && game.score2 !== 0) {
			await Promise.all([
				...game.team1.map((playerId) =>
					prisma.player.update({
						where: { id: playerId },
						data: {
							points: { decrement: game.score1 ?? 0 },
							numberOfGames: { decrement: 1 }
						}
					})
				),
				...game.team2.map((playerId) =>
					prisma.player.update({
						where: { id: playerId },
						data: {
							points: { decrement: game.score2 ?? 0 },
							numberOfGames: { decrement: 1 }
						}
					})
				)
			]);
		}

		// Update game and players
		await prisma.game.update({
			where: { id: gameId },
			data: { score1, score2 }
		});

		await Promise.all([
			...game.team1.map((playerId) =>
				prisma.player.update({
					where: { id: playerId },
					data: {
						points: { increment: score1 ?? 0 },
						numberOfGames: { increment: 1 }
					}
				})
			),
			...game.team2.map((playerId) =>
				prisma.player.update({
					where: { id: playerId },
					data: {
						points: { increment: score2 ?? 0 },
						numberOfGames: { increment: 1 }
					}
				})
			)
		]);

		throw redirect(303, `/${id}`);
	}
} satisfies Actions;
