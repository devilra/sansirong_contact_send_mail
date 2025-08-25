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

    let educationArr = [];
    let workArr = [];

    try {
      if (education) educationArr = JSON.parse(education);
      if (workExperience) workArr = JSON.parse(workExperience);
    } catch (error) {
      console.log("JSON parse error:", error.message);
    }

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
      //to: process.env.EMAIL_USER,
      to:'rockerraja906@gmail.com',
      subject: "New Job Application - " + name,
      html: `
        <h2>New Job Application</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Address:</b> ${street}, ${apartment}, ${city}, ${state}, ${zip}, ${country}</p>
        <h3>Education:</h3>
        <ul>
  ${educationArr
    .map((e) => {
      return `<li>
        ${e.degree || "N/A"} 
        ${e.year ? " - " + e.year : ""} 
        ${e.institute ? " - " + e.institute : ""}
      </li>`;
    })
    .join("")}
</ul>
        <h3>Work Experience:</h3>
        <ul>
        ${workArr
          .map(
            (w) =>
              `<li>${w.company} - ${w.role} - ${w.responsibilities} (${w.experience})</li>`
          )
          .join("")}
        </ul>

        <p><b>Confirm:</b> ${confirm ? "Yes" : "No"}</p>
        <p>Resume:</b>${attachment.length > 0 ? "Attached" : "Not Attached"}</p>
      `,
      attachments: attachment,
      replyTo: email,
    });
    res.status(200).json({
      success: true,
      message: "Application sent to HR email successfully!",
    });
  } catch (error) {
    res.json({ error: error.message });
  }
};
