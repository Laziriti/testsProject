import { combineReducers } from 'redux';
import tests from './testsReducer' ;
import filter from './filterReducer';
import questions from './questionsReducer';
import results from './resultsReducer'
//import { routerReducer } from 'react-router-redux';
import {reducer as formReducer} from 'redux-form';

export default combineReducers({
    tests,
    results,
    filter,
    questions,
    form: formReducer
});