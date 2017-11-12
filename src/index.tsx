import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Route, Switch } from "react-router";
import { ConnectedRouter } from "react-router-redux";

import { MainLayout } from "./layouts/main-layout";
import { SnowflakeEditor } from "./containers/snowflake-editor";
import { NotFoundContainer } from "./containers/not-found/index";

import { store, history } from "./store/index";

import "./theme/index.less";

export const app = ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <MainLayout>
        <Switch>
          <Route exact path="/" component={SnowflakeEditor} />
          <Route path="*" component={NotFoundContainer} />
        </Switch>
      </MainLayout>
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root"),
);
