import prisma from '$lib/prisma';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

/**
 * Shuffle an array in place.
 *
 * Taken from: https://stackoverflow.com/a/2450976
 */
const shuffle = <T>(array: T[]): T[] => {
	let current = array.length;
	let random: number;

	// While there remain elements to shuffle.
	while (current > 0) {
		// Pick a remaining element.
		random = Math.floor(Math.random() * current);
		current--;
		// And swap it with the current element.
		[array[current], array[random]] = [array[random], array[current]];
	}

	return array;
};

export const load = (async ({ params: { id } }) => {
	const courts = await prisma.court.findMany({ where: { tournamentId: id } });
	const playersInRound = courts.reduce((acc, curr) => (acc += curr.numberOfPlayers), 0);

	const players = await prisma.player.findMany({
		where: { tournamentId: id },
		orderBy: { numberOfGames: 'asc' }
	});
	const allPlayers = [...players];

	const leastNumberOfGames = players.at(0)?.numberOfGames ?? 0;
	const splitIdx = players.findIndex(({ numberOfGames }) => numberOfGames !== leastNumberOfGames);
	console.log({
		players: players.map(({ name, numberOfGames }) => ({ name, numberOfGames })),
		leastNumberOfGames,
		splitIdx
	});
	let selectedPlayers: any[] = [];
	if (splitIdx === -1) {
		// All at same number of games, shuffle all and draw from top
		selectedPlayers = shuffle(players).splice(0, playersInRound);
	} else {
		selectedPlayers.concat(players.splice(0, splitIdx));
		const remaining = playersInRound - selectedPlayers.length;
		selectedPlayers.concat(shuffle(players).splice(0, remaining));
		shuffle(selectedPlayers);
	}

	const assignedCourts: Record<string, any[]> = {};
	for (const court of courts) {
		assignedCourts[court.name] = selectedPlayers.slice(0, court.numberOfPlayers);
	}

	return {
		allPlayers,
		playersInRound,
		courts: assignedCourts,
		missingRound: players
	};
}) satisfies PageServerLoad;

const getLastRound = async (tournamentId: string) => {
	const { round } = (await prisma.game.findFirst({
		select: { round: true },
		where: { tournamentId },
		orderBy: { round: 'desc' }
	})) ?? { round: 0 };
	return round;
};

export const actions = {
	start: async ({ request, params: { id } }) => {
		const previousRound = (await getLastRound(id)) ?? 0;
		const data = await request.formData();
		const courts: Record<
			string,
			{ round: number; courtName: string; team1: number[]; team2: number[] }
		> = {};
		for (const [courtAndPosition, playerId] of data.entries()) {
			const [court, team] = courtAndPosition.split('-');
			if (!courts[court]) {
				courts[court] = { round: previousRound + 1, courtName: court, team1: [], team2: [] };
			}
			const pid = parseInt(playerId.toString());
			if (Number.isNaN(pid)) return fail(400, { error: 'invalid player id' });
			if (team === 'team1' || team === 'team2') courts[court][team].push(pid);
		}

		for (const court of Object.values(courts)) {
			await prisma.tournament.update({
				where: { id },
				data: {
					games: {
						create: court
					}
				}
			});
		}

		throw redirect(303, `/${id}`);
	}
} satisfies Actions;
