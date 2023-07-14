import { useContext, useState, useCallback } from 'react'
import { GoalContext } from '../Goal/GoalContext'
import MyAlert from '../MyAlert';

const TaskGroup = ({ type, weekMonthIdx }) => {
    const [, updateState] = useState();
    const [errMsg, setErrMsg] = useState(null);
    const forceUpdate = useCallback(() => updateState({}), []);

    const { goal } = useContext(GoalContext)
    const roadmap = goal.roadmap

    const handleTaskHeadingClick = (elem) => {
        const group = document.getElementById(`${type}${elem.target.id.substr(type.length,1)}`)
        if (group.classList.contains('minimize')) {
            group.classList.remove('minimize')
        } else {
            group.classList.add('minimize')
        }
    }

    const canAddNewTask = () => {
        const unitBooked = roadmap[weekMonthIdx].tasks.reduce((totalDuration, task)=>totalDuration+task.duration, 0)
        const upperLimit = type === 'week' ? 7 : 4 // 7 days in a week / 4 weeks in a month
        const availableSlots = upperLimit - unitBooked
        return availableSlots > 0 ? true : false
    }

    const handleAddTask = (e) => {
        roadmap[weekMonthIdx].tasks.push({
            task: '',
            duration: 1
        })
        forceUpdate()
    }

    const validateDurationChange = (increment, taskIdx) => {
        const unitBooked = roadmap[weekMonthIdx].tasks.reduce((totalDuration, task)=>totalDuration+task.duration, 0)
        const upperLimit = type === 'week' ? 7 : 4 // 7 days in a week / 4 weeks in a month
        const availableLimit = upperLimit - unitBooked
        
        if (increment) {
            if (availableLimit > 0) {
                return { isChangeValid: true, errorMsg: null }
            } else {
                return { isChangeValid: false, errorMsg: `Can add only upto ${type === 'week' ? '7 days in a week!' : '4 weeks in a month!'}` }
            }
        } else {
            const currentValue = roadmap[weekMonthIdx].tasks[taskIdx].duration

            if (currentValue === 1) {
                return { isChangeValid: false, errorMsg: 'Value has to be greater than 1' }
            }

            if (availableLimit + 1 === upperLimit) {
                return { isChangeValid: false, errorMsg: `Need at least one ${type === 'week' ? 'day in a week!' : 'week in a month!'}` }
            } else {
                return { isChangeValid: true, errorMsg: null }
            }
        }
        
    }

    const handleTaskDurationChange = (elem) => {
        // const weekMonthIdx = elem.target.getAttribute('data-week-month-idx')
        const taskIdx = elem.target.getAttribute('data-task-idx')
        const increment = elem.target.getAttribute('data-direction') === "up" ? true : false

        const { isChangeValid, errorMsg } = validateDurationChange(increment, taskIdx)

        setErrMsg(null)
        forceUpdate()

        if (isChangeValid) {
            if (increment) {
                roadmap[weekMonthIdx].tasks[taskIdx].duration += 1
            } else {
                roadmap[weekMonthIdx].tasks[taskIdx].duration -= 1
            }
        } else {
            // Display errorMsg
            console.log(errorMsg)
            setErrMsg(errorMsg)
        }

        forceUpdate()
    }

    const handleTaskChange = (e) => {
        const taskIndex = e.target.getAttribute('data-task-idx')

        roadmap[weekMonthIdx].tasks[taskIndex].task = e.target.value
        forceUpdate()
    }

    const handleTaskBlur = (e) => {
        if (e.target.value.length === 0) {
            const taskIndex = e.target.getAttribute('data-task-idx')

            roadmap[weekMonthIdx].tasks.splice(taskIndex,1)
            forceUpdate()
        }
    }

    const groupId = `${type}${weekMonthIdx}`

    return (
        <div id={groupId} className="task-group">
            <div id={`${groupId}Heading`} className="heading" onClick={handleTaskHeadingClick}>{type} {weekMonthIdx+1}</div>
            <div id={`${groupId}Content`} className="content">
                {
                    errMsg && (
                        <MyAlert variant={'warning'} heading={'Warning'} body={errMsg} />
                    )
                }
                {
                    roadmap[weekMonthIdx].tasks.map((taskItem, idx) => {
                        const duration = taskItem.duration
                        const unit = type === 'week' ? 'day' : 'week'

                        return (
                            <div key={idx} className="task" data-duration={`${duration} ${unit}${duration > 1 ?'s' : ''}`}>
                                <input autoComplete='off' type="text" data-task-idx={idx} id={`${groupId}Task${idx}`} value={taskItem.task} onChange={handleTaskChange} onBlur={handleTaskBlur} />
                                <div className="task-duration up" data-task-idx={idx} data-direction="up" id={`${groupId}TaskDuration${idx}`} onClick={handleTaskDurationChange}>&and;</div>
                                <div className="task-duration down" data-task-idx={idx} data-direction="down" id={`${groupId}TaskDuration${idx}`} onClick={handleTaskDurationChange}>&or;</div>
                            </div>
                        )
                    })
                }
                {
                    canAddNewTask(weekMonthIdx) && (
                        <button className='add-task' onClick={handleAddTask}>Add Task</button>
                    )
                }
            </div>
        </div>
    )
}

export default TaskGroup
