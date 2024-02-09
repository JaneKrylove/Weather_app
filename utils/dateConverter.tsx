export function ConvertDate(date: string): string {
	const month = date.slice(5, 7);
	const day = date.slice(8);
	return `${day}/${month}`;
}
