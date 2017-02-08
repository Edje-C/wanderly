import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import promise from 'redux-promise-middleware';
import thunk from 'redux-thunk';

//import allreducers from reducers folder
import allReducers from '../reducers'

const middleware = applyMiddleware(logger(), promise(), thunk);

const store = createStore(allReducers, middleware);


//export store for use in the entry file
export default store;