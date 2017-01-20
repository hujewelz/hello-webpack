import React from 'react'
import { render } from 'react-dom'
import Logo from './assets/logo.svg'

const element = (
  <h1>Hello Webpack!!!</h1>
  <img src={Logo} />
)
render(
  element,
  document.getElementById('app')
)