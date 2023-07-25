import { useContext } from "react"
import PropTypes from 'prop-types'
import { MainContext } from "../MainContext"

const GoalSummary = ({ id, heading, status }) => {
    const { setGoalInFocus } = useContext(MainContext)

    const handleClick = () => {
        setGoalInFocus({id, status})
    }

    return (
        <button className={`goal-summary${status}`} data-goal-id={id} onClick={handleClick}>
            {heading}
        </button>
    )
}

GoalSummary.propTypes = {
    id: PropTypes.number,
    heading: PropTypes.string,
    status: PropTypes.string,
}

export default GoalSummary
