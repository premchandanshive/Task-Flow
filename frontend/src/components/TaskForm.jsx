import { useEffect, useState } from "react";

function TaskForm({ onSave, editingTask, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitle(editingTask?.title || "");
    setDescription(editingTask?.description || "");
  }, [editingTask]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim()) return;

    setSaving(true);
    try {
      await onSave({ title: title.trim(), description: description.trim() });
      setTitle("");
      setDescription("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <label htmlFor="task-title">Task title</label>
      <input
        id="task-title"
        type="text"
        maxLength={120}
        placeholder="What do you need to do?"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
      />

      <label htmlFor="task-description">Description</label>
      <textarea
        id="task-description"
        rows="5"
        maxLength={2000}
        placeholder="Add a few details..."
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />

      <div className="form-actions">
        <button className="primary-button" type="submit" disabled={saving || !title.trim()}>
          {saving ? "Saving..." : editingTask ? "Save changes" : "Add task"}
        </button>
        {editingTask && (
          <button className="secondary-button" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;
