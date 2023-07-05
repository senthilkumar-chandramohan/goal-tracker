import { useState, useContext, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { GoogleLoginContext } from './GoogleLoginContext'
import NewGoalForm from './Goal/NewGoalForm'
import TaskList from './Goal/TaskList'

const NewGoal = () => {
    const [show, setShow] = useState(false)
    const [modalTitle, setModalTitle] = useState("New Goal")
    const [ctaText, setCtaText] = useState("Add Goal")
    const [mainView, setMainView] = useState("form")
    const [heading, setHeading] = useState("")
    const [deadline, setDeadline] = useState("")
    const [timePerDay, setTimePerDay] = useState("")
    const { addManualEvent, handleSignoutClick, listUpcomingEvents } = useContext(GoogleLoginContext)

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)
    
    const handleAddGoalTasks = () => {
        if (ctaText === 'Add Goal') {
            const d = new Date(document.getElementById('startDate').value)
            const heading = document.getElementById('heading').value
            const description = document.getElementById('description').value
            const count = document.getElementById('count').value
            const week = document.getElementById('week')
            const month = document.getElementById('month')
            const timePerDayDropDown = document.getElementById('timePerDay')
            const timePerDay = timePerDayDropDown.options[timePerDayDropDown.selectedIndex].text

            const weekOrMonth = week.checked ? "week" : "month"
            // addManualEvent(heading, description, `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`)
            const deadline = `${ count } ${ weekOrMonth }${ count === 1 ? "" : "s" }`

            setHeading(heading)
            setDeadline(deadline)
            setTimePerDay(timePerDay)
            setMainView("tasklist")
            setCtaText("Add Tasks")
            setModalTitle("Task List")
        } else {
        }
    }

    useEffect(() => {
        // const getEvents = async () => {
        //     console.log("ASDASASDASDSAD")
        //     console.log(await listUpcomingEvents())
        // }

        // getEvents()
    })

    return (
        <>
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
                <Modal.Title>{modalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    mainView === "form" && <NewGoalForm />
                }
                {
                    mainView === "tasklist" && <TaskList heading={heading} deadline={deadline} timePerDay={timePerDay} />
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                <Button variant="primary" onClick={handleAddGoalTasks}>{ ctaText }</Button>
            </Modal.Footer>
            </Modal>
        </>
    )
}

export default NewGoal
