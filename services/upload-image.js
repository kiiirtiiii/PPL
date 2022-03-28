const multer = require("multer");

const multerConfig = {
  storage: multer.diskStorage({
    destination: (req, file, next) => {
      next(null, "./images");
    },
    filename: (req, file, next) => {
      const ext = file.mimetype.split("/")[1];
      next(null, file.fieldname + "-" + Date.now() + "-" + ext);
    },
  }),
};

module.exports = { multerConfig };
