import NewGoal from "./Goal/NewGoal"
import GoalSummaries from "./Goal/GoalSummaries"

const MainScreen = () => {
    return (
        <div className="container">
            <div className="row">
              <div className="col-12">
                <NewGoal />
              </div>
            </div>
            <GoalSummaries />
        </div>
    )
}

export default MainScreen
