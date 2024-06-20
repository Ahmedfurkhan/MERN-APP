const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const EmployeeModel = require('./omodels/Employee');
const EmployeeDetailsModel = require('./omodels/EmployeeDetails');

const app = express();
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
}));

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

app.use('/uploads', express.static(uploadDir));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

mongoose.connect("mongodb://127.0.0.1:27017/employee", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const employee = new EmployeeModel({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });
        const savedEmployee = await employee.save();
        res.json(savedEmployee);
    } catch (err) {
        console.error('Error registering employee:', err);
        res.status(400).json({ error: 'Registration failed' });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await EmployeeModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "No user found with that email" });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            res.json("Success");
        } else {
            res.status(401).json({ error: "The password is incorrect" });
        }
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ error: 'Login failed' });
    }
});

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'ahmedfurkhan289@gmail.com',
        pass: 'jxak jjnz thjd bfct',
    },
});

app.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await EmployeeModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "No user found with that email" });
        }

        const resetToken = Math.random().toString(36).substr(2);
        const resetLink = `http://localhost:3001/reset-password/${resetToken}`;

        const mailOptions = {
            from: 'ahmedfurkhan289@gmail.com',
            to: email,
            subject: 'Password Reset Request',
            text: `You requested a password reset. Click the link to reset your password: ${resetLink}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ error: "Failed to send email" });
            }
            res.json({ success: true, message: 'Password reset link sent!' });
        });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Failed to process request' });
    }
});


app.get('/check-email/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const existingEmployee = await EmployeeModel.findOne({ email });
        const emailExists = !!existingEmployee;
        res.json({ exists: emailExists });
    } catch (err) {
        console.error('Error checking email:', err);
        res.status(500).json({ error: 'Failed to check email' });
    }
});

app.post('/add-employee', upload.single('image'), async (req, res) => {
    try {
        const { name, email, mobile, designation, gender, courses } = req.body;
        const imagePath = req.file ? req.file.path : null;

        const newEmployee = new EmployeeDetailsModel({
            name,
            email,
            mobile,
            designation,
            gender,
            courses: JSON.parse(courses),
            image: imagePath
        });

        const savedEmployee = await newEmployee.save();
        res.json(savedEmployee);
    } catch (err) {
        console.error('Error adding employee:', err);
        res.status(500).json({ error: 'Failed to add employee' });
    }
});

app.get('/get-employees', async (req, res) => {
    try {
        console.log('Fetching employees...');
        const employees = await EmployeeDetailsModel.find();
        console.log('Employees fetched:', employees);
        res.json(employees);
    } catch (err) {
        console.error('Error fetching employees:', err);
        res.status(500).json({ error: 'Failed to fetch employees', details: err.message });
    }
});

app.get('/get-employees/:id', async (req, res) => {
    try {
      const employeeId = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(employeeId)) {
        return res.status(400).json({ error: 'Invalid employee ID' });
      }
  
      const employee = await EmployeeDetailsModel.findById(employeeId);
      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }
      res.json(employee);
    } catch (err) {
      console.error('Error fetching employee:', err);
      res.status(500).json({ error: 'Failed to fetch employee' });
    }
  });

  app.put('/update-employee/:id', upload.single('image'), async (req, res) => {
    try {
        const { name, email, mobile, designation, gender, courses } = req.body;
        const updateData = {
            name,
            email,
            mobile,
            designation,
            gender,
            courses: JSON.parse(courses), // Parse courses data correctly
        };

        if (req.file) {
            updateData.image = req.file.path;
        }

        const employeeId = req.params.id; // Retrieve employee ID from URL parameter

        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({ error: 'Invalid employee ID' });
        }

        const updatedEmployee = await EmployeeDetailsModel.findByIdAndUpdate(
            employeeId,
            updateData,
            { new: true } // Return updated document
        );

        if (!updatedEmployee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.json(updatedEmployee);
    } catch (err) {
        console.error('Error updating employee:', err);
        res.status(500).json({ error: 'Failed to update employee' });
    }
});

  
  app.get('/test', (req, res) => {
    res.json({ message: 'Server is working' });
  });
  
  app.listen(3001, () => {
    console.log("Server is running on port 3001");
  });
  