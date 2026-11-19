function TaskCard({ task, onEdit, onDelete, onToggle }) {
  const completed = task.status === "completed";

  const dateLabel = new Date(task.createdAt).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <article className={`task-card ${completed ? "task-card-completed" : ""}`}>
      <div className="task-card-top">
        <span className={`status-label ${completed ? "status-completed" : "status-pending"}`}>
          {completed ? "Completed" : "Pending"}
        </span>
        <span className="task-date">{dateLabel}</span>
      </div>

      <h3 className={completed ? "task-title completed-title" : "task-title"}>
        {task.title}
      </h3>

      {task.description && <p className="task-description">{task.description}</p>}

      <div className="task-actions">
        <button type="button" className="text-button" onClick={() => onToggle(task)}>
          {completed ? "Mark pending" : "Mark complete"}
        </button>
        <button type="button" className="text-button" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button type="button" className="delete-button" onClick={() => onDelete(task)}>
          Delete
        </button>
      </div>
    </article>
  );
}

export default TaskCard;
