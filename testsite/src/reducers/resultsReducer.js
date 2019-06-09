const initialState = {
    results: [],
};
export default (state = initialState, action) => {
    switch (action.type) {

        case 'SET_RESULTS':
            return {
                results: action.payload,
            };
        default:
            return state;
    }
}