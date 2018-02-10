import React from 'react';
import {withRouter} from 'react-router-dom';


const Header = (props) => {
    const currentRoute = props.location.pathname;
    return <div>
        <header role="banner" id="global-header" className="with-proposition">
            <div className="header-wrapper">
                <div className="header-global">
                    <div className="header-logo">
                        <a href="https://www.gov.uk/government/organisations/border-force"
                           title="Go to the UK Border Force Homepage" id="logo" className="content">
                            <img src="/img/gov.uk_logotype_crown_invert_trans.png?0.23.0" width="36" height="32"
                                 alt="UK Border Force Logo"/> UK Border Force
                        </a>
                    </div>
                </div>
                <div className="header-proposition">
                    <div className="content">
                        <a href="#proposition-links" className="js-header-toggle menu">Menu</a>
                        <nav id="proposition-menu">
                            <a id="proposition-name" onClick={() => props.history.replace('home')}>Process
                                Modeler</a>
                            <ul id="proposition-links">
                                <li style={{ cursor: 'pointer'}}><a onClick={() => props.history.replace('bpmn')}
                                                                    className={currentRoute === '/bpmn' ? 'active' : ''}>BPMN</a></li>
                                <li style={{ cursor: 'pointer'}}><a onClick={() => props.history.replace('cmmn')}
                                                                    className={currentRoute === '/cmmn' ? 'active' : ''}>CMMN</a></li>
                                <li style={{ cursor: 'pointer'}}><a onClick={() => props.history.replace('dmn')}
                                                                    className={currentRoute === '/dmn' ? 'active' : ''}>DMN</a></li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    </div>
}

export default withRouter(Header);