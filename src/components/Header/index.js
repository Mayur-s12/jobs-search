import {Component} from 'react'

import {AiFillHome} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'

import Cookies from 'js-cookie'

import {Redirect, Link, withRouter} from 'react-router-dom'

import './index.css'

class Header extends Component {
  onCLickLogout = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.push('/login')
  }

  render() {
    return (
      <div className="header-div">
        <div className="logo-div">
          <Link to="/">
            <img
              className="logo-size"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </Link>
        </div>
        <div className="header-navigations">
          <Link to="/" className="link-home">
            <p>Home</p>
          </Link>
          <Link to="/jobs" className="link-home">
            <p className="head-el">Jobs</p>
          </Link>
        </div>
        <div className="icons-div">
          <Link to="/">
            <AiFillHome className="home" />
          </Link>
          <Link to="/jobs">
            <BsFillBriefcaseFill className="jobs" />
          </Link>
        </div>
        <div className="btn-div">
          <button onClick={this.onCLickLogout} className="button-el">
            Logout
          </button>
        </div>
        <div className="logout-div">
          <FiLogOut onClick={this.onCLickLogout} className="logout" />
        </div>
      </div>
    )
  }
}

export default withRouter(Header)
