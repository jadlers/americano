import prisma from '$lib/prisma';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const response = await prisma.tournament.findMany();
	return { tournaments: response };
};

export const actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const ppg = data.get('points');
		if (!ppg) return fail(400, { error: 'missing pointsPerGame' });
		const pointsPerGame = parseInt(ppg.toString());
		if (!pointsPerGame) return fail(400, { error: 'pointsPerGame not a number' });
		const tournament = await prisma.tournament.create({ data: { pointsPerGame } });
		console.log('create new tournament', tournament);

		return { id: tournament.id, tournament };
	}
} satisfies Actions;
