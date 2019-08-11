import actionTypes from '../actions/constants';
const initialState = {
    questionMinutes: 0,
    questionSeconds: 0,
    questionGroupMinutes: 0,
    questionGroupSeconds: 0,
    groupsObject: {}
};
export default (state = initialState, action) => {
    switch (action.type) {

        case actionTypes.SET_TIMER:
            return {
                ...state,
                questionMinutes: action.payload[0],
                questionSeconds: action.payload[1],
            };

        case actionTypes.SET_GROUP_TIMER:
            return {
                ...state,
                questionGroupMinutes: action.payload[0],
                questionGroupSeconds: action.payload[1],
            };
        case actionTypes.SET_GROUP_OBJECT:
            return {
                ...state,
                groupsObject: action.payload
            };
        default:
            return state;
    }
}