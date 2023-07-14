import { useContext, useState, useCallback } from 'react'
import Button from 'react-bootstrap/Button'
import TaskGroup from './TaskGroup'
import { GoalContext } from '../Goal/GoalContext'

const TaskList = () => {
    const { goal } = useContext(GoalContext)

    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    const cleanseResponse = (gptResponse) => {
        for (let i = 0; i < gptResponse.roadmap.length; i++) {
            for (let j=0; j < gptResponse.roadmap[i].tasks.length; j++) {
                gptResponse.roadmap[i].tasks[j].duration = parseInt(gptResponse.roadmap[i].tasks[j].duration.substr(0,1))
            }
        }

        return gptResponse
    }

    const handleManuallyAddTasks = () => {
        const defaultRoadmap = []
        const {
            deadline: {
                count,
                unit
            }
        } = goal

        for (let i=0; i < count; i++) {
            defaultRoadmap.push({
                ...(unit === 'week' && {week: i+1}),
                ...(unit === 'month' && {month: i+1}),
                tasks: []
            })
        }

        goal.roadmap = defaultRoadmap
        console.log(goal.roadmap)
        forceUpdate()
    }

    const getTimePerDayText = (timePerDay) => {
        if (timePerDay > 1) {
            return `${timePerDay} hours`
        } else if (timePerDay === 1) {
            return '1 hour'
        } else {
            return `${timePerDay*60} minutes`
        }
    }

    const handleGetGPTRecommendations = () => {
        const {
            heading,
            deadline: {
                count,
                unit,
            },
            timePerDay,
        } = goal

        const deadline = `${ count } ${ unit }${ count === 1 ? "" : "s" }`
        const timePerDayText = getTimePerDayText(timePerDay)

        const getTasksBody = {
            heading,
            deadline,
            timePerDay: timePerDayText,
        }

        console.log(getTasksBody)

        fetch('http://localhost:4000/get-tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(getTasksBody),
        })
        .then(response=>response.json())
        .then(data => {
            console.log(data.data.content)
            const gptResponse = JSON.parse(data.data.content)
            const cleansedResponse = cleanseResponse(gptResponse) // Remove all "days/weeks" from response
            goal.roadmap = cleansedResponse.roadmap
        })
        .catch(err=>console.log(err))
    }

    return (
        <>
            {
                !goal.roadmap && (
                    <>
                        <h2>Goal Added Successfully!</h2>
                        <p>Do you want ChatGPT to recommend tasks?</p>
                        <p className="legal">
                            <b>Disclaimer:</b> Be judicious while adding tasks recommended by ChatGPT as they might not be accurate.
                        </p>
                        <div>
                            <Button variant="primary" onClick={handleGetGPTRecommendations}>Yes</Button>
                            &nbsp;
                            <Button variant="secondary" onClick={handleManuallyAddTasks}>No</Button>
                        </div>
                    </>
                )
            }
            {
                goal.roadmap && (
                    goal.roadmap.map((weekOrMonth, idx) => {
                        const {
                            week,
                        } = weekOrMonth

                        return (
                            <TaskGroup key={idx} type={week ? 'week' : 'month'} weekMonthIdx={idx} />
                        )
                    })
                )
            }
        </>
    )
}

export default TaskList
