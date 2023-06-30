import GoalSummary from "./GoalSummary"

const GoalSummaries = () => { 
    const goal = {
        text: 'Learn Generative AI',
    }

    return (
        <>
            <div className="row">
              <div className="col">
                <GoalSummary {...goal} />
              </div>
              <div className="col">
                <GoalSummary {...goal} />
              </div>
              <div className="col">
                <GoalSummary {...goal} />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <GoalSummary {...goal} />
              </div>
              <div className="col">
                <GoalSummary {...goal} />
              </div>
              <div className="col">
                <GoalSummary {...goal} />
              </div>
            </div>
        </>
    )
}

export default GoalSummaries
