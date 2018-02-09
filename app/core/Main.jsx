import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom';
import BPMNPage from '../pages/bpmnpage/components/BPMNPage';
import CMMNPage from '../pages/cmmnpage/components/CMMNPage';
import DMNPage from '../pages/dmnpage/components/DMNPage';

const Main = () => (
    <main>
        <Switch>
            <Route name="BPMN" exact path='/bpmn' component={BPMNPage} />
            <Route name="CMMN" exact path='/cmmn' component={CMMNPage}/>
            <Route name="DMN" exact path='/dmn' component={DMNPage}/>
            <Redirect to="/bpmn" />
        </Switch>
    </main>
);

export default Main