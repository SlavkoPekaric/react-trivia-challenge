/* Local Storage wrapper */


// NPM dependencies
const _ = require('lodash')
import storage from 'local-storage-fallback' 

/* Local storage */
const localStorage = window.localStorage || storage

const getItem = (key) => {
	const data = localStorage.getItem(key)
	return data && JSON.parse(data)
}

const setItem = (key,value) => {
	if (typeof value === 'object') {
		localStorage.setItem(key, JSON.stringify(value))
	} else {
		localStorage.setItem(key, value)
	}
}

export default class LocalStorage {

	static create(dbName, data) {
		return new Promise((resolve, reject) => {
			let result = getItem(dbName) || []
			result.push(data)
			setItem(dbName, JSON.stringify(result))
			resolve(data)
		})
	}

	static async update(dbName, query, data) {
		return new Promise((resolve, reject) => {
			let result = getItem(dbName) || []

			result = _.map(result, (item) => {
				let match = false

				Object.keys(query).forEach( (key) => {
					if (item[key] === query[key]) { match = true }
				})

				return match ? data : item
			})

			setItem(dbName, result)
			resolve(data)
		})
	}

	static async get(dbName, query = false) {
		return new Promise((resolve, reject) => {
			let result = getItem(dbName) || []
			resolve((query ? _.find(result, query) : result) || [])
		})
	}

	static async remove(dbName, query) {
		return new Promise((resolve, reject) => {
			if (!query) {
				localStorage.removeItem(dbName)
				resolve()
			} else {
				let result = getItem(dbName) || []

				result = _.filter(result, (item) => {
					let match = false

					Object.keys(query).forEach( key => {
						if (item[key] === query[key]) { match = true }
					})

					return !match
				})

				setItem(dbName, result)
				resolve()
			}
		})
	}

}


/* end basic DB methods */
