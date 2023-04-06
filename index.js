const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const { spawn } = require("child_process");

const app = express();

app.set("view engine", "ejs");

app.use("/", express.static("./public"));
app.use("/raw", express.static("./database/images/raw-images"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const rawImagesStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "database/images/raw-images");
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const rawImageUpload = multer({ storage: rawImagesStorage });

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/save-raw-image", rawImageUpload.single("rawImage"), (req, res) => {
    res.redirect(`/highlight-image?image=${JSON.stringify(req.file.filename)}`);
});

app.get("/highlight-image", (req, res) => {
    const imageName = JSON.parse(req.query.image);

    res.render("highlight-image", {
        imageName: imageName
    });
});

function getContentType(imageName) {
    const fileExtension = imageName.split('.').pop().toLowerCase();
    switch (fileExtension) {
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'png':
            return 'image/png';
        // Add more cases for other image types as needed
        default:
            return null; // Return null for unsupported image types
    }
}

app.post('/process-image', (req, res) => {
    // console.log(req.body.imageName)

    // Get the path of the image file from the request body
    const imageName = req.body.imageName;
    const color = req.body.color;

    // Spawn a new Python process and execute your script
    const pythonProcess = spawn('python', ['./highlighter.py', imageName, color]);

    let headersSent = false; // Flag to track if headers are already sent

    // Listen for data events from the Python process
    pythonProcess.stdout.on('data', (data) => {
        if (!headersSent) {
            // Set the response headers only if they are not already sent
            // Dynamically determine the Content-Type based on the image type
            const contentType = getContentType(imageName);
            if (contentType) {
                res.setHeader('Content-Type', contentType);
            }
            res.setHeader('Content-Encoding', 'binary');
            headersSent = true; // Set the flag to true after setting headers
        }

        // Send the binary data as the response body
        res.write(data);
    });

    pythonProcess.on('close', (code) => {
        // End the response when the Python process is closed
        res.end();
    });
    // // Listen for errors from the Python process (if needed)
    // pythonProcess.stderr.on('data', (data) => {
    //     // Handle errors from the Python process
    // });

    // // Listen for the close event from the Python process
    // pythonProcess.on('close', (code) => {
    //     // Handle close event from the Python process
    //     // You can send the result back to the front-end here
    //     res.send({ result: 'Image processed successfully' });
    // });
});

app.listen(3000, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("The server has initialized successfully!");
    }
});