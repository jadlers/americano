import prisma from '$lib/prisma';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ params: { id } }) => {
	const tournament = await prisma.tournament.findUnique({
		select: { pointsPerGame: true, courts: true, games: true },
		where: { id }
	});
	const players = await prisma.player.findMany({
		where: { tournamentId: id },
		orderBy: { points: 'desc' }
	});
	return { ...tournament, players };
}) satisfies PageServerLoad;

export const actions = {
	addPlayer: async ({ request, params: { id } }) => {
		const data = await request.formData();
		const name = data.get('name');
		if (!name || typeof name !== 'string')
			return fail(400, { addPlayerError: 'invalid new player name' });
		try {
			const tournament = await prisma.tournament.update({
				include: { players: true },
				data: {
					players: {
						create: { name }
					}
				},
				where: { id }
			});
			console.log(tournament);
		} catch (error: any) {
			if (error.code === 'P2002')
				return { action: 'addPlayer', error: 'player already in tournament' };
			console.log(error);
			return fail(500, { error: 'unknown error' });
		}
		return {};
	},
	addCourt: async ({ request, params: { id } }) => {
		const data = await request.formData();
		console.log(data);
		const name = data.get('name');
		if (!name || typeof name !== 'string')
			return fail(400, { addCourtError: 'invalid new player name' });
		const players = parseInt(data.get('players')?.toString() ?? '');
		if (Number.isNaN(players)) return fail(400, { addCourtError: 'invalid number of players' });
		console.log('adding court:', { name, players });
		try {
			const tournament = await prisma.tournament.update({
				include: { players: true },
				data: {
					courts: {
						create: { name, numberOfPlayers: players }
					}
				},
				where: { id }
			});
			console.log(tournament);
		} catch (error: any) {
			if (error.code === 'P2002')
				return { action: 'addCourt', error: 'court already in tournament' };
			console.log(error);
			return fail(500, { error: 'unknown error' });
		}
		return {};
	}
} satisfies Actions;
