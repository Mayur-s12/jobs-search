import {Link} from 'react-router-dom'

import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import {AiTwotoneStar} from 'react-icons/ai'

import './index.css'

const JobResult = props => {
  const {myList} = props
  const {
    companyLogoUrl,
    packagePerAnnum,
    jobDescription,
    employmentType,
    location,
    rating,
    title,
    id,
  } = myList

  return (
    <Link to={`/jobs/${id}`} className="link-decor">
      <li className="list-container">
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
        <p className="color">Description</p>
        <p>{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobResult
