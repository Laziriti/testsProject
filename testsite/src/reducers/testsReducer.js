const initialState = {
    isReady: false,
    items: null,
    testType: 'first',
    activePage: 'showTests',
    passingTest: null

};
export default (state = initialState, action) => {
    switch (action.type) {
        case 'SET_TESTS':
            return {
                ...state,
                items: action.payload,
                isReady: true,
            };

        case 'SET_PAGE':
            return {
                ...state,
                activePage: action.payload,
            };

        case 'SET_IS_READY':
            return {
                ...state,
                isReady: action.payload
            };

        case 'SET_TEST_TYPE':
            return {
                ...state,
                testType: action.payload
            };

        case 'SET_PASSING_TEST':
            return {
                ...state,
                passingTest: action.payload
            };
        case 'ADD_TESTS':
            return {
                items: [
                    ...state,
                    action.payload
                ]
            }

        default:
            return state;
    }
}