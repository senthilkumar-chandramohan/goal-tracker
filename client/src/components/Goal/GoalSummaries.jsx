import GoalSummary from "./GoalSummary"

const GoalSummaries = () => {  
  const TIME = {
    MS_PER_DAY: 86400000,
    MS_PER_WEEK: 604800000,
  }

  const getGoalStatus = (goal) => {
    if (goal.roadmap) {
      let taskStatus = ''
      const type = goal.roadmap[0].week ? 'week' : 'month'
      const goalStartDate = goal.startDate

      const daysPerWeekOrWeeksPerMonth = type === 'week' ? 7 : 4
      const msPerDayOrWeek = type === 'week' ? TIME.MS_PER_DAY : TIME.MS_PER_WEEK
      let taskDurationSum = 0
      let weekMonthIdx = 0

      loop1:
      for (let i = 0; i < goal.roadmap.length; i++) {
        taskDurationSum = 0
        for (let j = 0; j < goal.roadmap[i].tasks.length; j++) {
          taskDurationSum += goal.roadmap[i].tasks[j].duration
          if (!goal.roadmap[i].tasks[j].done) {
              break loop1
          }
        }
        weekMonthIdx += 1
      }

      if (weekMonthIdx===goal.roadmap.length) {
        return ' done' // All tasks are complete
      }

      if ((goalStartDate + (weekMonthIdx * daysPerWeekOrWeeksPerMonth * msPerDayOrWeek) + (taskDurationSum * msPerDayOrWeek)) < Date.now().valueOf()) {
          taskStatus = ' overdue'
      } else if ((goalStartDate + (weekMonthIdx * daysPerWeekOrWeeksPerMonth * msPerDayOrWeek) + (taskDurationSum * msPerDayOrWeek)) < (Date.now().valueOf() + TIME.MS_PER_DAY)) {
          taskStatus = ' due'
      }

      return taskStatus
    } else {
      return ''
    }
  }

  return (
      <>
        <div className="row">
          {
            window.goals.map((goal, idx) => {
              const goalStatus = getGoalStatus(goal)
              return (
                <div className="col-3">
                  <GoalSummary key={idx} id={goal.id} heading={goal.heading} status={goalStatus} />
                </div>
              )
            })
          }
        </div>
      </>
  )
}

export default GoalSummaries
