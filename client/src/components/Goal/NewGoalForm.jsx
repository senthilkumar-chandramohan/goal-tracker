import { useState } from 'react'
import DatePicker from 'react-datepicker'

const NewGoalForm = () => {
    const [startDate, setStartDate] = useState(new Date())

    return (
        <form autoComplete="off">
            <div className="container">
                <div className="row">
                    <div className="col-4">
                        <label className="form-label" htmlFor="heading">Heading</label>
                    </div>
                    <div className="col-8">
                        <input className="form-control" id="heading" type="text" placeholder="e.g. Learn Guitar, Become fit" maxLength={30} required />
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <label className="form-label" htmlFor="description">Description (optional)</label>
                    </div>
                    <div className="col-8">
                        <textarea className="form-control" id="description" rows="6" cols="30"></textarea>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <label htmlFor="startDate">Start Date</label>
                    </div>
                    <div className="col-8">
                        <DatePicker id="startDate" className="form-control" selected={startDate} onChange={(date) => setStartDate(date)} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <label htmlFor="count">Deadline</label>
                    </div>
                    <div className="col-2">
                        <select className="form-select" id="count" defaultValue="4">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                        </select>
                    </div>
                    <div className="col-3 form-check">
                        <input className="form-check-input" id="week" type="radio" name="unit" value="w" checked /> <label className="form-check-label" htmlFor="week">Week(s)</label>
                    </div>
                    <div className="col-3 form-check">
                        <input className="form-check-input" id="month" type="radio" name="unit" value="m" /> <label className="form-check-label" htmlFor="month">Month(s)</label>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default NewGoalForm
