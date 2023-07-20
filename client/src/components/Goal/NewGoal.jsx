import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import NewGoalForm from './NewGoalForm'
import TaskList from '../Task/TaskList'
import { GoalContext } from './GoalContext'

import { storeGoals } from '../../utils/storage'

const NewGoal = () => {
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false)
    const [goalId, setGoalId] = useState(null)
    const [roadmap, setRoadMap] = useState(null)
    const [taskAdded, setTaskAdded] = useState(false)
    const [taskInitiated, setTaskInitiated] = useState(false)

    const handleClose = () => {
        setRoadMap(null)
        setGoalId(null)
        setTaskAdded(false)
        setShow(false)
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
        } else {
            const goal = window.goals.find(goal => goal.id === goalId)
            goal.roadmap = roadmap
            console.log(window.goals)
            // Store updated goals object in local storage
            storeGoals(window.goals)
            setTaskAdded(true)
        }
    }

    return (
        <GoalContext.Provider value={{ goalId, roadmap, setRoadMap, setTaskInitiated, loading, setLoading }}>
            <button
                className="add-goal"
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
                            <div class="spinner-border m-5" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )
                }
                <Modal.Header closeButton>
                    <Modal.Title>{ goalId ? (taskAdded ? 'Update Tasks' : 'Add Tasks') : 'Add Goal'}</Modal.Title>
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
                    <Button variant="secondary" onClick={handleClose}>{ goalId ? 'Close' : 'Cancel'}</Button>
                    <Button disabled={goalId && !taskInitiated} variant="primary" onClick={handleAddGoalTasks}>{ goalId ? (taskAdded ? 'Update Tasks' : 'Add Tasks') : 'Add Goal' }</Button>
                </Modal.Footer>
            </Modal>
        </GoalContext.Provider>
    )
}

export default NewGoal
