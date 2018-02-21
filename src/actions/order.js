export const SET_ORDER = 'SET_ORDER';
export const CLEAR_ORDER = 'CLEAR_ORDER';
export const SET_ORDER_STATUS = 'SET_ORDER_STATUS';

export function login(user) {
	return {
		type: LOGIN,
		user
	}
}

export function logout() {
	return {
		type: LOGOUT
	}
}


export function setNext(next) {
	return {
		type: SET_NEXT,
		next
	}
}

export function resetNext() {
	return {
		type: RESET_NEXT
	}
}
