import {
  configureStore,
  createListenerMiddleware,
  ListenerMiddlewareInstance,
} from "@reduxjs/toolkit";
import { createHashHistory } from "history";
import {
  TypedUseSelectorHook,
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
} from "react-redux";
import { createReduxHistoryContext } from "redux-first-history";
import { persistStore } from "redux-persist";

import { apiMiddleware, apiReducer, apiReducerPath } from "@/api";

import { PartyReducer } from "./PartyReducer";

const { createReduxHistory, routerMiddleware, routerReducer } =
  createReduxHistoryContext({
    history: createHashHistory(),
  });

const listenersMiddleware = createListenerMiddleware();

export const store = configureStore({
  reducer: {
    router: routerReducer,
    [apiReducerPath]: apiReducer,
    party: PartyReducer,
  },
  middleware(defaultMiddlewares) {
    return defaultMiddlewares()
      .concat(routerMiddleware)
      .concat(apiMiddleware)
      .prepend(listenersMiddleware.middleware);
  },
});

export const history = createReduxHistory(store);
export const persistor = persistStore(store);

export type TrismegistusState = ReturnType<typeof store.getState>;
export type TrismegistusDispatch = typeof store.dispatch;
export type TrismegistusListeners = ListenerMiddlewareInstance<
  TrismegistusState,
  TrismegistusDispatch
>;

export const listeners = listenersMiddleware as TrismegistusListeners;
export const useDispatch: () => TrismegistusDispatch = useReduxDispatch;
export const useSelector: TypedUseSelectorHook<TrismegistusState> =
  useReduxSelector;
