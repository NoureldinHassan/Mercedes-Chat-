import React, { Component } from 'react'
import logo from './mercedes-logo.png'
import './App.css'
import Chat from './Chat'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">
		  Mercedes Chat</h1>
        </header>
        <Chat />
      </div>
    )
  }
}

export default App