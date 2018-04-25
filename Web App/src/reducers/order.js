import * as AuthActions from '../actions/order';

const initialState = {
	status: null,
	orderId: null
};

export function order(state = initialState, action) {
	switch (action.type) {
		case AuthActions.SET_ORDER_ID:
			console.log('set order ID');
			return Object.assign({}, state, {
				orderId: action.orderId
			});
		case AuthActions.CLEAR_ORDER_ID:
			return Object.assign({}, state, {
				orderId: null
			});

		case AuthActions.SET_ORDER_STATUS:
			return Object.assign({}, state, {
				status: action.status
			});

		default:
			return state
	}
}