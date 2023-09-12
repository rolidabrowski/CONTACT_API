import multer from "multer";
import path from "path";

const tempDir = path.join(process.cwd(), "temp");

const diskStorage = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 1048576,
  },
});

const upload = multer({ storage: diskStorage });

export const uploadUserAvatar = upload.single("avatar");
