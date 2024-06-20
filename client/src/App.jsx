import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from './signup';
import SignIn from './signin';
import Dashboard from './dashboard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EmployeeForms from './employeeform';
import EmployeeList from './employeelist';
import UpdateForms from './updateform';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/employee" element={<EmployeeForms />} />
        <Route path="/employeelist" element={<EmployeeList />} />
        <Route path="/update" element={<UpdateForms />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
