import {Component} from 'react'
import {Redirect} from 'react-router-dom'

import Cookies from 'js-cookie'
import {GoSearch} from 'react-icons/go'
import Loader from 'react-loader-spinner'
import SalaryRanges from '../SalaryRanges'

import Header from '../Header'
import JobResult from '../JobResult'

import './index.css'
import TypeOfEmployment from '../TypeOfEmployment'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const constants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  noJobs: 'NO_JOBS',
}

class Jobs extends Component {
  state = {
    profile: '',
    profileStatus: constants.initial,
    typeChosenList: [],
    jobsResults: [],
    searchInput: '',
    minimumSalary: '',
    jobsStatus: constants.initial,
    resultsCount: '',
  }

  componentDidMount() {
    this.getProfileApi()
    this.getApiStatus()
  }

  onSearchText = event => {
    this.setState({searchInput: event.target.value}, this.getApiStatus)
  }

  onClickSearch = () => {
    this.onSearchText()
  }

  onChooseSalary = salaryId => {
    this.setState({minimumSalary: salaryId}, this.getApiStatus)
  }

  onCheckType = (employmentTypeId, checked) => {
    this.setState(prevState => {
      const updatedTypeChosenList = [...prevState.typeChosenList]

      if (checked) {
        updatedTypeChosenList.push(employmentTypeId)
      } else {
        const index = updatedTypeChosenList.indexOf(employmentTypeId)
        if (index !== -1) {
          updatedTypeChosenList.splice(index, 1)
        }
      }

      this.setState({typeChosenList: updatedTypeChosenList}, this.getApiStatus)
    })
  }

  getApiStatus = async () => {
    this.setState({jobsStatus: constants.inProgress})

    const {typeChosenList, minimumSalary, searchInput} = this.state

    const url = `https://apis.ccbp.in/jobs?employment_type=${typeChosenList}&minimum_package=${minimumSalary}&search=${searchInput}`
    const jwt = Cookies.get('jwt_token')

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }
    const response = await fetch(url, options)
    console.log(response)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = data.jobs.map(each => ({
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
      }))
      console.log(updatedData.length)
      if (updatedData.length === 0) {
        this.setState({
          jobsStatus: constants.noJobs,
          resultsCount: updatedData.length,
        })
      } else {
        this.setState({
          jobsResults: updatedData,
          jobsStatus: constants.success,
          resultsCount: updatedData.length,
        })
      }
    } else {
      this.setState({jobsStatus: constants.failure})
    }
  }

  onProfileApiSuccess = updatedData => {
    this.setState({profile: updatedData, profileStatus: constants.success})
  }

  onProfileApiFailure = () => {
    this.setState({profileStatus: constants.failure})
  }

  getProfileApi = async () => {
    this.setState({profileStatus: constants.inProgress})

    const jwt = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }

    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()

      const updatedData = {
        name: data.profile_details.name,
        profileImage: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.onProfileApiSuccess(updatedData)
    } else {
      this.onProfileApiFailure()
    }
  }

  onLoading = () => (
    <div data-testid="loader" className="loader-center">
      <Loader type="TailSpin" color="#b6c5ff" />
    </div>
  )

  profileSuccessView = () => {
    const {profile} = this.state
    const {name, profileImage, shortBio} = profile
    return (
      <div className="profile-div">
        <img className="profile-pic" src={profileImage} alt="" />
        <h3 className="name-user">{name}</h3>
        <p className="bio">{shortBio}</p>
      </div>
    )
  }

  profileFailureView = () => (
    <div>
      <button onClick={this.onClickRetry} className="retry">
        Retry
      </button>
    </div>
  )

  onClickRetry = () => {
    this.getProfileApi()
  }

  onClickRetryJobs = () => {
    this.getApiStatus()
  }

  switchStatus = () => {
    const {profileStatus} = this.state
    switch (profileStatus) {
      case constants.success:
        return this.profileSuccessView()
      case constants.failure:
        return this.profileFailureView()
      case constants.inProgress:
        return this.onLoading()
      default:
        return null
    }
  }

  jobsFailureView = () => (
    <div className="center">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button onClick={this.onClickRetryJobs} className="retry">
        Retry
      </button>
    </div>
  )

  jobsSuccessView = () => {
    const {jobsResults} = this.state

    return (
      <div className="jobs-result-side">
        {jobsResults.map(each => (
          <JobResult myList={each} key={each.id} />
        ))}
      </div>
    )
  }

  noJobsView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
      />
      <h1>No Jobs Found</h1>
      <p>We could not find any jobs. Try other filters.</p>
    </div>
  )

  switchStatusJobs = () => {
    const {jobsStatus} = this.state
    switch (jobsStatus) {
      case constants.success:
        return this.jobsSuccessView()
      case constants.failure:
        return this.jobsFailureView()
      case constants.inProgress:
        return this.onLoading()
      case constants.noJobs:
        return this.noJobsView()
      default:
        return null
    }
  }

  render() {
    const {
      profile,
      typeChosenList,
      jobsResults,
      searchInput,
      resultsCount,
    } = this.state
    const {name, profileImage, shortBio} = profile
    const jwt = Cookies.get('jwt_token')

    console.log(jobsResults)

    if (jwt === undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="background-container">
        <Header />
        <div className="main-container">
          <div className="profile-side">
            <div className="search-div-small">
              <input
                className="input-class"
                type="search"
                placeholder=" Search"
                onChange={this.onSearchText}
                value={searchInput}
              />
              <button onClick={this.onClickSearch} className="btn-class">
                <GoSearch className="icon" />
              </button>
            </div>
            {this.switchStatus()}
            <div className="filters-div">
              <hr />
              <h3 className="head">Type of Employment</h3>
              <ul className="unorder">
                {employmentTypesList.map(each => (
                  <TypeOfEmployment
                    typeList={each}
                    key={each.id}
                    onCheckType={this.onCheckType}
                  />
                ))}
              </ul>
              <hr />
              <h3 className="head">Salary Range</h3>
              <ul className="unorder">
                {salaryRangesList.map(each => (
                  <SalaryRanges
                    onChooseSalary={this.onChooseSalary}
                    rangeList={each}
                    key={each.id}
                  />
                ))}
              </ul>
            </div>
          </div>
          <div className="results-side">
            <div className="disp-flex-resultcount">
              <div className="search-div">
                <input
                  className="input-class"
                  type="search"
                  placeholder=" Search"
                  onChange={this.onSearchText}
                  value={searchInput}
                />
                <button className="btn-class">
                  <GoSearch className="icon" />
                </button>
              </div>
              <div>
                <p className="resultsSt">{`${resultsCount} Results`}</p>
              </div>
            </div>
            {this.switchStatusJobs()}
          </div>
        </div>
      </div>
    )
  }
}
export default Jobs
