import { useState, useContext } from 'react'
import DatePicker from 'react-datepicker'

import { GoalContext } from './GoalContext'

const ViewEditGoalForm = () => {
    const { goalId, mode } = useContext(GoalContext)
    const goal = window.goals.find(goal => goal.id === goalId)
    const {
        heading,
        description,
        startDate,
    } = goal
    const [newStartDate, setNewStartDate] = useState(startDate)
    const readOnly = mode === 'view' ? true : false

    return (
        <form autoComplete="off">
            <div className="container">
                { !readOnly &&
                    <div className="row">
                        <div className="col-4">
                            <label className="form-label" htmlFor="heading">Heading</label>
                        </div>
                        <div className="col-8">
                            <input className="form-control" id="heading" type="text" placeholder="e.g. Learn Guitar, Become fit" maxLength={30} defaultValue={heading} required />
                        </div>
                    </div>
                }
                {
                    !(readOnly && !description) && (
                        <>
                        {
                            readOnly && (
                                <div className="row">
                                    <div className="col-12">
                                        {description}
                                    </div>
                                </div>
                            )
                        }
                        {
                            !readOnly && (
                                <div className="row">
                                    <div className="col-4">
                                        <label className="form-label" htmlFor="description">Description</label>
                                    </div>
                                    <div className="col-8">
                                        <textarea className="form-control" id="description" rows="6" cols="30" defaultValue={description}></textarea>
                                    </div>
                                </div>
                            )
                        }
                        </>
                    )
                }
                { !readOnly &&
                    <div className="row">
                        <div className="col-4">
                            <label htmlFor="startDate">Start Date</label>
                        </div>
                        <div className="col-8">
                            <DatePicker id="startDate" className="form-control" selected={newStartDate} onChange={(date) => setNewStartDate(date)} />
                        </div>
                    </div>
                }
            </div>
        </form>
    )
}

export default ViewEditGoalForm
