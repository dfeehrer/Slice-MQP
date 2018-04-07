export const SET_ORDER_ID = 'SET_ORDER_ID';
export const CLEAR_ORDER_ID = 'CLEAR_ORDER_ID';
export const SET_ORDER_STATUS = 'SET_ORDER_STATUS';

export function setOrderId(orderId) {
	return {
		type: SET_ORDER_ID,
        orderId
	}
}

export function clearOrderId() {
	return {
		type: CLEAR_ORDER_ID
	}
}

export function setOrderStatus(status) {
    return {
        type: SET_ORDER_STATUS,
		status
    }
}