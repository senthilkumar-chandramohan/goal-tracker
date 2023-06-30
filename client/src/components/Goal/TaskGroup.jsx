const TaskGroup = ({heading, tasks}) => {
    return (
        <div className="task-group">
            <div className="heading">{heading}</div>
            <div className="content">
                {tasks.map((task, idx)=><div className="task" data-duration={task.duration}>{task.task}</div>)}
            </div>
        </div>
    )
}

export default TaskGroup
