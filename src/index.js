// NPM dependencies
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

// Local dependencies
import 'font-awesome/css/font-awesome.min.css'
import './css/main.css'

import App from './components/app'

ReactDOM.render((
	<div>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</div>
), document.getElementById('root'))
