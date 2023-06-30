import { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import TaskGroup from './TaskGroup'

const TaskList = ({heading, deadline}) => {
    const [roadmap, setRoadMap] = useState(null)

    const handleManuallyAddTasks = () => {

    }

    const handleGetGPTRecommendations = () => {
        const getTasksBody = {
            heading,
            deadline,
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
            const gptResponse = JSON.parse(data.data.content)
            console.log(data.data.content)
            setRoadMap(gptResponse.roadmap)
        })
        .catch(err=>console.log(err))
    }

    return (
        <>
            <h2>Goal Added Successfully!</h2>
            <p>Do you want GPT to recommend tasks?</p>
            <div>
                <Button variant="primary" onClick={handleGetGPTRecommendations}>Yes</Button>
                &nbsp;
                <Button variant="secondary" onClick={handleManuallyAddTasks}>No</Button>
            </div>
            {
                roadmap && (
                    roadmap.map((weekOrMonth, idx) => {
                        const {
                            week,
                            month,
                            tasks,
                        } = weekOrMonth

                        return (
                            <TaskGroup heading={week||month} tasks={tasks} />
                        )
                    })
                )
            }
        </>
    )
}

export default TaskList
