// NPM dependencies
import querystring from 'query-string'

// Local dependencies
import { config } from '../config'

export default class API {

  static async getGame(options = {}) {
    const { amount, difficulty, type } = options

    const query = querystring.stringify({
      amount: amount || config.defaultQuestionCount,
      difficulty: difficulty || config.defaultDifficulty,
      type: type || config.defaultGameType
    })
    
    const game = await fetch(`${config.apiUrl}?${query}`)
    const gameJson = game.json()

    return gameJson
  }

}
