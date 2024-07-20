import "../styles/sheets/addtask.scss";

const AddTask = () => {
  return (
    <div className="addtask">
        <div className="addtask-header">
            <div className="cancel">Cancel</div>
            <div className="newtask">New Task</div>
            <div className="done">Done</div>
        </div>
        <div className="input-part">
            <div className="input-title">
                <div className="label-box">Title</div>
                <input type="text" />
            </div>
            <div className="input-des input-title">
                <div className="label-box">Description</div>
                <textarea name="" id="" placeholder="Enter task description"></textarea>
            </div>
        </div>
        <div className="date-time">
            <div className="date-part">
                <div className="label-box">Due date</div>
                <input type="date" />
            </div>
            <div className="time-part date-part">
                <div className="label-box">Estimate task</div>
                <input type="time" />
            </div>
        </div>
    </div>
  )
}

export default AddTask