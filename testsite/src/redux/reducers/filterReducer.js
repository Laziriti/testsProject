import actionTypes from '../actions/constants';
const initialState = {
    searchQuery: '',
    filterBy: 'All',

};
export default (state = initialState, action) => {

    switch (action.type) {

        case actionTypes.SET_QUERY:
        return {
            ...state,
            searchQuery: action.payload,
        };
    
        case actionTypes.SET_FILTER:
            return {
                ...state,
                filterBy: action.payload,
            };


        default:
            return state;
    }
}