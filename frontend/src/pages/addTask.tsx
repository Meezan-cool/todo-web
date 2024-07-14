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
                <div className="input-task">Title</div>
                <input type="text" />
            </div>
            <div className="input-des input-title">
                <div className="input-description">Description</div>
                <textarea name="" id="" placeholder="Enter task description"></textarea>
            </div>
        </div>
    </div>
  )
}

export default AddTask