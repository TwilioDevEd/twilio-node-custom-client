// require the Twilio module and RequestClient
const twilio = require('twilio');
const RequestClient = require('twilio/lib/base/RequestClient');

// Load environment variables
require('dotenv').config()

// Twilio Credentials
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;

// Custom HTTP Client
class MyRequestClient {
    constructor() {
        this.http = new RequestClient();
    }

    request(opts) {
        // Here you can change the URL, headers and other request parameters
        // In this case, the request reads env variables HTTP_PROXY
        // and HTTPS_PROXY to use a corporate proxy
        return this.http.request(opts);
    }
}

const client = twilio(accountSid, authToken, {
    httpClient: new MyRequestClient()
});

client.messages
    .create({
        to: '+15558675310',
        from: '+15017122661 ',
        body: 'Hey there!',
    })
    .then(message => console.log(`Message SID ${message.sid}`));
