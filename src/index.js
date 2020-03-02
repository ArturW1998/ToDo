import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory, IndexRoute, Redirect } from 'react-router';
import store from './store';
import App from './containers/app/app.js';
import UsersList from './containers/users-list/users-list';
import Todo from './containers/todo/todo';
import ErrorPage from './components/error-page/error-page';
import TaskConfig from './containers/task-config/task-config';
import './styles/main.scss';

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={UsersList} />
        <Redirect from="users" to="/" />
        <Route path="users/:alias">
          <IndexRoute component={Todo} />
          <Route path="tasks/:id" component={TaskConfig} />
        </Route>
        <Route path="*" component={ErrorPage} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
