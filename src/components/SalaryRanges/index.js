import './index.css'

const SalaryRanges = props => {
  const {rangeList, onChooseSalary} = props
  const {salaryRangeId, label} = rangeList

  const onChangeRadio = () => {
    onChooseSalary(salaryRangeId)
  }
  return (
    <li className="list">
      <input
        type="radio"
        name="group"
        value={salaryRangeId}
        id={salaryRangeId}
        onChange={onChangeRadio}
      />
      <label htmlFor={salaryRangeId}>{label}</label>
    </li>
  )
}

export default SalaryRanges
