// NPM dependencies
import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'

// Local dependencies
import Session from '../core/session'
import { calcPerc, decodeHtml } from '../util/helpers'
import { speak } from '../util/speech'

export default class ResultsPage extends Component {

  constructor(props) {
		super(props)

		this.state = {
			perc: calcPerc(this.props.score.correct, this.props.score.total),
			redirect: null,
      loadingGame: false
		}

    this.loadGame = this.loadGame.bind(this)
  }

  componentWillMount() {
  	const { score } = this.props
  	const speechText = `Game complete... You scored ${score.correct} out of ${score.total}, which is ${this.state.perc} percent accuracy... Would you like to play again?`

  	speak(speechText)
  }

  async loadGame() {
    this.setState({ loadingGame: true })

    try {
      const gameId = await Session.newGame()
      
      // update state for redirect
      this.setState({
        loadingGame: false,
        redirect: gameId,
        error: null
      })
    } catch(e) {
      this.setState({
        error: e.message,
        loadingGame: false
      })
    }
  }

  renderQuestionList() {
    return this.props.questions.map((item, index) => {
      return (
        <div className={`answer-result-item ${item.correct ? 'correct' : 'incorrect'}`} key={index}>
         <i className={`icon fa fa-${item.correct ? 'plus' : 'minus'}`}></i> { decodeHtml(item.question) }
        </div>
      )
    })
  }

  renderError() {
    if (!this.state.error) return null;
    return <div className="error">{this.state.error}</div>
  }

	render() {
  	// send user to first question page after the game data has loaded
    if (this.state.redirect) return <Redirect to={`/${this.state.redirect}/question/1`} />;

    const { score } = this.props

    return (
      <div className="container results-page">
         <center>
         	<h1>Game complete!</h1>
         		<h3>Your scored {score.correct}/{score.total} ({this.state.perc}%)</h3>
         		<div className="answer-result-list">
              { this.renderQuestionList() }
            </div>
         		<button 
            disabled={this.state.loadingGame}
            onClick={this.loadGame} 
            className="play-button two-row">Play<br/>Again</button>
            { this.renderError() }
         		<br/>
         		<Link to='/' className="silent-button">No thanks</Link>
         </center>
      </div>
		)
	}

}


