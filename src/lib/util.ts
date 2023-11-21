export const teamMembers = (team: { name: string }[]): string =>
		team.map((player) => player.name).join(' & ');
