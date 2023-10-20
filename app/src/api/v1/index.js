const express = require('express');
const router = express.Router();

const leadRouter = require('./routes/lead.route')

router.use('/lead', leadRouter)


module.exports = router;