// routes.js
const express = require('express');
const { changeLeadStatus, createLead, filterLeadsByStatus, readAllLeads, splitListIntoChunks, uploadExcelDataToMongo } = require('../helpers/lead.helper');
const { getPeerDetails } = require('../services/pbx.service');

// Function to create a lead and send a custom response
exports.createLeadAndRespond = async (req, res) => {
    try {
        const result = await createLead(req.body);
        // Custom response logic, if needed
        res.status(201).json({ message: 'Lead created successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Function to read all leads and send a custom response
exports.readAllLeadsAndRespond = async (req, res) => {
    try {
        const leads = await readAllLeads(req, res);
        // Custom response logic, if needed
        res.status(200).json({ message: 'All leads retrieved successfully', data: leads });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Function to change the status of a lead and send a custom response
exports.changeLeadStatusAndRespond = async (req, res) => {
    try {
        const result = await changeLeadStatus(req.params.leadId, req.body.status);
        // Custom response logic, if needed
        res.status(200).json({ message: 'Lead status changed successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Function to filter leads by status and send a custom response
exports.filterLeadsByStatusAndRespond = async (req, res) => {
    try {
        const leads = await filterLeadsByStatus(req.params.status);
        // Custom response logic, if needed
        res.status(200).json({ message: 'Leads filtered by status successfully', data: leads });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Function to split the list into chunks and send a custom response
exports.splitListIntoChunksAndRespond = async (req, res) => {
    try {
        const result = await splitListIntoChunks(req.params.chunkSize);
        // console.log(result.data.data);
        // Custom response logic, if needed
        res.status(200).json({ message: 'List split into chunks successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.uploadExcel = async (req, res) => {
    try {
        const file = req.file
        const result = await uploadExcelDataToMongo(file.path)
        res.status(201).json({ message: 'Excel uploaded successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


exports.login = async (req, res) => {
    try {
        const { username, password } = req.body
        const { status, data } = await getPeerDetails(username)
        if (!status) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }
        return password == `bpo${username}` ? res.status(200).json({ message: 'Login success', data: { username } }) : res.status(400).json({ message: 'Invalid credentials' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
