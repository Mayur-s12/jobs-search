import {Component} from 'react'
import {Redirect, Link} from 'react-router-dom'

import Cookies from 'js-cookie'

import './index.css'

class LoginForm extends Component {
  state = {username: '', password: '', displayLoginError: ''}

  onChangeInput = event => {
    this.setState({username: event.target.value})
  }

  onChangePass = event => {
    this.setState({password: event.target.value})
  }

  onSubmitForm = event => {
    event.preventDefault()
    this.getApiStatus()
  }

  onApiSuccess = JWT => {
    const {history} = this.props
    Cookies.set('jwt_token', JWT, {expires: 5}, this.getApiStatus)
    history.replace('/')
  }

  onApiFailure = failText => {
    this.setState({displayLoginError: failText})
  }

  getApiStatus = async () => {
    const {username, password} = this.state

    const userDetails = {
      username,
      password,
    }
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      this.onApiSuccess(data.jwt_token)
    } else {
      this.onApiFailure(data.error_msg)
    }
  }

  render() {
    const {displayLoginError} = this.state
    const jwt = Cookies.get('jwt_token')

    if (jwt !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-div">
        <form onSubmit={this.onSubmitForm} className="form-container">
          <img
            className="logo-size"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
          <label className="label-setting color-white" htmlFor="user">
            USERNAME
          </label>
          <input
            onChange={this.onChangeInput}
            className="input-setting"
            id="user"
            placeholder=" Username"
          />
          <label className="label-setting color-white" htmlFor="pass">
            PASSWORD
          </label>
          <input
            onChange={this.onChangePass}
            className="input-setting"
            id="pass"
            type="password"
            placeholder=" password"
          />

          <button type="submit" className="btn color-white">
            Login
          </button>

          <p className="error-style">{displayLoginError}</p>
        </form>
      </div>
    )
  }
}

export default LoginForm
