import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/UserContext.jsx";

function SignUp() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      await signup(form);
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to create your account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <p className="brand-mark">TASKFLOW</p>
        <h1>Create your account</h1>
        <p className="auth-subtitle">A little more organised, one task at a time.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="name-fields">
            <input name="firstname" placeholder="First name" value={form.firstname} onChange={handleChange} required />
            <input name="lastname" placeholder="Last name" value={form.lastname} onChange={handleChange} required />
          </div>
          <input name="username" placeholder="Username" value={form.username} onChange={handleChange} minLength={3} required />
          <input name="email" type="email" placeholder="Email address" value={form.email} onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password (at least 8 characters)" value={form.password} onChange={handleChange} minLength={8} required />

          {error && <p className="form-error" role="alert">{error}</p>}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </section>
    </main>
  );
}

export default SignUp;
