import actionTypes from './constants';
export const setIndexOfQuestion = (index) => ({
    type: actionTypes.SET_QUESTION_INDEX,
    payload: index
})