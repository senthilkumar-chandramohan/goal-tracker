import { useContext, useState, useCallback } from 'react'
import PropTypes from 'prop-types'

import { GoalContext } from '../Goal/GoalContext'
import GenericAlert from '../GenericAlert'
import { storeGoals } from '../../utils/storage'
import { getDateInDDMONFormat } from '../../utils/date'

const TIME = {
    MS_PER_DAY: 86400000,
    MS_PER_WEEK: 604800000,
}

const TaskGroup = ({ type, weekMonthIdx }) => {
    const [, updateState] = useState();
    const [errMsg, setErrMsg] = useState(null);
    const forceUpdate = useCallback(() => updateState({}), []);

    const { goalId, roadmap, setRoadMap, mode } = useContext(GoalContext)
    const goal = window.goals.find(goal => goal.id === goalId)

    const toggleTaskDone = (e) => {
        const taskIndex = e.target.getAttribute('data-task-idx')
        roadmap[weekMonthIdx].tasks[taskIndex].done = !roadmap[weekMonthIdx].tasks[taskIndex].done
        goal.roadmap = roadmap
        storeGoals(window.goals)
        forceUpdate()
    }

    const handleTaskClick = (e) => {
        e.stopPropagation()
    }

    const getTaskStatus = (taskDurationSum) => {
        const goalStartDate = goal.startDate
        const daysPerWeekOrWeeksPerMonth = type === 'week' ? 7 : 4
        const msPerDayOrWeek = type === 'week' ? TIME.MS_PER_DAY : TIME.MS_PER_WEEK

        let taskStatus = ''

        if ((goalStartDate + (weekMonthIdx * daysPerWeekOrWeeksPerMonth * msPerDayOrWeek) + (taskDurationSum * msPerDayOrWeek)) < Date.now().valueOf()) {
            taskStatus = ' overdue'
        } else if ((goalStartDate + (weekMonthIdx * daysPerWeekOrWeeksPerMonth * msPerDayOrWeek) + (taskDurationSum * msPerDayOrWeek)) < (Date.now().valueOf() + TIME.MS_PER_DAY)) {
            taskStatus = ' due'
        }

        return taskStatus
    }

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

    const handleAddTask = () => {
        roadmap[weekMonthIdx].tasks.push({
            task: 'New Task',
            duration: 1,
            done: false
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
            setRoadMap(roadmap)
            forceUpdate()
        }
    }

    const getWeekOrMonthRange = () => {
        const goalStartDate = goal.startDate
        const daysPerWeekOrWeeksPerMonth = type === 'week' ? 7 : 4
        const msPerDayOrWeek = type === 'week' ? TIME.MS_PER_DAY : TIME.MS_PER_WEEK

        const startDate = goalStartDate + (weekMonthIdx * daysPerWeekOrWeeksPerMonth * msPerDayOrWeek)
        const endDate = goalStartDate + (weekMonthIdx * daysPerWeekOrWeeksPerMonth * msPerDayOrWeek) + (daysPerWeekOrWeeksPerMonth * msPerDayOrWeek) - TIME.MS_PER_DAY

        return `${getDateInDDMONFormat(new Date(startDate))} to ${getDateInDDMONFormat(new Date(endDate))}`
    }

    const groupId = `${type}${weekMonthIdx}`
    let taskDurationSum = 0

    return (
        <div id={groupId} className="task-group">
            <div id={`${groupId}Heading`} className="heading" onClick={handleTaskHeadingClick}>{type} {weekMonthIdx+1} ({getWeekOrMonthRange()})</div>
            <div id={`${groupId}Content`} className="content">
                {
                    errMsg && (
                        <GenericAlert variant={'warning'} heading={'Warning'} body={errMsg} />
                    )
                }
                {
                    roadmap[weekMonthIdx].tasks.map((taskItem, idx) => {
                        const duration = taskItem.duration
                        const unit = type === 'week' ? 'day' : 'week'

                        taskDurationSum += duration
                        if (mode === 'view') {
                            const taskStatus = getTaskStatus(taskDurationSum)
                            return (
                                <div key={idx} className={`task read-only${taskStatus}${taskItem.done ? ' done' : ''}`} data-task-idx={idx} data-duration={`${duration} ${unit}${duration > 1 ?'s' : ''}`} onClick={toggleTaskDone}>
                                    <p onClick={handleTaskClick}>{taskItem.task}</p>
                                </div>
                            )
                        } else { // mode = 'edit'
                            return (
                                <div key={idx} className="task" data-duration={`${duration} ${unit}${duration > 1 ?'s' : ''}`}>
                                    <input autoComplete='off' type="text" data-task-idx={idx} id={`${groupId}Task${idx}`} value={taskItem.task} onChange={handleTaskChange} onBlur={handleTaskBlur} />
                                    <div className="task-duration up" data-task-idx={idx} data-direction="up" id={`${groupId}TaskDuration${idx}`} onClick={handleTaskDurationChange}>&and;</div>
                                    <div className="task-duration down" data-task-idx={idx} data-direction="down" id={`${groupId}TaskDuration${idx}`} onClick={handleTaskDurationChange}>&or;</div>
                                </div>
                            )
                        }
                    })
                }
                {
                    mode !== 'view' &&
                    canAddNewTask(weekMonthIdx) && (
                        <button className='add-task' onClick={handleAddTask}>Add Task</button>
                    )
                }
            </div>
        </div>
    )
}

TaskGroup.propTypes = {
    type: PropTypes.string,
    weekMonthIdx: PropTypes.number,
}

export default TaskGroup
