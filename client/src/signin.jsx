import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetMessage, setResetMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/login', { email, password })
            .then(result => {
                console.log(result);
                if (result.data === "Success") {
                    setMessage('Login successful!');
                    navigate('/home');
                } else {
                    setMessage(result.data); // Display the exact error message from the server
                }
            })
            .catch(err => {
                console.error(err.response);
                setMessage('Login failed. Please try again later.');
            });
    };

    const handleForgotPassword = () => {
        setShowModal(true);
    };

    const handleResetSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/forgot-password', { email: resetEmail })
            .then(result => {
                console.log(result);
                setResetMessage('Password reset link sent!');
            })
            .catch(err => {
                console.error(err.response);
                setResetMessage('Failed to send reset link. Please try again later.');
            });
    };

    return (
        <div className="d-flex justify-content-center align-items-center  vh-100">
            <div className="bg-white p-3 rounded w-25">
                <h2 className="d-flex justify-content-center">Sign In</h2>
                {message && <div className="alert alert-info">{message}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email">
                            <strong>Email</strong>
                        </label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            autoComplete="off"
                            name="email"
                            className="form-control rounded-0"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password">
                            <strong>Password</strong>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            autoComplete="off"
                            name="password"
                            className="form-control rounded-0"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <p className="text-center mt-3">
                        New User? <a href="/register">Register</a>
                    </p>
                    <p className="text-center mt-3">
                        <a href="#" onClick={handleForgotPassword}>Forgot Password?</a>
                    </p>
                    <button type="submit" className="btn btn-success w-100 rounded-0">
                        Login
                    </button>
                </form>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Reset Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {resetMessage && <div className="alert alert-info">{resetMessage}</div>}
                    <form onSubmit={handleResetSubmit}>
                        <div className="mb-3">
                            <label htmlFor="resetEmail">
                                <strong>Email</strong>
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                autoComplete="off"
                                name="resetEmail"
                                className="form-control rounded-0"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100 rounded-0">
                            Send Reset Link
                        </button>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default SignIn;
