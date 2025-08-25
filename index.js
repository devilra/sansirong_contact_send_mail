import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import resumeRouter from "./routes/applicationRoutes.js";

const app = express();

const allowedOrigins = ["https://sansirong.com", "https://sansirong.in"];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin:function(origin, callback){
    if(!origin || allowedOrigins.includes(origin)){
      callback(null, true)
    }else{
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods:['GET', 'POST', 'PUT', 'DELETE'],
  credentials:true
}));
const PORT = process.env.PORT;

// app.get("/", () => {
//   console.log("Api is running");
// });



app.use("/api", resumeRouter);

app.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let mailOptions = {
      from: `"${name}" <${email}>`,
      to: [process.env.EMAIL_USER],
      subject: "New Contact Form Submission",
      html: `
           <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
      <div style="text-align: center;">
        <img src="https://sansirong.in/logo.png" alt="Sansirong Logo" style="width: 120px; margin-bottom: 10px;" />
        <h2 style="color: #4CAF50; margin: 0;">Sansirong</h2>
        <p style="font-size: 14px; color: #777;">We value your message!</p>
        <hr style="margin: 20px 0;" />
      </div>

      <div>
        <h3 style="color: #333;">New Message from Website Contact Form</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p style="background: #f9f9f9; padding: 10px; border-radius: 4px; border: 1px solid #eee;">
          ${message}
        </p>
      </div>

      <hr style="margin: 20px 0;" />
      <footer style="text-align: center; font-size: 12px; color: #999;">
        &copy; ${new Date().getFullYear()} Sansirong. All rights reserved.
      </footer>
    </div>
          `,
      replyTo: email,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({
      success: "Email sent successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Email sending failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server Connected ${PORT}`);
});
