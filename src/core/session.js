// NPM dependencies
import uuid from 'uuid'

// Local dependencies
import API from './api'
import { localStorage } from '../util/localStorage'
import { config } from '../config'

export default class Session {

	static initGame(questions) {
		// clear previous
		this.clearGame()

		const id = uuid()
		const gameData = { id, questions }

		localStorage.setItem('gameId', id)
		localStorage.setItem(id, JSON.stringify(gameData))

		return id
	}

	static async newGame(settings) {
    const game = await API.getGame(settings)

    // check for data errors
    if (game.response_code !== 0 || !game.results || game.results.length !== config.defaultQuestionCount) {
      throw new Error('Error loading game')
    } else {
      // store game and generate uuid
      const gameId = Session.initGame(game.results)
      return gameId
    }
  }

	static clearGame() {
		const gameId = localStorage.getItem('gameId')

		localStorage.removeItem(gameId)
		localStorage.removeItem('gameId')
	}

	static getCurrentGame(id) {
		const gameId = id || localStorage.getItem('gameId')

		try {
			return JSON.parse(localStorage.getItem(gameId))
		} catch(e) {
			return false
		}
	}

	static getAnswer(gameId, questionIndex, g) {
		const game = g || this.getCurrentGame()
		try {
			return !!game.questions[questionIndex].answer
		} catch(e) {
			return false
		}
	}

	static validateGame(gameId, g) {
		const game = g || this.getCurrentGame()
		const valid = game && game.id === gameId && localStorage.getItem('gameId') === gameId
		return valid ? game : false
	}

	static validateQuestionPage(gameId, questionIndex, g) {
		if (!this.validateGame(gameId, g)) return false;
		if (questionIndex === 0) return true;

		return this.getAnswer(gameId, questionIndex-1, g) !== false
	}

	static getCurrentQuestion(g) {
		const game = g || this.getCurrentGame()
		let current = null

		game.questions.forEach(key => {
			if (game.questions[key].answer) current = key;
		})

		return current
	}

	static getNextStep(questionIndex, g) {
		const game = g || this.getCurrentGame()
		return game.questions[questionIndex+1] ? questionIndex+2 : 'results'
	}

	static storeAnswer(index, answer, correct) {
		const game = this.getCurrentGame()
		game.questions[index-1].answer = answer
		game.questions[index-1].correct = correct

		// store altered object
		localStorage.setItem(game.id, JSON.stringify(game))

		return this.getNextStep(game)
	}

	static isGameComplete(gameId, g) {
		const game = g || this.getCurrentGame(gameId)
		if (!this.validateGame(gameId, g)) return false;

		let complete = true
		let correctAnswers = 0
		const total = game.questions.length

		game.questions.forEach(item => {
			const { answer, correct } = item
			if (!answer || typeof correct === 'undefined') complete = false;
			if (correct === true) correctAnswers++
		})

		return { complete, correctAnswers, total }
	}

}