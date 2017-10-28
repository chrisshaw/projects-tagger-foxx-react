import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import './App.css';
import Project from './components/Project'

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">Project Builder</h1>
            <p className="App-intro">
              Build projects. Hit submit. Repeat.
            </p>
          </header>
          <main>
            <Project />
          </main>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
