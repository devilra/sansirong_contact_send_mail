import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
  degree: String,
  year: Date,
  institute: String,
});

const workSchema = new mongoose.Schema({
  company: String,
  role: String,
  experience: String,
  responsibilities: String,
});

const applicationSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: {
    type: String,
    required: true,
  },
  address: {
    street: String,
    apartment: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },
  education: [educationSchema],
  workExperience: [workSchema],
  resume: String,
  confirm: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Application", applicationSchema);
