export const setOneVariantState = (nowState) => ({
    type: 'SET_ONE_VARIANT_STATE',
    payload: nowState,
    
});

export const setQuests = (questions) => ({
    type: 'SET_QUESTIONS',
    payload: questions,
    
});



export const setQuestID = (Id) => ({
    type: 'SET_QUESTION_ID',
    payload: Id,
    
});