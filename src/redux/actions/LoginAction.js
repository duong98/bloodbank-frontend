import ActionType from '../ActionTypes';

// an object which contains different functions that pass type and payload params for reducers
const LoginAction = {
    logIn: payload => ({ type: ActionType.LOGIN, payload }),
    logOut: () => ({ type: ActionType.LOGOUT }),
}

export default LoginAction;