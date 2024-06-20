import { useState, useEffect } from 'react';
import axios from 'axios';
import './css/Employee.css';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch employees from the backend
    axios.get('http://localhost:3001/get-employees')
      .then(response => {
        setEmployees(response.data);
      })
      .catch(error => {
        console.error('Error fetching employees:', error);
      });
  }, []);

  const handleDelete = (id) => {
    const updatedEmployees = employees.filter(employee => employee._id !== id);
    setEmployees(updatedEmployees);
    // Optionally, send a delete request to the backend
    axios.delete(`http://localhost:3001/delete-employee/${id}`)
      .catch(error => console.error('Error deleting employee:', error));
  };

  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.mobile.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="employee-list-container">
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

      <div className="employee-list-container">
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Enter Search Keyword" 
            className="form-control search-input" // Added Bootstrap class "form-control"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <p className="total-employees">Total Employees: {filteredEmployees.length}</p>
        </div>
        
        <table className="table">
          <thead className="table-light">
            <tr>
              <th>Unique Id</th>
              <th>Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile No</th>
              <th>Designation</th>
              <th>Gender</th>
              <th>Course</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map(employee => (
              <tr key={employee._id}>
                <td>{employee._id}</td>
                <td><img src={`http://localhost:3001/${employee.image}`} alt="employee" className="employee-image" /></td>
                <td>{employee.name}</td>
                <td><a href={`mailto:${employee.email}`}>{employee.email}</a></td>
                <td>{employee.mobile}</td>
                <td>{employee.designation}</td>
                <td>{employee.gender}</td>
                <td>{employee.courses}</td>
                <td>
                  <a href="/update">
                  <button className="btn btn-sm btn-primary">Edit</button>
                  </a>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(employee._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
