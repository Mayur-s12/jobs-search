import {Component} from 'react'

import './index.css'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Redirect} from 'react-router-dom'

import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill, BsBoxArrowUpRight} from 'react-icons/bs'
import {AiTwotoneStar} from 'react-icons/ai'

import Header from '../Header'

const constants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    apiStatus: constants.initial,
    details: '',
    skills: '',
    life: '',
    similarJobs: '',
  }

  componentDidMount() {
    this.getDetailsApi()
  }

  getDetailsApi = async () => {
    this.setState({apiStatus: constants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(id)

    const jwt = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const each = data.job_details
      console.log(data)

      const updatedData = {
        websiteUrl: each.company_website_url,

        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
      }

      const updatedSkills = data.job_details.skills.map(item => ({
        imageUrl: item.image_url,
        name: item.name,
      }))

      const updatedLife = {
        imageLifeUrl: data.job_details.life_at_company.image_url,
        description: data.job_details.life_at_company.description,
      }

      const updatedSimilar = data.similar_jobs.map(eachOne => ({
        id: eachOne.id,
        jobDes: eachOne.job_description,
        locationS: eachOne.location,

        ratingS: eachOne.rating,
        titleS: eachOne.title,
        companyLogoUrlSimilar: eachOne.company_logo_url,
        employmentTyp: eachOne.employment_type,
      }))

      this.setState({
        details: updatedData,
        skills: updatedSkills,
        life: updatedLife,
        similarJobs: updatedSimilar,
        apiStatus: constants.success,
      })
    } else {
      this.setState({apiStatus: constants.failure})
    }
  }

  successView = () => {
    const {details, skills, life, similarJobs} = this.state
    const {imageLifeUrl, description} = life
    const {imageUrl, name} = skills
    const {
      titleS,
      ratingS,
      companyLogoUrlSimilar,
      jobDes,

      employmentTyp,
      locationS,
    } = similarJobs

    const {
      title,
      rating,
      companyLogoUrl,
      jobDescription,
      packagePerAnnum,
      employmentType,
      location,
      websiteUrl,
    } = details

    return (
      <div className="back">
        <div className="list-container cont">
          <div className="list-top">
            <div>
              <img className="img" src={companyLogoUrl} alt={title} />
            </div>
            <div>
              <p>{title}</p>
              <div className="disp-flex">
                <AiTwotoneStar className="star" />
                <p>{rating}</p>
              </div>
            </div>
          </div>
          <div className="disp-flex distance">
            <div className="disp-flex">
              <MdLocationOn />
              <p>{location}</p>
              <BsBriefcaseFill />
              <p>{employmentType}</p>
            </div>
            <div>
              <p>{packagePerAnnum}</p>
            </div>
          </div>
          <hr />
          <div className="visit-space-bw">
            <p className="color md-head">Description</p>
            <a href={websiteUrl}>
              Visit <BsBoxArrowUpRight />
            </a>
          </div>
          <p>{jobDescription}</p>
          <p className="skill-p">Skills</p>
          <div className="skills-cont">
            {skills.map(each => (
              <div className="skill-items-div">
                <img
                  className="skill-img"
                  src={each.imageUrl}
                  alt={each.name}
                />
                <p>{each.name}</p>
              </div>
            ))}
          </div>
          <div className="dis-flex-md">
            <div className="width-md-life">
              <p className="life-p">Life at Company</p>
              <p>{description}</p>
            </div>
            <div className="width-md-life-img">
              <img
                className="life-img"
                src={imageLifeUrl}
                alt="life at company"
              />
            </div>
          </div>
        </div>
        <div className="heading-div-s">
          <h3 className="similar-heading">Similar Jobs</h3>
        </div>

        <div className="dis-flex-similar">
          {similarJobs.map(each => (
            <div className="similar-items-cont ">
              <div className="list-top">
                <div>
                  <img
                    className="img"
                    src={each.companyLogoUrlSimilar}
                    alt={title}
                  />
                </div>
                <div>
                  <p>{each.titleS}</p>
                  <div className="disp-flex">
                    <AiTwotoneStar className="star" />
                    <p>{each.ratingS}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="color">Description</p>
                <p>{each.jobDes}</p>
              </div>
              <div className="disp-flex distance">
                <div className="disp-flex">
                  <MdLocationOn />
                  <p>{each.locationS}</p>
                  <BsBriefcaseFill />
                  <p>{each.employmentTyp}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  failureView = () => (
    <div className="center">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button onClick={this.onClickRetry} className="retry">
        Retry
      </button>
    </div>
  )

  onLoading = () => (
    <div data-testid="loader" className="loader-center">
      <Loader type="TailSpin" color="#b6c5ff" />
    </div>
  )

  onClickRetry = () => {
    this.getDetailsApi()
  }

  switchStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case constants.success:
        return this.successView()
      case constants.failure:
        return this.failureView()
      case constants.inProgress:
        return this.onLoading()
      default:
        return null
    }
  }

  render() {
    const jwt = Cookies.get('jwt_token')

    if (jwt === undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="backgorund-fixed">
        <Header />
        {this.switchStatus()}
      </div>
    )
  }
}

export default JobItemDetails
