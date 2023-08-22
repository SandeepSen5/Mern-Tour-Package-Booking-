import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react'; // Import useEffect here
import { Link, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/slices/agent/agentSlice';

const userSchema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required').trim(),
  password: yup
    .string()
    .required('Password is required')
    .min(4, 'Password must be at least 4 characters')
    .max(10, "Password can't exceed 10 characters")
    .trim(),
}).test('blank-check', 'Please fill out all fields.', (values) => {
  // Check if any of the fields are blank (empty or whitespace-only)
  return Object.values(values).every((value) => value.trim() !== '');
});

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [redirect, setRedirect] = useState(null);
  const dispatch = useDispatch();
  const { agent, agentmessage } = useSelector((state) => state.agent);

  const notify = (error) => toast.info(error, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'colored',
  });

  // Use a single useEffect for both agent and agentmessage
  useEffect(() => {
    if (agent) {
      setRedirect('/agent/profile');
    }
    if (agentmessage) {
      notify(agentmessage);
    }
  }, [agent, agentmessage]);

  async function handleLogin(ev) {
    ev.preventDefault();
    try {
      await userSchema.validate({ email, password }, { abortEarly: false });
      const agentData = { email, password };
      dispatch(login(agentData));
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const newErrors = {};
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      }
    }
  }

  return (
    <div className="grow flex items-center justify-around">
      <div className="-mt-20">
        <h1 className="text-4xl text-center mb-4">#Agent Login</h1>
        <form className="max-w-md mx-auto" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(ev) => {
              setEmail(ev.target.value);
            }}
          />
          {errors.email && <div className="text-red-500">{errors.email}</div>}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(ev) => {
              setPassword(ev.target.value);
            }}
          />
          {errors.password && <div className="text-red-500">{errors.password}</div>}
          <button className="primary" type="submit">Login</button>
          <div className="text-center py-2 text-gray-500">
            Don't have an Account?
            <Link className="text-black" to="/agent/register">Register Now</Link>
          </div>
          <ToastContainer />
        </form>
      </div>
      {/* Render the Navigate component outside of JSX */}
      {redirect && <Navigate to={redirect} />}
    </div>
  );
}
