import actionTypes from '../actions/constants';
const initialState = {
    activeState: false,
    items: [],
    results: [],
    isReady: false,
    questionId: 0,
    indexReady: false,
    index: 0,
    notFullPriceArr: []
};
export default (state = initialState, action) => {
    switch (action.type) {

        case actionTypes.SET_QUESTIONS:
            return {
                items: action.payload,
                isReady: true,
            };
        case actionTypes.SET_NOT_FULL_PRICE_ARR:
            return {
                notFullPriceArr: action.payload
            };

        case actionTypes.SET_QUESTION_INDEX:

            return {
                indexReady: false,
                index: action.payload
            };

        default:
            return state;
    }
}