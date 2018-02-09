import React from 'react';
import ReactDOM from 'react-dom';
import {AppContainer} from 'react-hot-loader';
import App from './core/App';
import {BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux';
import configureStore from './core/store/configureStore';


import "../public/styles/govuk-template.css";
import "../public/styles/fonts.css";
import '../public/styles/app.css'
import '../public/styles/app.less';

const store = configureStore();


const renderApp = (App) => {
    ReactDOM.render(
        <Provider store={store}>
            <div>
                <AppContainer>
                    <BrowserRouter>
                        <App/>
                    </BrowserRouter>
                </AppContainer>
            </div>
        </Provider>,
        document.getElementById('root'),
    );
};

renderApp(App);

// Hot Module Replacement API
if (module.hot) {
    module.hot.accept('./core/App', () => renderApp(App));
}