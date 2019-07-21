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
        case 'SET_ONE_VARIANT_STATE':
            return {
                isReady: action.payload,
            };

        case 'SET_QUESTIONS':
            return {
                items: action.payload,
                isReady: true,
            };
        case 'SET_NOT_FULL_PRICE_ARR':
            return {
                notFullPriceArr: action.payload
            };

        case 'SET_QUESTION_ID':
            return {
                questionId: action.payload
            };

        case 'SET_QUESTION_INDEX':

            return {
                indexReady: false,
                index: action.payload
            };

        default:
            return state;
    }
}