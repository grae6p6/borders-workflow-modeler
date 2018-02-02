
import { createStore, } from 'redux';
import { rootReducer } from '../rootReducer';

export default function configureStore(initialState) {
    const store = createStore(rootReducer, initialState);

    if (module.hot) {
        module.hot.accept('../rootReducer', () =>
            store.replaceReducer(require('../rootReducer').rootReducer),
        );
    }

    return store;
}