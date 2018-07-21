// NPM dependencies
import React, { Component } from 'react'

// Local dependencies
import Navbar from './navbar'
import Main from './main'

export default class App extends Component {
    render() {
      return (
        <div className="page-wrap">
          <Navbar />
          <Main />
        </div>
      )
    }
  }