import { useState, useContext, useCallback } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { GoalContext } from './GoalContext'
import { MainContext } from '../MainContext'
import ViewEditGoalForm from './ViewEditGoalForm'
import TaskList from '../Task/TaskList'

import { storeGoals } from '../../utils/storage'

const ViewEditGoal = () => {
    const { goalInFocus, setGoalInFocus } = useContext(MainContext)

    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    const goal = window.goals.find(goal => goal.id === goalInFocus)
    const {
        heading,
        roadmap: goalRoadmap,
    } = goal

    const [show, setShow] = useState(true)
    const [roadmap, setRoadMap] = useState(goalRoadmap)
    const [mode, setMode] = useState('view')

    const handleClose = () => {
        if (mode === 'view') {
            setShow(false)
            setGoalInFocus(null)
        } else {
            console.log("ASDASDASD")
            setRoadMap(goalRoadmap)
            setMode('view')
            forceUpdate()
        }
    }

    const handleGoalClick = () => {
        if (mode === 'view') {
            setMode('edit')
        } else {
            // Logic to save changes to Goal and Tasks
            const heading = document.getElementById('heading').value
            const description = document.getElementById('description').value
            const startDate = new Date(document.getElementById('startDate').value).valueOf()

            goal.heading = heading
            goal.description = description
            goal.startDate = startDate
            goal.roadmap = roadmap
            // Store updated goals object in local storage
            storeGoals(window.goals)
            setMode('view')
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
                    <Button variant="primary" onClick={handleGoalClick}>{mode === 'view' ? 'Edit Goal' : 'Save Changes'}</Button>
                    <Button variant="secondary" onClick={handleClose}>{mode === 'view' ? 'Close' : 'Cancel'}</Button>
                </Modal.Footer>
            </Modal>
        </GoalContext.Provider>
    )
}

export default ViewEditGoal
