const Service = require('../models/service');

exports.createService = async (req, res) => {
  try {
    const { name, description, duration, price } = req.body;

    const service = await Service.create({
      name,
      description,
      duration,
      price
    });

    res.status(201).json({
      message: 'Service created successfully',
      service
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll();
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, duration, price } = req.body;

    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await service.update({
      name,
      description,
      duration,
      price
    });

    res.json({
      message: 'Service updated successfully',
      service
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};