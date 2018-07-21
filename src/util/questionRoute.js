// NPM dependencies
import React from 'react'
import { Route } from 'react-router-dom'

// Local dependencies
import Session from '../core/session'
import NotFound from '../components/notFound'

export const QuestionRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => {
  	const { gameId } = props.match.params
  	const questionIndex = Number(props.match.params.questionNum) - 1
  	
  	// validate game existance
  	const game = Session.getCurrentGame(gameId)
  	const access = Session.validateQuestionPage(gameId, questionIndex, game)

    if (!access) return <NotFound />;

    // append game data to props
    const nextStep = Session.getNextStep(questionIndex, game)
    let nextStepVal = `/${gameId}/`
    
    if (typeof nextStep === 'number') {
      nextStepVal += `question/${nextStep}`
    } else if (typeof nextStep === 'string') {
      nextStepVal += nextStep
    }

    props.nextStep = nextStepVal
    props.total = Object.keys(game.questions).length
    props.data = game.questions[questionIndex]
		
    return <Component key={`${gameId}-${questionIndex}`} {...props} />
  }} />
)

// http://localhost:3000/75caaaae-2e4e-44d8-aa78-0c2f00a124fb/question/3