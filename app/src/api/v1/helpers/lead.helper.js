const xlsx = require('xlsx');
const fs = require('fs');
const LeadModel = require('../models/leads.model'); // Assuming the schema is in a separate file
const { formatLead } = require('./format.helper');
const { getPeersStatuses } = require('../services/pbx.service');

// Function to create a new lead document
exports.createLead = async (leadData) => {
    try {
        const formattedData = formatLead(leadData)
        const newLead = new LeadModel(formattedData);
        const result = await newLead.save();
        return result;
    } catch (error) {
        throw error;
    }
}

// Function to read all lead documents
exports.readAllLeads = async () => {
    try {
        const leads = await LeadModel.find({});
        return leads;
    } catch (error) {
        throw error;
    }
}

// Function to change the status of a lead document
exports.changeLeadStatus = async (leadId, newStatus) => {
    try {
        const result = await LeadModel.updateOne({ leadId }, { $set: { status: newStatus } });
        return result;
    } catch (error) {
        throw error;
    }
}

// Function to filter leads by status
exports.filterLeadsByStatus = async (status) => {
    try {
        const leads = await LeadModel.find({ status });
        return leads;
    } catch (error) {
        throw error;
    }
}

// Function to split the list into the specified number of chunks
exports.splitListIntoChunks = async (chunkCount) => {
    try {
        const data = await getPeersStatuses()
        const filteredData = data.data.data.filter((user) => user.state === "OK")
        const leads = await LeadModel.find({});
        const chunkSize = Math.ceil(leads.length / filteredData.length);
        let result = {};
        userCount = 0
        for (let i = 0; i < leads.length; i += chunkSize) {
            const chunk = leads.slice(i, i + chunkSize);
            const returnData = {
                user: filteredData[userCount],
                [filteredData[userCount].id]: chunk
            }
            result = { ...result, [filteredData[userCount].id]: chunk };
            userCount++
        }

        return result;
    } catch (error) {
        throw error;
    }
};


exports.uploadExcelDataToMongo = async (filePath) => {
    try {
        // Read the Excel file
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const excelData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // Map the Excel data to the LeadModel schema and generate leadId
        const mappedData = await Promise.all(excelData.map(async (row) => formatLead(row)));

        // Upload the data to the MongoDB database
        const result = await LeadModel.insertMany(mappedData);

        // Remove the temporary Excel file (if needed)
        fs.unlinkSync(filePath);

        return result;
    } catch (error) {
        throw error;
    }
}


// Example usage:
// Assuming you have an array of leads called 'allLeads'
// const allLeads = await readAllLeads();
// const splitLeads = splitListIntoChunks(allLeads, 2);

// Export the functions for use in other files
