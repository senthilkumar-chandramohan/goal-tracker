import { useContext } from "react"
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

export default GoalSummary
