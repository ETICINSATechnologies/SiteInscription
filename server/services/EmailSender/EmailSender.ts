const nodemailer = require('nodemailer');
import { Attachment } from 'nodemailer/lib/mailer';

interface Auth {
  user: string,
  pass: string,
}

interface MailOptions {
  from: string,
  to: string,
  subject: string,
  text?: string,
  html?: string,
  attachments?: Attachment[]
}

export class EmailSender {

  service: string;
  auth: Auth;

  constructor(service: string, auth: Auth) {
    this.service = service;
    this.auth = auth;
  }

  protected createTransporter(service: string, auth: Auth) {

    const transporter = nodemailer.createTransport({
      service,
      auth
    });

    return transporter;
  }

  public sendEmail(mailOptions: MailOptions) {

    console.log('Preparing to send new email');

    console.log('Creating transporter');

    let transporter: any | undefined = undefined;

    try {
      transporter = this.createTransporter(this.service, this.auth);
    } catch (e) {
      console.log('Error creating transporter');
    }

    if (transporter) {

      console.log('Transporter created, sending email');
      transporter.sendMail(mailOptions, (error: any, info: any) => {

        if (error) {
          console.log('Error occurred while sending email');
          console.log(error.message);

        } else {

          console.log('Email sent successfully : ' + info.response);
        }



        if (transporter) transporter.close();

      });

    }

  }
}
