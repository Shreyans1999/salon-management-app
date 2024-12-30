const Staff = require('../models/staff');

exports.createStaff = async (req, res) => {
  try {
    const { name, specialization, workingHours } = req.body;

    const staff = await Staff.create({
      name,
      specialization,
      workingHours,
      isAvailable: true
    });

    res.status(201).json({
      message: 'Staff member created successfully',
      staff
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.findAll();
    res.json(staff);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateStaffAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { isAvailable, workingHours } = req.body;

    const staff = await Staff.findByPk(id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    await staff.update({
      isAvailable,
      workingHours
    });

    res.json({
      message: 'Staff availability updated successfully',
      staff
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};