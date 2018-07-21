// NPM dependencies
import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'

// Local dependencies
import Session from '../core/session'
import { config } from '../config'
import { speak } from '../util/speech'
import { decodeHtml, shuffleArr, bindThis } from '../util/helpers'

export default class QuestionPage extends Component {

  constructor(props) {
		super(props)

		this.state = {
      answers: this.getAnswers(),
      nextStep: Session.getNextStep(),
      correctAnswer: this.props.data.correct_answer,
      givenAnswer: this.props.data.answer || null,
      redirect: null
    }

    bindThis(this, [
      'setAnswer',
      'isAnswerCorrect',
      'quitGame'
    ])

    this.speechTimeout = null
    this.redirectTimeout = null
  }

  componentWillMount() {
    // speak the question text if not answered
    if (!this.state.givenAnswer) {
      this.speechTimeout = setTimeout(() => {
        speak(decodeHtml(this.props.data.question))
      }, 300)
    }
  }

  componentWillUnmount() {
    clearInterval(this.speechTimeout)
    clearInterval(this.redirectTimeout)
  }

  getAnswers() {
    // compile all answers
    const { data } = this.props
    const { possibleAnswers, shuffle } = config.gameTypes[data.type]
    
    let answers = possibleAnswers

    // compile from correct and incorrect answers
    if (!answers) {
      answers = [data.correct_answer].concat(data.incorrect_answers)
    }
   
    if (shuffle) answers = shuffleArr(answers);

    return answers
  }

  setAnswer(givenAnswer) {
    // prevent user from setting answer twice
    if (this.state.givenAnswer !== null) return;

    const correct = this.isAnswerCorrect(givenAnswer)

    this.setState({ 
      givenAnswer,
      correct
    })

    // store answer
    Session.storeAnswer(this.props.match.params.questionNum, givenAnswer, correct)

    // output voice and redirect on voice completion
    const speechText = `${decodeHtml(givenAnswer)}... is ${!correct ? 'in' : ''}correct`
    
    speak(speechText)
    
    this.redirectTimeout = setTimeout(() => {
      this.setState({ redirect: this.props.nextStep })
    }, 3000)
  }

  isAnswerCorrect(givenAnswer) {
    return givenAnswer === this.state.correctAnswer
  }

  quitGame() {
    const confirm = window.confirm('Are you sure you want to quit this game?')
    if (confirm) {
      Session.clearGame()
      this.setState({ redirect: '/' })
    }
  }

  renderAnswers() {
    const { givenAnswer, correctAnswer } = this.state

    return this.state.answers.map((item, index) => {
      const activeCls = givenAnswer === item ? 'active' : ''
      
      // set answer color
      let colorCls = ''
      if (givenAnswer && givenAnswer === item) {
        colorCls = givenAnswer === correctAnswer ? 'green-bg' : 'red-bg'
      }

      return (
        <div className="answer-container"  key={index}>
          <div
          className={`answer-bt ${activeCls} ${colorCls}`}
          onClick={() => { this.setAnswer(item) }}>
            { decodeHtml(item) }
          </div>
        </div>
      )
    })
  }

  renderResult() {
    const { givenAnswer, correctAnswer } = this.state
    const { nextStep } = this.props
    
    if (!givenAnswer || !correctAnswer) return;

    const resultText = givenAnswer === correctAnswer ? 'Correct' : 'Incorrect'
    const btText = nextStep.indexOf('results') !== -1 ? 'Go to results' : 'Continue'

    return (
      <div className="question-result-container">
        <div className="question-result-text">{resultText}</div>
        <Link to={nextStep} className="question-result-bt">{btText}</Link>
      </div>
    )
  }

	render() {
    if (this.state.redirect) return <Redirect to={this.state.redirect} />;

		const { data } = this.props

    return (
      <div className="container question-page">
        <h1>{decodeHtml(data.category)}</h1>
        <div className="card">
          {decodeHtml(data.question)}
        </div>
        <div className={`answer-list game-type-${this.props.data.type}`}>
          { this.renderAnswers() }
        </div>
        <div className="question-number">
          {this.props.match.params.questionNum} of {this.props.total}
        </div>
        { this.renderResult() }
        <div className="page-footer">
          <button className="quit-btn" onClick={this.quitGame}>Quit</button>
        </div>
      </div>
		)
	}
}

