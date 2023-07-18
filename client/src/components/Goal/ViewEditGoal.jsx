import { useState, useContext } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { GoalContext } from './GoalContext'
import { MainContext } from '../MainContext'
import ViewEditGoalForm from './ViewEditGoalForm'
import TaskList from '../Task/TaskList'

import { storeGoals } from '../../utils/storage'

const ViewEditGoal = () => {
    const { goalInFocus, setGoalInFocus } = useContext(MainContext)

    const goal = window.goals.find(goal => goal.id === goalInFocus)
    const {
        heading,
        roadmap: goalRoadmap,
    } = goal

    const [show, setShow] = useState(true)
    const [roadmap, setRoadMap] = useState(goalRoadmap)
    const [mode, setMode] = useState('view')

    const handleClose = () => {
        setShow(false)
        setGoalInFocus(null)
    }

    const handleGoalClick = () => {
        if (mode === 'view') {
            setMode('edit')
        } else {
            // Logic to save changes to Goal and Tasks
        }
    }

    return (
        <GoalContext.Provider value={{ goalId: goalInFocus, roadmap, setRoadMap, mode }}>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{heading}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ViewEditGoalForm />
                    <TaskList />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleGoalClick}>{mode === 'view' ? 'Edit Goal' : 'Save Goal'}</Button>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </GoalContext.Provider>
    )
}

export default ViewEditGoal
