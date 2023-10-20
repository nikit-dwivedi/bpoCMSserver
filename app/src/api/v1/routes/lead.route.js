const express = require('express');
const { createLeadAndRespond, readAllLeadsAndRespond, changeLeadStatusAndRespond, filterLeadsByStatusAndRespond, splitListIntoChunksAndRespond, uploadExcel, login } = require('../controllers/lead.controller');
const uploads = require('../middleware/multer.middleware');
const router = express.Router();

// Define routes
router.post('/', createLeadAndRespond);
router.get('/all', readAllLeadsAndRespond);
router.post('/:leadId/status', changeLeadStatusAndRespond);
router.post('/excel', uploads.single('lead'), uploadExcel);
router.get('/:status', filterLeadsByStatusAndRespond);
router.get('/split/:chunkSize', splitListIntoChunksAndRespond);
router.post('/login', login);

module.exports = router;
