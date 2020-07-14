const express = require('express');
const mongoose = require('mongoose');
const router = express();

// Use Format Json 
router.use(express.json());

// Call Route using Port DEFAULT 3000 
const port = process.env.port || 3000
router.listen(port, () => console.log(' using this Port  =>  localhost:3000'));

/// Connect to DataBase 
mongoose.connect('mongodb://localhost/Employee_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connect to DataBase With SuccessFully'))
    .catch((error) => console.error('Faild To Connect' + error))

// Schema oor Model Employee 
const Employee = mongoose.model('Employee', new mongoose.Schema({
    FullName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    Email: {
        type: String,
        required: true,
        trim: true
    },
    Job: {
        type: String,
        enum: ['IT', 'HR', 'Sales', 'Others'],
        required: true
    },
    IsDeleted: Number,
}));

// Method Get Employees 
router.get('/Api/Employees', async (req, res) => {
    const query = await Employee.find().sort({ DateInsert: -1 });
    if (query.length > 0) {
        res.send(query);
    } else {
        res.send('Not Found In Employees ')
    }

});

// Post : Create New Employee 
router.post('/Api/Employees', async (req, res) => {
    const employee = new Employee({
        FullName: req.body.FullName,
        Email: req.body.Email,
        Job: req.body.Job,
        IsDeleted: 0
    });
    try {
        const result = await employee.save();
        res.send(result);
    } catch (error) {
        res.send(error);
    }
});