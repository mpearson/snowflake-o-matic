import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import { routerReducer } from 'react-router-redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';

export interface SnowflakeState {
  seedHistory: string[];
  temperature: number;
  altitude: number;
}

// const rootReducer = combineReducers<RootState>({
//   routing: routerReducer,
// });

// // rehydrating state on app start: implement here...
// const recoverState = (): RootState => ({} as RootState);

// const rootEpic = combineEpics(
//   // currencyConverterEpics,
// );
// const epicMiddleware = createEpicMiddleware(rootEpic);
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// export const store = createStore(
//   rootReducer,
//   recoverState(),
//   composeEnhancers(applyMiddleware(epicMiddleware)),
// );
// export type Store = { getState: () => RootState, dispatch: Function };

// // systemjs-hot-reloader hook, rehydrating the state of redux store
// export function __reload(exports: any) {
//   console.log(exports.store.getState());
// }
