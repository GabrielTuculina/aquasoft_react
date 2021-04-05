import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import EmployeesComponent from './Employees';
import HomeComponent from './Home';

function RouterComponent() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/projects/:id">
                    <EmployeesComponent />
                </Route>
                <Route exact path="/">
                    <HomeComponent />
                </Route>
                <Route render={() => <Redirect to="/" />} />
            </Switch>
        </BrowserRouter>
    );
}

export default RouterComponent;