import actionTypes from './constants';
export const saveVariantState = (variant) => ({
    type: actionTypes.SAVE_VARIANT_STATE,
    payload: variant
})