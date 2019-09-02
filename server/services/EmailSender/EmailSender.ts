const nodemailer = require('nodemailer');
//import { Attachment } from 'nodemailer/lib/mailer';

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

interface Attachment {
  content: Buffer,
  filename: string,
  filesize: number
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

  protected splitAttachments(mailOptions: MailOptions): MailOptions[] {
    let retMailOptions: MailOptions[] = [];
    let currentIndex = 0;
    let singleEmailLimit = 20 * 1024 * 1024;
    let currentLimit = singleEmailLimit;
    retMailOptions[currentIndex] = mailOptions;

    if (mailOptions.attachments && mailOptions.attachments !== []) {
      const originalAttachments = [...mailOptions.attachments];
      retMailOptions[currentIndex].attachments = [];

      let currentSize = 0;

      originalAttachments.forEach(attachment => {

        currentSize += attachment.filesize;

        if (currentSize >= currentLimit) {
          console.log('Attachments too large, making new email');
          currentSize = currentLimit + attachment.filesize;
          ++currentIndex;
          currentLimit += singleEmailLimit;

          retMailOptions[currentIndex] = {
            ...mailOptions,
            html: undefined,
            text: 'Suite au dernier mail - Les fichiers étaient tros gros pour un seul mail',
          }

          retMailOptions[currentIndex].attachments = [];
        }

        (retMailOptions[currentIndex].attachments as any).push(attachment)
      });
    }
    return retMailOptions;
  }

  public async sendEmail(mailOptions: MailOptions) {
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

      const mailOptionArray = this.splitAttachments(mailOptions)

      for (const mailOptions of mailOptionArray) {
        try {
          let info = await transporter.sendMail(mailOptions);
          console.log('Email sent successfully ', info.response);
        } catch (e) {
          console.log('Error occurred while sending email ', e.message);
        }
      }

      if (transporter) transporter.close();
    }
  }
}
