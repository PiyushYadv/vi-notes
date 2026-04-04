import path from "path";
import { IUser } from "../models/userModel";

function loadEmailDependency<T>(moduleName: string): T {
  try {
    return require(moduleName);
  } catch {
    throw new Error(
      `Missing optional email dependency: ${moduleName}. Install email packages or disable email flows.`,
    );
  }
}

class Email {
  to: string;
  firstName: string;
  url: string;
  from: string;

  constructor(user: IUser, url: string) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = process.env.EMAIL_FROM || process.env.EMAIL_USERNAME || "";
  }

  newTransport() {
    const nodemailer = loadEmailDependency<any>("nodemailer");
    const emailPort = Number(process.env.EMAIL_PORT || 587);

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: emailPort,
      secure: emailPort === 465,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  getTemplatePath(template: string) {
    return path.resolve(process.cwd(), "views", "email", `${template}.pug`);
  }

  async send(
    template: string,
    subject: string,
    intro: string,
    buttonLabel: string,
  ) {
    const pug = loadEmailDependency<any>("pug");
    const htmlToText = loadEmailDependency<any>("html-to-text");
    const templatePath = this.getTemplatePath(template);
    const html = pug.renderFile(templatePath, {
      firstName: this.firstName,
      url: this.url,
      subject,
      intro,
      buttonLabel,
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html, {
        wordwrap: 120,
      }),
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send(
      "welcome",
      "Welcome to Vi-Notes",
      "Your account is ready. You can now sign in and start managing your notes.",
      "Open Vi-Notes",
    );
  }

  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Reset your Vi-Notes password",
      "We received a request to reset your password. This link will expire in 10 minutes. If you did not request this, you can safely ignore this email.",
      "Reset password",
    );
  }
}

export default Email;

/* const sendMail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // Activate in gmail "less secure app" option
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'Piyush Yadav <iampiyushyadv@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendMail; */
