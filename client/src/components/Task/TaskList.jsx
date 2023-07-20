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

        console.log(getTasksBody)

        setLoading(true)
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
            setRoadMap(cleansedResponse.roadmap)
            setLoading(false)
            setTaskInitiated(true)
            
            if (mode === 'view') {
                setMode('edit')
            }
        })
        .catch(err=>console.log(err))
    }

    return (
        <>
            {
                !roadmap && (
                    <>
                        {/* {
                            mode !== 'view' &&
                            <GenericAlert variant={'warning'} body="Goal Added Successfully!" />
                        } */}
                        {
                            mode === 'edit' &&
                            <hr />
                        }
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
