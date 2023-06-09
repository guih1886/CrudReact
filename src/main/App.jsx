import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Routes from './Routes'

import Nav from '../components/template/Nav'
import Header from '../components/template/Header'
import Footer from '../components/template/Footer'

export default function App(props) {
  return (
    <BrowserRouter>
      <div className='app'>
        <Header></Header>
        <Nav></Nav>
        <Routes/>
        <Footer></Footer>
      </div>
    </BrowserRouter>
  )
}

