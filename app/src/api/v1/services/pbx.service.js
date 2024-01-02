const axios = require('axios');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const { formatUser } = require('../helpers/format.helper');

const baseUrl = ""

const admin = process.env.PBXUSER
const password = process.env.PBXPASS

async function authenticateUser() {

    const apiUrl = `${baseUrl}/admin-cabinet/session/start`;
    const formData = new URLSearchParams();
    formData.append('login', admin);
    formData.append('password', password);

    // Create an axios instance and configure it with the necessary options
    const instance = axios.create({
        baseURL: apiUrl,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest',
        },
    });

    try {
        // Perform the POST request with form data and store cookies
        const response = await instance.post(apiUrl, formData, {
            withCredentials: true,  // Enable cookie handling
        });
        const cookie = response.headers['set-cookie'][0]
        if (cookie) {
            fs.writeFileSync('cookies/cookies.txt', cookie.split(";")[0]);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}



async function getPeersStatuses() {
    const apiUrl = `${baseUrl}/pbxcore/api/sip/getPeersStatuses`;

    // Load cookies from the 'cookies.txt' file
    const cookiesFilePath = path.join('cookies', 'cookies.txt');
    const cookies = fs.readFileSync(cookiesFilePath, 'utf8').trim();

    // Create an axios instance and configure it with the necessary options
    const instance = axios.create({
        baseURL: apiUrl,
        headers: {
            'Cookie': cookies,
        },
    });

    try {
        // Perform the GET request with the cookies loaded from the file
        const response = await instance.get(apiUrl);
        console.log(response.status);

        return response
        // console.log('Response data:', response.data);
    } catch (error) {
        console.log(error);

        if (error.response.status == 401) {
            authenticateUser().then(() => { error.response = getPeersStatuses() })
            return error.response
        }
        console.error('Error:', error.response.status);
    }
}


async function getPeerDetails(username) {
    const apiUrl = `${baseUrl}/pbxcore/api/sip/getSipPeer`;

    // Load cookies from the 'cookies.txt' file
    const cookiesFilePath = path.join('cookies', 'cookies.txt');
    const cookies = fs.readFileSync(cookiesFilePath, 'utf8').trim();

    // Create an axios instance and configure it with the necessary options
    const instance = axios.create({
        baseURL: apiUrl,
        headers: {
            'Cookie': cookies,
        },
    });

    try {
        // Perform the GET request with the cookies loaded from the file
        const response = await instance.post(apiUrl, { peer: username });
        return response.status == 200 && response.data.data.state === "OK" ? { status: true, data: response.data.data } : { status: false, data: {} }
        // console.log('Response data:', response.data);
    } catch (error) {
        console.log(error.response.status);

        if (error.response.status == 401) {
            authenticateUser().then(() => { error.response = getPeerDetails(username) })
            return error.response
        }
        console.error('Error:', error.response.status);
    }
}

async function saveRecord(userData) {
    const apiUrl = 'http://10.2.0.90/pbxcore/api/extensions/saveRecord';
    const cookiesFilePath = path.join('cookies', 'cookies.txt');
    const cookies = fs.readFileSync(cookiesFilePath, 'utf8').trim();

    const formData = formatUser(userData);

    const formDataString = qs.stringify(formData);


    const instance = axios.create({
        baseURL: apiUrl,
        headers: {
            'Cookie': cookies,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    try {
        const response = await instance.post(apiUrl, formDataString);

        console.log('Response data:', response.data);
    } catch (error) {
        if (error.response.status == 401) {
            authenticateUser().then(() => { error.response = saveRecord(userData) })
            return error.response
        }
        console.error('Error:', error.response);
    }
}

module.exports = {
    authenticateUser,
    getPeersStatuses,
    saveRecord,
    getPeerDetails
}





