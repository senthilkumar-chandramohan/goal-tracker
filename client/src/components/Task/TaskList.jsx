import { useContext } from 'react'
import Button from 'react-bootstrap/Button'
import TaskGroup from './TaskGroup'
import { GoalContext } from '../Goal/GoalContext'
// import GenericAlert from '../GenericAlert'

const TaskList = () => {
    const { goalId, roadmap, setRoadMap, mode, setMode, setLoading, setTaskInitiated } = useContext(GoalContext)
    const goal = window.goals.find(goal => goal.id === goalId)

    const cleanseResponse = (gptResponse) => {
        for (let i = 0; i < gptResponse.roadmap.length; i++) {
            for (let j=0; j < gptResponse.roadmap[i].tasks.length; j++) {
                gptResponse.roadmap[i].tasks[j].duration = parseInt(gptResponse.roadmap[i].tasks[j].duration.substr(0,1))
                gptResponse.roadmap[i].tasks[j].done = false // Set task complete status as false by default
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

        setRoadMap(defaultRoadmap)
        setTaskInitiated(true)
        if (mode === 'view') {
            setMode('edit')
        }
    }

    const handleGetGPTRecommendations = () => {
        const {
            heading,
            deadline: {
                count,
                unit,
            },
        } = goal

        const deadline = `${ count } ${ unit }${ count === 1 ? "" : "s" }`
        const getTasksBody = {
            heading,
            deadline,
        }

        setLoading(true)
        fetch('http://localhost:4000/get-tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(getTasksBody),
        })
        .then(response => {
            if (response.status === 200) {
                const data = response.json()
                const gptResponse = JSON.parse(data.data.content)
                const cleansedResponse = cleanseResponse(gptResponse) // Remove all "days/weeks" from response
                setRoadMap(cleansedResponse.roadmap)
                setLoading(false)
                setTaskInitiated(true)
                
                if (mode === 'view') {
                    setMode('edit')
                }
            } else {
                alert("Error loading ChatGPT recommendations, please try again!")
                setLoading(false)
            }
        })
        .catch(() => {
            alert("Error loading ChatGPT recommendations, please try again!")
            setLoading(false)
        })
    }

    return (
        <>
            {
                !roadmap && (
                    <>
                        {
                            mode === 'edit' &&
                            <hr />
                        }
                        <br />
                        <h6>Do you want ChatGPT to recommend tasks?</h6>
                        <p className="legal">
                            <b>Disclaimer:</b> Be judicious while adding tasks recommended by ChatGPT as they might be inaccurate.
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
                roadmap && (
                    roadmap.map((weekOrMonth, idx) => {
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
