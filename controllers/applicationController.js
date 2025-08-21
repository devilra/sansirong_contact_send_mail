import nodemailer from "nodemailer";
// cloudinary based pdfStored

// const uploadBuffer = (fileBuffer) =>
//   new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       { resource_type: "raw", folder: "resumes" },
//       (error, result) => {
//         if (error) reject(error);
//         else resolve(result);
//       }
//     );

//     // End the stream with buffer
//     stream.end(fileBuffer);
//   });

export const submitApplication = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      street,
      apartment,
      city,
      state,
      zip,
      country,
      education,
      workExperience,
      confirm,
    } = req.body;

    //cloudinary based

    // let resumeUrl = "";
    // if (req.file) {
    //   const uploadRes = await uploadBuffer(req.file.buffer);
    //   resumeUrl = uploadRes.secure_url;
    // }

    let attachment = [];

    if (req.file) {
      attachment.push({
        filename: req.file.originalname,
        content: req.file.buffer,
        contentType: req.file.mimetype,
      });
    }

    // console.log(attachment);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    //send mail

    await transporter.sendMail({
      from: `${name} <${email}>`,
      to: process.env.EMAIL_USER,
      subject: "New Job Application - " + name,
      html: `
        <h2>New Job Application</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Address:</b> ${street}, ${apartment}, ${city}, ${state}, ${zip}, ${country}</p>
        <p><b>Education:</b> ${education}</p>
        <p><b>Work Experience:</b> ${workExperience}</p>
        <p><b>Confirm:</b> ${confirm ? "Yes" : "No"}</p>
        ${
          resumeUrl
            ? `<p><b>Resume:</b> <a href="${resumeUrl}" target="_blank">Download</a></p>`
            : "<p><b>Resume:</b> Not attached</p>"
        }
      `,
    });
    res.status(200).json({
      success: true,
      message: "Application sent to HR email successfully!",
    });
  } catch (error) {
    res.json({ error: error.message });
  }
};
