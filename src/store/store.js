import { createStore, compose } from 'redux';

import LocalApi from '~/helpers/localApi';

import rootReducer from '~/reducers';

const api = new LocalApi();
const categoriesList = api.getCategories();

const users = api.getUsers();
const tasks = api.getTasks();
const categories = categoriesList;
const activeCategory = categoriesList.length > 0 ? categoriesList[0].alias : 'default';
const userName = '';
const taskText = '';
const categoryName = '';

const defaultState = {
  users,
  tasks,
  categories,
  activeCategory,
  userName,
  taskText,
  categoryName
};

const composeEnhancers =
  process.env.NODE_ENV !== 'production' &&
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : compose;

const configureStore = preloadedState => createStore(rootReducer, preloadedState, composeEnhancers);

const store = configureStore(defaultState);

export default store;
