import GoalSummary from "./GoalSummary"

const GoalSummaries = () => {
    return (
        <>
          <div className="row">
            {
              window.goals.map((goal, idx) => (
                <div className="col-3">
                  <GoalSummary id={goal.id} heading={goal.heading} />
                </div>
              ))
            }
          </div>
        </>
    )
}

export default GoalSummaries
