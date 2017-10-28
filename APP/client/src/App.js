import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import './App.css';
import ProjectFetcher from './components/ProjectFetcher'

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">Project Tagger</h1>
            <p className="App-intro">
              Tag projects. Hit submit. Repeat.
            </p>
          </header>
          <main>
            <ProjectFetcher />
          </main>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
