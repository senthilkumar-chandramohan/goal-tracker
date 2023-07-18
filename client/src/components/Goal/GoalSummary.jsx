import { useContext } from "react"
import { MainContext } from "../MainContext"

const GoalSummary = ({ id, heading }) => {
    const { setGoalInFocus } = useContext(MainContext)

    const handleClick = () => {
        setGoalInFocus(id)
    }

    return (
        <button className="goal-summary" data-goal-id={id} onClick={handleClick}>
            {heading}
        </button>
    )
}

export default GoalSummary
