import { useState, useCallback } from "react"
import NewGoal from "./Goal/NewGoal"
import GoalSummaries from "./Goal/GoalSummaries"
import ViewEditGoal from "./Goal/ViewEditGoal"
import { MainContext } from './MainContext'

import { retrieveGoals } from "../utils/storage"

const MainScreen = () => {
  const [goalInFocus, setGoalInFocus] = useState(null)
  window.goals = retrieveGoals() // Load goals from local storage

  const [, updateState] = useState();
  const forceMainScreenUpdate = useCallback(() => updateState({}), []);

    return (
      <MainContext.Provider value={{ goalInFocus, setGoalInFocus, forceMainScreenUpdate }}>
        <div className="container">
          {
            goalInFocus && <ViewEditGoal />
          }
          <div className="row">
            <div className="col-12">
              <NewGoal />
            </div>
          </div>
          <GoalSummaries />
        </div>
      </MainContext.Provider>
    )
}

export default MainScreen
