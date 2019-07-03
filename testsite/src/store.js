import { createStore, applyMiddleware, compose } from 'redux';
import logger from 'redux-logger';
import rootReducer from './reducers/indexReducer';
import { composeWithDevTools } from 'redux-devtools-extension';
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const Store = createStore(

    rootReducer,
    composeEnhancers(
        applyMiddleware(
            /* ----  middlewares ----  */
        )
    )
);



