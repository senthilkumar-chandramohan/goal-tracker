import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import NewGoalForm from './NewGoalForm'
import TaskList from '../Task/TaskList'
import { GoalContext } from './GoalContext'

const NewGoal = () => {
    const [show, setShow] = useState(false)
    const [goal, setGoal] = useState(null)

    const handleClose = () => {
        setGoal(null)
        setShow(false)
    }

    const handleShow = () => setShow(true)
    
    const handleAddGoalTasks = () => {
        if (!goal) {
            const goalId = Date.now()
            const heading = document.getElementById('heading').value
            const description = document.getElementById('description').value
            const startDate = new Date(document.getElementById('startDate').value).valueOf()
            const count = parseInt(document.getElementById('count').value)
            const week = document.getElementById('week')
            const weekOrMonth = week.checked ? 'week' : 'month'
            const timePerDay = parseFloat(document.getElementById('timePerDay').value)

            const goals = window.goals || []
            const newGoal = {
                goalId,
                heading,
                description,
                startDate,
                deadline: {
                    count,
                    unit: weekOrMonth
                },
                timePerDay,
                status: 'YTB',
                roadmap: null,
            }

            goals.push(newGoal)
            window.goals = goals

            setGoal(newGoal)
            console.log(goals)
        } else {
            console.log(goal)
        }
    }

    return (
        <GoalContext.Provider value={{ goal }}>
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
                    <Modal.Title>{goal ? `Add Tasks to "${goal.heading}"` : 'Add Goal'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        !goal && <NewGoalForm />
                    }
                    {
                        goal && <TaskList />
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                    <Button variant="primary" onClick={handleAddGoalTasks}>{ goal ? 'Add Tasks' : 'Add Goal' }</Button>
                </Modal.Footer>
            </Modal>
        </GoalContext.Provider>
    )
}

export default NewGoal
