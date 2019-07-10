const initialState = {
    isReady: false,
    items: null,
    filterBy: 'All',
    activePage: 'showTests',
    superpuper: 'Vot tak vot'

};
export default (state = initialState, action) => {
    switch (action.type) {
        case 'SET_TESTS':
            return {
                ...state,
                items: action.payload,
                isReady: true,
            };

        case 'SET_FILTER':
            return {
                ...state,
                filterBy: action.payload,
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