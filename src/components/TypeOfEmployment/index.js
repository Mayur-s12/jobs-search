import React, {useState} from 'react'
import './index.css'

const TypeOfEmployment = props => {
  const {typeList, onCheckType} = props
  const {employmentTypeId, label} = typeList

  const [checked, setChecked] = useState(false)

  const onChangeInput = () => {
    setChecked(!checked)
    onCheckType(employmentTypeId, !checked)
  }

  return (
    <li className="list">
      <input
        onChange={onChangeInput}
        type="checkbox"
        id={employmentTypeId}
        checked={checked}
      />
      <label htmlFor={employmentTypeId}>{label}</label>
    </li>
  )
}

export default TypeOfEmployment
