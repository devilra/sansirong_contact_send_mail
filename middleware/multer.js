import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("application/pdf") ||
    file.mimetype.startsWith("image/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF or Image resumes allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });
export default upload;
