import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import NewGoalForm from './NewGoalForm'
import TaskList from '../Task/TaskList'
import { GoalContext } from './GoalContext'

import { storeGoals } from '../../utils/storage'

const NewGoal = () => {
    const [show, setShow] = useState(false)
    const [goalId, setGoalId] = useState(null)
    const [roadmap, setRoadMap] = useState(null)
    const [taskAdded, setTaskAdded] = useState(false)

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
            const timePerDay = parseFloat(document.getElementById('timePerDay').value)

            const newGoal = {
                id,
                heading,
                description,
                startDate,
                deadline: {
                    count,
                    unit: weekOrMonth
                },
                timePerDay,
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
        <GoalContext.Provider value={{ goalId, roadmap, setRoadMap }}>
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
                    <Button variant="primary" onClick={handleAddGoalTasks}>{ goalId ? (taskAdded ? 'Update Tasks' : 'Add Tasks') : 'Add Goal' }</Button>
                </Modal.Footer>
            </Modal>
        </GoalContext.Provider>
    )
}

export default NewGoal
