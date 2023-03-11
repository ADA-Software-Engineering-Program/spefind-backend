const multer = require('multer');
const path = require('path');
// Multer config
module.exports = multer({
  storage: multer.diskStorage({
    // destination: (request, file, cb) => {
    //   cb(null, './uploads');
    // },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}__${file.originalname}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      cb(new Error('Unsupported file type!'), false);
      return;
    }
    cb(null, true);
  },
});
