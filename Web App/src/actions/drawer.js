export const OPEN = 'OPEN';
export const CLOSE = 'CLOSE';

export function openDrawer() {
	return {
		type: OPEN
	}
}

export function closeDrawer() {
	return {
		type: CLOSE
	}
}