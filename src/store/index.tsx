declare var window: Window & { devToolsExtension: any, __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any };
import { combineReducers, createStore, compose, applyMiddleware } from "redux";
import { routerReducer, RouterState } from "react-router-redux";
// import { combineEpics, createEpicMiddleware } from "redux-observable";
import { routerMiddleware } from "react-router-redux";
import createHistory from "history/createBrowserHistory";

export const history = createHistory();

export type RootState = {
  routing: RouterState;
  // currencyRates: CurrencyRatesState;
  // currencyConverter: CurrencyConverterState;
};

const rootReducer = combineReducers<RootState>({
  routing: routerReducer,
});

// rehydrating state on app start: implement here...
const recoverState = (): RootState => ({} as RootState);

// const rootEpic = combineEpics(
//   // currencyConverterEpics,
// );
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  rootReducer,
  recoverState(),
  // composeEnhancers(
    // applyMiddleware(createEpicMiddleware(rootEpic)),
    applyMiddleware(routerMiddleware(history))
  // ),
);
export type Store = {
  getState: () => RootState,
  dispatch: Function,
};
