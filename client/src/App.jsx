import { useState, useEffect } from 'react'
// import { GoogleLogin, hasGrantedAllScopesGoogle } from '@react-oauth/google'
import jwt_decode from "jwt-decode"
import 'bootstrap/dist/css/bootstrap.min.css'
import "react-datepicker/dist/react-datepicker.css"
import './less/main.less'

import GoogleLogin from './components/GoogleLogin'

function App() {
  // return (
  //   <GoogleLogin
  //     onSuccess={credentialResponse => {
  //       console.log(credentialResponse)
  //       var decoded = jwt_decode(credentialResponse.credential)
  //       console.log(decoded)
  //     }}
  //     onError={() => {
  //       console.log('Login Failed')
  //     }}
  //     auto_select
  //   />
  // )
  return (
    <div className="container">
      <header className="row">
        <div className="col-12">
          <h1>Goal Tracker</h1>
        </div>
      </header>
      <main className="row">
        <div className="col-12">
          <GoogleLogin />
        </div>
      </main>
      <footer className="row">
        <div className="col-12">Footer</div>
      </footer>
    </div>
  )
}

export default App
