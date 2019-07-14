const initialState = {
    isReady: false,
    isReadyToPass: false,
    items: null,
    variantsCount: 0,
    testType: null,
    activePage: 'showTests',
    passingTest: null,
    passingTestResults: null,
    passingTestContent: null,
    groups_object: null,
    editTest: null,
    editTestResults: null,
    editTestContent: null,
    editTestState: false

};
export default (state = initialState, action) => {
    switch (action.type) {
        case 'SET_TESTS':
            return {
                ...state,
                items: action.payload,
                isReady: true,
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
                groups_object: JSON.parse(action.payload.test_groups_object),
                isReadyToPass: true
            };
        case 'CLEAR_PASSING_TEST':
            return {
                ...state,
                passingTest: null,
                passingTestResults: null,
                passingTestContent: null,
                groups_object: null,
                isReadyToPass: false
            };

        case 'SET_EDIT_TEST':
            return {
                ...state,
                editTest: action.payload,
                editTestResults: eval(action.payload.test_check_sum),
                editTestContent: eval(action.payload.test_content),
                groups_object: JSON.parse(action.payload.test_groups_object),
                editTestState: true
            };
        case 'CLEAR_EDIT_TEST':
            return {
                ...state,
                editTest: null,
                editTestResults: null,
                editgTestContent: null,
                groups_object: null,
                editTestState: false
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