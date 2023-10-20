const { randomBytes } = require('node:crypto')


exports.formatLead = (leadData) => {
    const { serial, name, contact, zone } = leadData
    console.log(serial, name, contact, zone);
    const leadId = randomBytes(6).toString('hex')
    return { leadId, serial, name, contact, zone }
}

exports.formatUser = (userData) => {
    const { userName, number, password } = userData
    return {
        id: '',
        type: 'SIP',
        is_general_user_number: '1',
        sip_type: 'peer',
        sip_uniqid: '',
        mobile_uniqid: '',
        user_avatar: '',
        user_id: '',
        file_select: '',
        user_username: `${userName}`,
        number: `${number}`,
        mobile_number: '',
        user_email: '',
        sip_secret: `bpo${number}`,
        mobile_dialstring: '',
        sip_enableRecording: '1',
        sip_dtmfmode: 'auto',
        sip_transport: '',
        sip_networkfilterid: 'none',
        sip_manualattributes: '',
        fwd_ringlength: '45',
        fwd_forwarding: '',
        fwd_forwardingonbusy: '',
        fwd_forwardingonunavailable: '',
        dirrty: '',
        submitMode: 'SaveSettings',
    }
}