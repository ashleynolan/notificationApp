const request = require('request');
const cheerio = require('cheerio');
const cron = require('node-cron');
const dayjs = require('dayjs');
const mailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

const scrapeUrl = 'https://www.jtxfitness.com/used-rowing-machine';

cron.schedule('*/5 * * * *', () => {
    request(scrapeUrl, (error, response, body) => {
        if (!error) {
            const $ = cheerio.load(body);
            const stockStatus = $('.buy-button button').html();
            const time = dayjs().format('HH:mm:ss DD-MM-YYYY ');

            if (stockStatus !== 'Out of Stock') {
                sendNotifcation(`Current stock status is ${stockStatus} : ${time}`)
            } else {
                sendNotifcation(`Stock checked – Currently ${stockStatus} : ${time}`)
                console.log(`Stock checked – Currently ${stockStatus} : ${time}`);
            }

        } else {
            console.log(`We’ve encountered an error: ${error}`);
        }
    });
});

function sendNotifcation(stockMsg) {
    console.log(stockMsg);
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    sgMail.setApiKey(envKey);
    const msg = {
        to: 'nolly00@gmail.com',
        from: {
            email: 'awatsonnolan@gmail.com',
            name: 'Stock Notifier'
        },
        subject: 'Stock Notification – JTX Rower',
        html: `<p>${stockMsg}</p>

<p>${scrapeUrl}</p>
        `,
    };
    sgMail.send(msg);
}