import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

import { home, login, dashboard } from './pages';

class App extends React.Component {
	render() {
		return (
			<div>
				<Router>
					<Switch>
						<Route exact path='/' component={home} />
						<Route path='/user/dashboard' component={dashboard} />
						<Route exact path='/login' componen={login} />
					</Switch>
				</Router>
				<h1>Hello Test</h1>
			</div>
		);
	}
}

export default App;
