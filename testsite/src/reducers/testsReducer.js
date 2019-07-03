const initialState = {
    isReady: false,
    isReadyToPass: false,
    items: null,
    variantsCount: 0,
    testType: 'first',
    activePage: 'showTests',
    passingTest: null,
    passingTestResults: null,
    passingTestContent: null,

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
                passingTest: action.payload,
                passingTestResults: eval(action.payload.test_check_sum),
                passingTestContent: (action.payload.test_content),
                isReadyToPass: true
            };
        case 'CLEAR_PASSING_TEST':
            return {
                ...state,
                passingTest: null,
                passingTestResults: null,
                passingTestContent: null,
                isReadyToPass: false
            };
        case 'SAVE_VARIANT_STATE':
            return {
                ...state,
                passingTestContent: action.payload,
            };
        case 'SET_VARIANTS_COUNT':
            return {
                ...state,
                variantsCount: action.payload,
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