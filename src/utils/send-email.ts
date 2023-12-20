import nodemailer from "nodemailer";
import { template } from "./email-templates/main";

// Define a type for the credentials
type CompanyCredentials = {
  [key: string]: string;
};

// Companies credentials key
const credentials: CompanyCredentials = {
  "1": "BRANDS_PARLOUR",
  "2": "JUST_BEST",
  "3": "SOCIO_SAINTS",
  "4": "GRAND_FLUENCE",
};

//generate date
const generateDate = () => {
  const currentDate: Date = new Date();

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const dateFormatter: Intl.DateTimeFormat = new Intl.DateTimeFormat("en-US", options);
  const formattedDate: string = dateFormatter.format(currentDate);

  const ordinalSuffix = (day: number): string => {
    if (day >= 11 && day <= 13) {
      return `${day}th`;
    }
    switch (day % 10) {
      case 1:
        return `${day}st`;
      case 2:
        return `${day}nd`;
      case 3:
        return `${day}rd`;
      default:
        return `${day}th`;
    }
  };

  const day: string = ordinalSuffix(currentDate.getDate());

  const splitDate = formattedDate.replace(",", "").split(" ");

  const finalFormattedDate: string = `${day} ${splitDate[0]}, ${splitDate[2]}`;

  return finalFormattedDate;
};

//company template data
const templateData = {
  BRANDS_PARLOUR: {
    companyName: "Brand Parlour",
  },
  JUST_BEST: {
    companyName: "Just Best",
  },
  SOCIO_SAINTS: {
    companyName: "Socio Saints",
  },
  GRAND_FLUENCE: {
    companyName: "Grand Fluence",
  },
};

// Send the email
export const sendEmail = async ({ sendTo, companyId, name }: { sendTo: string; companyId: string; name: string }) => {
  // Validate companyId against known keys
  if (!(companyId in credentials)) {
    throw new Error("Invalid companyId");
  }

  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: "mail.server.bluemoonserver.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env[`${credentials[companyId]}_EMAIL`],
      pass: process.env[`${credentials[companyId]}_PASSWORD`],
    },
    connectionTimeout: 100000,
    socketTimeout: 200000,
  });

  // Email options
  const mailOptions: nodemailer.SendMailOptions = {
    from: process.env[`${credentials[companyId]}_EMAIL`],
    to: sendTo,
    subject: `Internship acceptance letter from  ${(templateData as any)[credentials[companyId]]} `,
    html: template({ ...(templateData as any)[credentials[companyId]], date: generateDate(), name: name }),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
