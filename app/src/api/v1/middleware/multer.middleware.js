const multer = require("multer");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './excel/');
    },
    filename: function(req, file, cb) {
        cb(null, `${new Date().toDateString().replaceAll(" ","-")}_${new Date().getTime()}_${(file.originalname).replaceAll(" ","-")}`);
    },
});

const uploads = multer({
    storage: storage
});

module.exports = uploads;