const Review = require('../models/review');
const Appointment = require('../models/appointment');

exports.createReview = async (req, res) => {
  try {
    const { appointmentId, rating, comment } = req.body;
    const userId = req.user.id;

    // Verify appointment exists and belongs to user
    const appointment = await Appointment.findOne({
      where: {
        id: appointmentId,
        UserId: userId,
        status: 'completed'
      }
    });

    if (!appointment) {
      return res.status(404).json({ 
        message: 'Appointment not found or not eligible for review' 
      });
    }

    const review = await Review.create({
      UserId: userId,
      AppointmentId: appointmentId,
      rating,
      comment
    });

    res.status(201).json({
      message: 'Review submitted successfully',
      review
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addStaffResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const { staffResponse } = req.body;

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await review.update({ staffResponse });

    res.json({
      message: 'Response added successfully',
      review
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};