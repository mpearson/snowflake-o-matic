import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import { MainLayout } from './layouts/main-layout';
import { SnowflakeEditor } from './containers/snowflake-editor';
// import { HomeContainer } from './containers/home-container/index';
import NotFoundContainer from './containers/not-found/index';

import { store } from './store/index';

import "./theme/index.less";

// switch between browser history or hash history
import { browserHistory } from 'react-router';
const history = syncHistoryWithStore(browserHistory, store) as any;
// import { hashHistory } from 'react-router';
// const history = syncHistoryWithStore(hashHistory, store) as any;

function App() {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Route component={MainLayout}>
          <Route path="/" component={SnowflakeEditor} />
          <Route path="*" component={NotFoundContainer} />
        </Route>
      </Router>
    </Provider>
  );
}

export const app = ReactDOM.render(
  <App />, document.getElementById('app-container'),
);
