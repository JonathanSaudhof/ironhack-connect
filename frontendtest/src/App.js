import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

//MUI

//Components

import Navbar from './components/Navbar';

//VIEWS - Pages

import { home, login, dashboard } from './pages';

class App extends React.Component {
	render() {
		return (
			<div>
				<h1>Hello Test</h1>
				<Navbar />

				<Router>
					<Switch>
						<Route exact path='/' component={home} />
						<Route path='/user/dashboard' component={dashboard} />
						<Route exact path='/login' component={login} />
					</Switch>
				</Router>
			</div>
		);
	}
}

export default App;
