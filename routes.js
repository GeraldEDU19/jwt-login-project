const express = require('express');
const userRoutes = require('./routes/user.routes');

const router = express.Router();

router.use('/users', userRoutes);

module.exports = router;
