const Appointment = require('../models/appointment');
const Service = require('../models/service');
const Staff = require('../models/staff');
const emailService = require('../services/email');
const smsService = require('../services/sms');

exports.createAppointment = async (req, res) => {
  try {
    const { serviceId, staffId, date, time, notes } = req.body;
    const userId = req.user.id;

    // Check service and staff availability
    const service = await Service.findByPk(serviceId);
    const staff = await Staff.findByPk(staffId);

    if (!service || !staff) {
      return res.status(404).json({ message: 'Service or staff not found' });
    }

    // Check if time slot is available
    const existingAppointment = await Appointment.findOne({
      where: {
        staffId,
        date,
        time,
        status: 'confirmed'
      }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'Time slot not available' });
    }

    const appointment = await Appointment.create({
      UserId: userId,
      ServiceId: serviceId,
      StaffId: staffId,
      date,
      time,
      notes,
      status: 'confirmed'
    });

    // Send confirmation email and SMS
    await emailService.sendAppointmentConfirmation(req.user.email, appointment);
    await smsService.sendSMS(
      req.user.phone,
      `Your appointment is confirmed for ${date} at ${time}`
    );

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const appointments = await Appointment.findAll({
      where: { UserId: userId },
      include: [
        { model: Service },
        { model: Staff }
      ],
      order: [['date', 'ASC'], ['time', 'ASC']]
    });

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.UserId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    // Notify user about cancellation
    await emailService.sendAppointmentConfirmation(
      req.user.email,
      'Your appointment has been cancelled'
    );

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};