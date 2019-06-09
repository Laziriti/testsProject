import { createStore, applyMiddleware, compose } from 'redux';
import logger from 'redux-logger';
import rootReducer from './reducers/indexReducer';
import { composeWithDevTools } from 'redux-devtools-extension';

export const Store = createStore(

    rootReducer,
    compose(
        applyMiddleware(
            /* ----  middlewares ----  */
        ),
        composeWithDevTools()
    )
);



