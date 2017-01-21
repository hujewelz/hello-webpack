import React from 'react'
import Logo from 'assets/img/logo.svg'
import Girl from 'assets/img/girl.jpg'
import 'assets/main.css'

export default class App extends React.Component {
  render() {
    return (
      <div>
        <header>
          <img className="logo" src={Logo}/>
          <h1>Hello {this.props.name}</h1>
        </header>
        <div><img src={Girl} /></div>
      </div>
    )
  }
}