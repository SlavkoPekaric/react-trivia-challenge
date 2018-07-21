// NPM dependencies
import React from 'react'
import { Route } from 'react-router-dom'

// Local dependencies
import Session from '../core/session'
import NotFound from '../components/notFound'

export const ResultsRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => {
  	const { gameId } = props.match.params
  	const game = Session.getCurrentGame(gameId)
    const completion = Session.isGameComplete(gameId, game)

    // redirect to a 404 if game was not found
    if (!completion || !completion.complete) return <NotFound />;

		// append score data to props
		props.score = {
			correct: completion.correctAnswers,
			total: completion.total
		}
    props.questions = game.questions
		
		return <Component {...props} />
  }} />
)

