import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import Header from '../Header'

import './index.css'

const Home = props => {
  const jwt = Cookies.get('jwt_token')
  console.log(jwt)
  if (jwt === undefined) {
    return <Redirect to="/login" />
  }

  const goToJobs = () => {
    const {history} = props
    history.push('/jobs')
  }

  return (
    <div className="home-header">
      <Header />
      <div>
        <div className="head-div">
          <h1 className="home-heading">Find The Job That Fits Your Life</h1>
        </div>
        <div className="para-div">
          <p className="paragraph-home">
            Millions of people are searching for jobs, salary information,
            company reviews. Find the job that fits your ability and potential
          </p>
        </div>
        <button onClick={goToJobs} className="find-button">
          Find Jobs
        </button>
      </div>
    </div>
  )
}

export default Home
