import { useState, useEffect, useRef } from 'react'
import Button from 'react-bootstrap/Button'
import TaskGroup from './TaskGroup'
import { GoalContext } from './GoalContext'
import MyAlert from '../MyAlert';

const TaskList = ({ heading, deadline, timePerDay }) => {
    const [roadmap, setRoadMap] = useState(null)

    useEffect(() => {
    })

    const cleanseResponse = (gptResponse) => {
        for (let i = 0; i < gptResponse.roadmap.length; i++) {
            for (let j=0; j < gptResponse.roadmap[i].tasks.length; j++) {
                gptResponse.roadmap[i].tasks[j].duration = parseInt(gptResponse.roadmap[i].tasks[j].duration.substr(0,1))
            }
        }

        return gptResponse
    }

    const handleManuallyAddTasks = () => {
        console.log("Manual")
        setRoadMap([
            {
                week: "1",
                tasks: []
            },
            {
                week: "2",
                tasks: []
            },
            {
                week: "3",
                tasks: []
            },
            {
                week: "4",
                tasks: []
            }
        ])
    }

    const handleGetGPTRecommendations = () => {
        const getTasksBody = {
            heading,
            deadline,
            timePerDay,
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
            // Remove all "days/weeks" from response
            const cleansedResponse = cleanseResponse(gptResponse)
            // console.log(cleansedResponse)
            setRoadMap(cleansedResponse.roadmap)
        })
        .catch(err=>console.log(err))
    }

    return (
        <GoalContext.Provider value={{roadmap, setRoadMap}}>
            <>
                {
                    !roadmap && (
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
        </GoalContext.Provider>
    )
}

export default TaskList
