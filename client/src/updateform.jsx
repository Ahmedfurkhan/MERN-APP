import  { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdateForms = () => {
    const [employee, setEmployee] = useState({
        name: '',
        email: '',
        mobile: '',
        designation: '',
        gender: '',
        courses: [],
        uniqueid: '',
    });
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    // Fetch employee details useCallback
    const fetchEmployee = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:3001/get-employees/${id}`);
            const fetchedEmployee = response.data;
            setEmployee(fetchedEmployee);
        } catch (error) {
    //        console.error('Error fetching employee:', error);
     //      setMessage('Failed to fetch employee data.');
        }
    }, [id]);

    useEffect(() => {
        fetchEmployee();
    }, [fetchEmployee]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee(prevEmployee => ({
            ...prevEmployee,
            [name]: value
        }));
    };

    const handleCourseChange = (e) => {
        const { checked, value } = e.target;
        setEmployee(prevEmployee => ({
            ...prevEmployee,
            courses: checked
                ? [...prevEmployee.courses, value]
                : prevEmployee.courses.filter(course => course !== value)
        }));
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            for (const key in employee) {
                if (key === 'courses') {
                    formData.append(key, JSON.stringify(employee[key]));
                } else {
                    formData.append(key, employee[key]);
                }
            }
            if (image) {
                formData.append('image', image);
            }

            await axios.put(`http://localhost:3001/update-employee/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setMessage('Employee updated successfully.');
            navigate('/employeelist');
        } catch (error) {
            console.error('Error:', error);
            setMessage('Failed to update employee.');
        }
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                {/* ... (navbar code remains unchanged) ... */}
            </nav>

            <div className="container mt-5">
                <h2 className="mb-4">Edit Employee</h2>
                {message && <div className="alert alert-info">{message}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="uniqueid" className="form-label">UniqueID</label>
                        <input type="text" className="form-control" id="uniqueid" name="uniqueid" value={employee.uniqueid} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input type="text" className="form-control" id="name" name="name" value={employee.name} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" className="form-control" id="email" name="email" value={employee.email} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="mobile" className="form-label">Mobile No</label>
                        <input type="text" className="form-control" id="mobile" name="mobile" value={employee.mobile} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="designation" className="form-label">Designation</label>
                        <select className="form-select" id="designation" name="designation" value={employee.designation} onChange={handleChange} required>
                            <option value="">Select Designation</option>
                            <option value="HR">HR</option>
                            <option value="Manager">Manager</option>
                            <option value="Sales">Sales</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Gender</label><br />
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="gender" id="male" value="M" checked={employee.gender === 'M'} onChange={handleChange} required />
                            <label className="form-check-label" htmlFor="male">Male</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="gender" id="female" value="F" checked={employee.gender === 'F'} onChange={handleChange} required />
                            <label className="form-check-label" htmlFor="female">Female</label>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Courses</label><br />
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="checkbox" id="mca" value="MCA" checked={employee.courses.includes('MCA')} onChange={handleCourseChange} />
                            <label className="form-check-label" htmlFor="mca">MCA</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="checkbox" id="bca" value="BCA" checked={employee.courses.includes('BCA')} onChange={handleCourseChange} />
                            <label className="form-check-label" htmlFor="bca">BCA</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="checkbox" id="bsc" value="BSC" checked={employee.courses.includes('BSC')} onChange={handleCourseChange} />
                            <label className="form-check-label" htmlFor="bsc">BSC</label>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="image" className="form-label">Update Image</label>
                        <input type="file" className="form-control" id="image" accept="image/jpeg, image/png" onChange={handleImageChange} />
                    </div>
                    <button type="submit" className="btn btn-primary">Update</button>
                </form>
            </div>
        </div>
    );
};

export default UpdateForms;
