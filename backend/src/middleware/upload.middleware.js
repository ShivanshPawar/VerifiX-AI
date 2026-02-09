const multer = require("multer");

const storage = multer.memoryStorage();

module.exports = multer({

    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    

    fileFilter: (_, file, cb) => {

        // Defines allowed MIME types
        const allowed = ["image/jpg", "image/jpeg", "image/png", "image/gif", "image/webp"];

        // Checks the image belongs to the allowed MIME type
        if (!allowed.includes(file.mimetype)) {
            return cb(new Error("Invalid file type"), false);
        }

        // Calls the callback to confirm file validation passed (null for no error , true for allowed)
        cb(null, true)
    }

})