export const teamMembers = (team: { name: string }[]): string =>
	team.map((player) => player.name).join(' & ');

/**
 * skipPoints calculates amount of points to give to players skipping a round.
 */
export const skipPoints = (pointsPerGame: number) => Math.ceil(pointsPerGame / 2);
