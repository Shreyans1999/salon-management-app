const express = require('express');
const app = express();
const fs = require('fs');
const https = require('https');
const sequelize = require('./backend/util/database');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import Models
const User = require('./backend/models/user');
const Appointment = require('./backend/models/appointment');
const Service = require('./backend/models/service');
const Staff = require('./backend/models/staff');
const Review = require('./backend/models/review');
const Payment = require('./backend/models/payment');

// Import Routes
const authRoutes = require('./backend/routes/auth-routes');
const appointmentRoutes = require('./backend/routes/appointment-routes');
const serviceRoutes = require('./backend/routes/service-routes');
const staffRoutes = require('./backend/routes/staff-routes');
const reviewRoutes = require('./backend/routes/review-routes');
const paymentRoutes = require('./backend/routes/payment-routes');

app.use(bodyParser.json({ extended: false }));
app.use(cors());
app.use('/frontend', express.static('frontend'));

// Routes Configuration
app.use('/auth', authRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/services', serviceRoutes);
app.use('/staff', staffRoutes);
app.use('/reviews', reviewRoutes);
app.use('/payments', paymentRoutes);

// Define Relationships
User.hasMany(Appointment);
Appointment.belongsTo(User);
Staff.hasMany(Appointment);
Appointment.belongsTo(Staff);
Service.hasMany(Appointment);
Appointment.belongsTo(Service);
User.hasMany(Review);
Review.belongsTo(User);
User.hasMany(Payment);
Payment.belongsTo(User);

const privateKey = fs.readFileSync('server.key');
const certificate = fs.readFileSync('server.cert');

const dotenv = require('dotenv');
dotenv.config();

sequelize.sync({ force: true })
  .then(() => {
    console.log('Database synchronized');
    https.createServer({ key: privateKey, cert: certificate }, app)
      .listen(process.env.PORT || 3000, () => {
        console.log('Server is running on https://localhost:3000');
      });
  })
  .catch(err => {
    console.error('Database synchronization error:', err);
    process.exit(1);
  });