const GoalSummary = (goal) => {
    console.log(goal);
    const {
        text,
    } = goal

    return (
        <button className="goal-summary">
            {text}
        </button>
    )
}

export default GoalSummary
