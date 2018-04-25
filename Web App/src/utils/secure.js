import { setNext } from '../actions/auth';
import {fire} from '../Firebase'


export function requireAuth(store) {
	return function (nextState, replace) {
		if (fire.auth().currentUser === null) {
			store.dispatch(setNext(nextState.location.pathname));
			replace({
				pathname: '/login',
			})
		}
	}
}


