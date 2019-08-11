import actionTypes from './constants';
export const changeTestType = (testType) => ({
    type: actionTypes.SET_TEST_TYPE,
    payload: testType
})