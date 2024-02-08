import { useState, useContext, useCallback } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { GoalContext } from './GoalContext'
import { MainContext } from '../MainContext'
import ViewEditGoalForm from './ViewEditGoalForm'
import TaskList from '../Task/TaskList'

import { storeGoals } from '../../utils/storage'

const ViewEditGoal = () => {
    const [, setTaskInitiated] = useState(false)
    const [loading, setLoading] = useState(false)
    const [flashMessage, setFlashMessage] = useState("")
    const { goalInFocus, setGoalInFocus } = useContext(MainContext)

    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    const goal = window.goals.find(goal => goal.id === goalInFocus.id)
    const {
        heading,
        roadmap: goalRoadmap,
    } = goal

    const goalRoadmapClone = JSON.parse(JSON.stringify(goalRoadmap))
    const [show, setShow] = useState(true)
    const [roadmap, setRoadMap] = useState(goalRoadmapClone)
    const [mode, setMode] = useState('view')

    const handleClose = () => {
        if (mode === 'view') {
            setShow(false)
            setGoalInFocus(null)
        } else {
            setRoadMap(goalRoadmap)
            setMode('view')
            forceUpdate()
        }
    }

    const showFlashMessage = (message, timeout) => {
        setFlashMessage(message)
        setTimeout(()=>{
            setFlashMessage("")
        }, timeout)
    }

    const handleGoalClick = () => {
        if (mode === 'view') {
            setMode('edit')
            window.hj('event', 'Goal Edit Start')
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
            showFlashMessage("Saving...", 500)
            window.setTimeout(()=>{
                showFlashMessage("Changes saved!", 2000)
            }, 1000)
            window.hj('event', 'Goal and Tasks saved')
        }
    }

    const handleDeleteGoal = () => {
        const conf = confirm("Sure you want to delete this goal?")

        if (conf) {
            const goalIndex = window.goals.findIndex(goal => goal.id === goalInFocus.id)
            window.goals.splice(goalIndex, 1)
            storeGoals(window.goals)
            setShow(false)
            setGoalInFocus(null)
        }
    }

    return (
        <GoalContext.Provider value={{ goalId: goalInFocus.id, roadmap, setRoadMap, mode, setMode, loading, setLoading, setTaskInitiated }}>
            <Modal
                show={show}
                onHide={handleClose}
            >
                {
                    loading && (
                        <div className="loading-spinner">
                            <div className="spinner-border m-5" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )
                }
                <Modal.Header closeButton>
                    <Modal.Title className={goalInFocus.status}>{heading}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ViewEditGoalForm />
                    <TaskList />
                    {
                        mode === 'view' && (
                            <div className="container">
                                <div className="row">
                                    <div className='col-12 delete-goal'>
                                        <button onClick={handleDeleteGoal}>Delete Goal</button>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </Modal.Body>
                <Modal.Footer>
                    <div className="flash-message">{flashMessage}</div>
                    <Button variant="primary" onClick={handleGoalClick}>{mode === 'view' ? 'Edit Goal' : 'Save'}</Button>
                    <Button variant="secondary" onClick={handleClose}>{mode === 'view' ? 'Close' : 'Cancel'}</Button>
                </Modal.Footer>
            </Modal>
        </GoalContext.Provider>
    )
}

export default ViewEditGoal
