import React from 'react'
import { render } from 'react-dom'
import Logo from 'img/logo.svg'
import Girl from 'img/girl.jpg'
import 'assets/main.css'

console.log(Girl)
const element = (
  <div>
    <h1>Hello Webpack!!!</h1>
    <img className="logo" src={Logo}/>
    <img src={Girl} />
  </div>
)
render(
  element,
  document.getElementById('app')
)
  // document.write('hello webpack')