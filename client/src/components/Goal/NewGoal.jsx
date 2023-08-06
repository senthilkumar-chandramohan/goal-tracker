import { useContext, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import NewGoalForm from './NewGoalForm'
import TaskList from '../Task/TaskList'
import { GoalContext } from './GoalContext'
import { MainContext } from '../MainContext'

import { storeGoals } from '../../utils/storage'

const NewGoal = () => {
    const { forceMainScreenUpdate } = useContext(MainContext)
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false)
    const [goalId, setGoalId] = useState(null)
    const [roadmap, setRoadMap] = useState(null)
    const [taskAdded, setTaskAdded] = useState(false)
    const [taskInitiated, setTaskInitiated] = useState(false)
    const [flashMessage, setFlashMessage] = useState("")

    const handleClose = () => {
        setRoadMap(null)
        setGoalId(null)
        setTaskAdded(false)
        setShow(false)
        forceMainScreenUpdate(null)
    }

    const showFlashMessage = (message, timeout) => {
        setFlashMessage(message)
        setTimeout(()=>{
            setFlashMessage("")
        }, timeout)
    }

    const handleShow = () => setShow(true)
    
    const handleAddGoalTasks = () => {
        if (!goalId) {
            const id = Date.now()
            const heading = document.getElementById('heading').value
            const description = document.getElementById('description').value
            const startDate = new Date(document.getElementById('startDate').value).valueOf()
            const count = parseInt(document.getElementById('count').value)
            const week = document.getElementById('week')
            const weekOrMonth = week.checked ? 'week' : 'month'

            const newGoal = {
                id,
                heading,
                description,
                startDate,
                deadline: {
                    count,
                    unit: weekOrMonth
                },
                roadmap: null,
            }
            
            if (!window.goals) {
                window.goals = []
            }

            window.goals.push(newGoal)
            // Store updated goals object in local storage
            storeGoals(window.goals)
            setGoalId(id)
            showFlashMessage("Goal added!", 2000)
        } else {
            const goal = window.goals.find(goal => goal.id === goalId)
            goal.roadmap = roadmap
            // Store updated goals object in local storage
            storeGoals(window.goals)
            setTaskAdded(true)
            showFlashMessage("Saving...", 500)
            window.setTimeout(()=>{
                showFlashMessage("Changes saved!", 2000)
            }, 1000)
        }
    }

    return (
        <GoalContext.Provider value={{ goalId, roadmap, setRoadMap, setTaskInitiated, loading, setLoading }}>
            <button
                className="add-goal"
                title="Add Goal"
                onClick={handleShow}
            >
            </button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                {
                    loading && (
                        <div className='loading-spinner'>
                            <div className="spinner-border m-5" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )
                }
                <Modal.Header closeButton>
                    <Modal.Title>{ goalId ? 'Add Tasks' : 'Add Goal'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        !goalId && <NewGoalForm />
                    }
                    {
                        goalId && <TaskList />
                    }
                </Modal.Body>
                <Modal.Footer>
                    <div className="flash-message">{flashMessage}</div>
                    <Button disabled={goalId && !taskInitiated} variant="primary" onClick={handleAddGoalTasks}>{ goalId ? 'Save' : 'Add Goal' }</Button>
                    <Button variant="secondary" onClick={handleClose}>{ goalId ? 'Close' : 'Cancel'}</Button>
                </Modal.Footer>
            </Modal>
        </GoalContext.Provider>
    )
}

export default NewGoal
