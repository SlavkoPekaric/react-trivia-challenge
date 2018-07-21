// NPM dependencies
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

// Local dependencies
import Session from '../core/session'
import { config } from '../config'

export default class Home extends Component {

  constructor(props) {
		super(props)

		this.state = {
      gameType: null,
      gameDifficulty: null,
      redirect: false,
      loadingGame: false,
      error: null
    }

    this.gameSessionId = null
    this.loadGame = this.loadGame.bind(this)
  }

  async loadGame() {
    this.setState({ loadingGame: true })

    try {
      const gameId = await Session.newGame({
        difficulty: this.state.gameDifficulty,
        type: this.state.gameType
      })
      
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

  renderError() {
    if (!this.state.error) return null;
    return <div className="error">{this.state.error}</div>
  }

	render() {
    // send user to first question page after the game data has loaded
  	if (this.state.redirect) return <Redirect push={true} to={`/${this.state.redirect}/question/1`} />;

    const playButtonText = !this.state.loadingGame ? 'Begin' : 'Loading'

    return (
      <div className="container start-page">
        <h1>Welcome to the Trivia Challenge!</h1>
        <h3>You will be presented with {config.defaultQuestionCount} {config.gameTypes[config.defaultGameType].title} questions.</h3>
        <h3>Can you score 100%?</h3>
        <button
          className="play-button"
          disabled={this.state.loadingGame}
          onClick={this.loadGame}>{playButtonText}</button>
        { this.renderError() }
      </div>
		)
	}

}


