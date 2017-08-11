import * as nodemailer from 'nodemailer';
import {mailerConfig} from '../config'

class MailerService {
  constructor() {
        // Setup mailer
    this.transporter = nodemailer.createTransport(mailerConfig);
  }

  sendMail(from, subject, body, recipients) {
    const mailOptions = {
      from: from, // sender address
      to: recipients, // list of receivers
      subject: subject, // Subject line
      html: body // html body
    };

        // send mail with defined transport object
    return this.transporter.sendMail(mailOptions).then(info => {
      console.log('Message sent: ' + info.response);
    }).catch(err => {
      console.log(err);
    });
  }
}

export default new MailerService();
