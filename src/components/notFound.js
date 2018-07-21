// NPM dependencies
import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom'


export default class NotFound extends PureComponent {
	render() {
  		return (
			<div className="container">
  			<h1>Oops, page not found...</h1>
  			<p className="center">Click <Link to='/'>here</Link> to go back to the home page.</p>
			</div>
		)
	}
}

