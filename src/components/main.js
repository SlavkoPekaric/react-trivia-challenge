// NPM dependencies
import React, { Component } from 'react'
import {
	Switch,
	Route
} from 'react-router-dom'

// Local dependencies
import { QuestionRoute } from './../util/questionRoute'
import { ResultsRoute } from './../util/resultsRoute'

import Home from './home'
import QuestionPage from './questionPage'
import ResultsPage from './resultsPage'
import NotFound from './notFound'

export default class Main extends Component {

	constructor(props) {
		super(props)

		this.state = {}
	}

	render() {
		return (
			<div className="main-container">
				<Switch>
					<Route exact path="/" component={Home}/>
					<QuestionRoute exact path="/:gameId/question/:questionNum" component={QuestionPage}/>
					<ResultsRoute exact path="/:gameId/results" component={ResultsPage}/>
					<Route component={NotFound}/>
				</Switch>
			</div>
		)
	}
}

