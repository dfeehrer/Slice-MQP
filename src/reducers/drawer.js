import * as DrawerActions from '../actions/drawer';

const initialState = {
	open: false,
};

export function drawer(state = initialState, action) {
	switch (action.type) {
		case DrawerActions.OPEN:
			return Object.assign({}, state, {
				open: true
			});
		case DrawerActions.CLOSE:
			return Object.assign({}, state, {
				open: false
			});
		default:
			return state
	}
}