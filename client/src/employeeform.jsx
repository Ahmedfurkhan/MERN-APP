import { useState } from 'react';
import axios from 'axios';

const EmployeeForms = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [designation, setDesignation] = useState('');
    const [gender, setGender] = useState('');
    const [courses, setCourses] = useState([]);
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Perform client-side validation
            if (!name || !email || !mobile || !designation || !gender || courses.length === 0 || !image) {
                setMessage('All fields are required.');
                return;
            }

            // Validate email format
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                setMessage('Invalid email format.');
                return;
            }

            // Validate mobile number format
            const mobilePattern = /^\d{10}$/;
            if (!mobilePattern.test(mobile)) {
                setMessage('Mobile number must be 10 digits.');
                return;
            }

            // Simulate image file validation (you can add more checks)
            if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
                setMessage('Only JPG/PNG files are allowed.');
                return;
            }

            // Check email duplication (assuming API endpoint)
            const { data } = await axios.get(`http://localhost:3001/check-email/${email}`);
            if (data.exists) {
                setMessage('Email already exists.');
                return;
            }

            // Prepare form data for backend
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('mobile', mobile);
            formData.append('designation', designation);
            formData.append('gender', gender);
            formData.append('courses', JSON.stringify(courses));
            formData.append('image', image);

            // Send data to backend
            const response = await axios.post('http://localhost:3001/add-employee', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Handle success
            console.log(response.data);
            setMessage('Employee added successfully.');
        } catch (error) {
            // Handle errors
            console.error('Error:', error);
            setMessage('Failed to add employee.');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };

    const handleCourseChange = (e) => {
        const { checked, value } = e.target;
        if (checked) {
            setCourses(prevCourses => [...prevCourses, value]);
        } else {
            setCourses(prevCourses => prevCourses.filter(course => course !== value));
        }
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <a className="navbar-brand" href="/home">Home</a>
                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="/employee">Create List</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/employeelist">Employee List</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">User</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/login">Logout</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container mt-5">
                <h2 className="mb-4">Create Employee</h2>
                {message && <div className="alert alert-danger">{message}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="mobile" className="form-label">Mobile No</label>
                        <input type="text" className="form-control" id="mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="designation" className="form-label">Designation</label>
                        <select className="form-select" id="designation" value={designation} onChange={(e) => setDesignation(e.target.value)} required>
                            <option value="">Select Designation</option>
                            <option value="HR">HR</option>
                            <option value="Manager">Manager</option>
                            <option value="Sales">Sales</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Gender</label><br />
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="gender" id="male" value="M" onChange={(e) => setGender(e.target.value)} required />
                            <label className="form-check-label" htmlFor="male">Male</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="gender" id="female" value="F" onChange={(e) => setGender(e.target.value)} required />
                            <label className="form-check-label" htmlFor="female">Female</label>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Course</label><br />
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="checkbox" id="mca" value="MCA" onChange={handleCourseChange} />
                            <label className="form-check-label" htmlFor="mca">MCA</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="checkbox" id="bca" value="BCA" onChange={handleCourseChange} />
                            <label className="form-check-label" htmlFor="bca">BCA</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="checkbox" id="bsc" value="BSC" onChange={handleCourseChange} />
                            <label className="form-check-label" htmlFor="bsc">BSC</label>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="image" className="form-label">Img Upload</label>
                        <input type="file" className="form-control" id="image" accept="image/jpeg, image/png" onChange={handleImageChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default EmployeeForms;
