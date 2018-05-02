// require the Twilio module and RequestClient
const twilio = require('twilio');
const MyRequestClient = require('./MyRequestClient');

// Load environment variables
require('dotenv').config()

// Twilio Credentials
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;

const client = twilio(accountSid, authToken, {
    // Custom HTTP Client
    httpClient: new MyRequestClient(process.env.PROXY)
});

client.messages
    .create({
        to: '+15558675310',
        from: '+15017122661 ',
        body: 'Hey there!',
    })
    .then(message => console.log(`Message SID ${message.sid}`));
