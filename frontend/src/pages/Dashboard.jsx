import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskCard from "../components/TaskCard.jsx";
import TaskForm from "../components/TaskForm.jsx";
import { useAuth } from "../context/UserContext.jsx";
import api from "../services/api.js";

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTasks = useCallback(async () => {
    setError("");
    try {
      const response = await api.get("/tasks");
      setTasks(response.data.tasks);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not load tasks.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const counts = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter((task) => task.status === "pending").length,
    completed: tasks.filter((task) => task.status === "completed").length,
  }), [tasks]);

  const visibleTasks = useMemo(() => {
    if (filter === "pending" || filter === "completed") {
      return tasks.filter((task) => task.status === filter);
    }
    return tasks;
  }, [tasks, filter]);

  const saveTask = async (values) => {
    try {
      if (editingTask) {
        const response = await api.put(`/tasks/${editingTask._id}`, values);
        setTasks((current) => current.map((task) => task._id === editingTask._id ? response.data.task : task));
        setEditingTask(null);
      } else {
        const response = await api.post("/tasks", values);
        setTasks((current) => [response.data.task, ...current]);
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not save this task.");
      throw requestError;
    }
  };

  const toggleTask = async (task) => {
    const status = task.status === "completed" ? "pending" : "completed";
    try {
      const response = await api.patch(`/tasks/${task._id}/status`, { status });
      setTasks((current) => current.map((item) => item._id === task._id ? response.data.task : item));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not update task status.");
    }
  };

  const deleteTask = async (task) => {
    const confirmed = window.confirm(`Delete "${task.title}"?`);
    if (!confirmed) return;

    try {
      await api.delete(`/tasks/${task._id}`);
      setTasks((current) => current.filter((item) => item._id !== task._id));
      if (editingTask?._id === task._id) setEditingTask(null);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not delete this task.");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch {
      setError("Could not log out. Please try again.");
    }
  };

  return (
    <main className="dashboard-shell">
      <section className="editor-panel">
        <header className="dashboard-header">
          <div>
            <p className="brand-mark">TASKFLOW</p>
            <h1>Your task space</h1>
            <p className="welcome-text">Welcome, {user?.firstname || user?.username}.</p>
          </div>
          <button type="button" className="logout-button" onClick={handleLogout}>Log out</button>
        </header>

        <div className="stats-grid">
          <div className="stat-card"><span>Total</span><strong>{counts.total}</strong></div>
          <div className="stat-card"><span>Pending</span><strong>{counts.pending}</strong></div>
          <div className="stat-card"><span>Completed</span><strong>{counts.completed}</strong></div>
        </div>

        <div className="editor-heading">
          <h2>{editingTask ? "Edit task" : "Add a task"}</h2>
          <p>Write it down and make room to focus.</p>
        </div>

        <TaskForm
          editingTask={editingTask}
          onSave={saveTask}
          onCancel={() => setEditingTask(null)}
        />

        {error && <p className="dashboard-error" role="alert">{error}</p>}
      </section>

      <section className="tasks-panel">
        <div className="tasks-heading">
          <div>
            <p className="eyebrow">YOUR WORKSPACE</p>
            <h2>Your tasks</h2>
          </div>
          <span className="task-count">{counts.total} {counts.total === 1 ? "task" : "tasks"}</span>
        </div>

        <nav className="filter-tabs" aria-label="Filter tasks">
          {["all", "pending", "completed"].map((value) => (
            <button
              key={value}
              type="button"
              className={filter === value ? "filter-tab active-filter" : "filter-tab"}
              onClick={() => setFilter(value)}
            >
              {value[0].toUpperCase() + value.slice(1)}
            </button>
          ))}
        </nav>

        {loading ? (
          <div className="empty-state">Loading your tasks...</div>
        ) : visibleTasks.length === 0 ? (
          <div className="empty-state">
            <span className="empty-mark">—</span>
            <h3>{filter === "all" ? "Nothing here yet" : `No ${filter} tasks`}</h3>
            <p>{filter === "all" ? "Add your first task using the form." : "Try another filter or add a new task."}</p>
          </div>
        ) : (
          <div className="task-grid">
            {visibleTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={setEditingTask}
                onDelete={deleteTask}
                onToggle={toggleTask}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Dashboard;
