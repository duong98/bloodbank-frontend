/**
 * @author DucPL
 */

import ActionType from "../ActionTypes";

// a place to store common variables, and we change these vars by calling different Action functions.
const LoginReducer = (
    state = {
        userName: "",
        email: "",
        userType: "",
        userId: "",
        address: "",
        dob: 0,
        blood_type: ""
    },
    action
) => {
    const { type, payload } = action;
    switch (type) {
        case ActionType.LOGIN:
            return {
                ...state,
                userName: payload.name,
                email: payload.email,
                userId: payload.userId,
                userType: payload.userType,
                address: payload.address ? payload.address : "",
                dob: payload.dob ? payload.dob : 0,
                blood_type: payload.blood_type ? payload.blood_type : "",
            };
        case ActionType.LOGOUT:
            return {
                ...state,
                userType: "",
                email: "",
                userId: "",
                userName: "",
                address: "",
                dob: 0,
                blood_type: "",
            };
        default:
            return state;
    }
};

export default LoginReducer;
