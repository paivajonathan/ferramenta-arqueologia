const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const { spawn } = require("child_process");

const app = express();

const utils = require("./utils");

app.set("view engine", "ejs");

app.use("/", express.static("./public"));
app.use("/raw", express.static("./database/images/raw-images"));
app.use("/contrasted", express.static("./database/images/contrasted-images"));
app.use("/highlighted", express.static("./database/images/highlighted-images"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const rawImagesStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./database/images/raw-images");
    },
    filename: (req, file, cb) => {
        cb(null, `image-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const rawImageUpload = multer({ storage: rawImagesStorage });

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/save-raw-image", rawImageUpload.single("rawImage"), (req, res) => {
    res.redirect(`/contrast-image/${req.file.filename}`);
});

app.get("/contrast-image/:rawImageName", (req, res) => {
    const rawImageName = req.params.rawImageName;

    res.render("contrast-image", {
        rawImageName: rawImageName
    });
});

app.post("/add-contrast-to-image", (req, res) => {
    const rawImageName = req.body.rawImageName;
    const contrastValue = req.body.contrastValue;

    const pythonProcess = spawn("python", ["./contraster.py", rawImageName, contrastValue]);

    let headersSent = false;

    pythonProcess.stdout.on("data", (data) => {
        if (!headersSent) {
            const contentType = utils.getContentType(rawImageName);
            if (contentType) {
                res.setHeader("Content-Type", contentType);
            }
            res.setHeader("Content-Encoding", "binary");
            headersSent = true;
        }

        res.write(data);
    });

    pythonProcess.stderr.on("data", (data) => {
        console.error("Erro: " + data);
    });

    pythonProcess.on("close", () => {
        res.end();
    });
});

app.get("/download-contrasted-image/:contrastedImageName", (req, res) => {
    const contrastedImageName = req.params.contrastedImageName;
    const contrastedImageExtension = path.extname(contrastedImageName);

    const downloadPath = `./database/images/contrasted-images/${contrastedImageName}`;

    res.download(downloadPath, `ContrastedImage${Date.now()}${contrastedImageExtension}`);
});

app.get("/highlight-image/:contrastedImageName", (req, res) => {
    const contrastedImageName = req.params.contrastedImageName;

    res.render("highlight-image", {
        contrastedImageName: contrastedImageName
    });
});

app.post("/add-mask-to-image", (req, res) => {
    const contrastedImageName = req.body.contrastedImageName;
    const color = req.body.color;

    const pythonProcess = spawn("python", ["./highlighter.py", contrastedImageName, color]);

    let headersSent = false;

    pythonProcess.stdout.on("data", (data) => {
        if (!headersSent) {
            const contentType = utils.getContentType(contrastedImageName);
            if (contentType) {
                res.setHeader("Content-Type", contentType);
            }
            res.setHeader("Content-Encoding", "binary");
            headersSent = true;
        }

        res.write(data);
    });

    pythonProcess.stderr.on("data", (data) => {
        console.log("Erro: " + data);
    });

    pythonProcess.on("close", () => {
        res.end();
    });
});

app.get("/download-highlighted-image/:highlightedImageName", (req, res) => {
    const highlightedImageName = req.params.highlightedImageName;
    const highlightedImageExtension = path.extname(highlightedImageName);

    const downloadPath = `./database/images/highlighted-images/${highlightedImageName}`;

    res.download(downloadPath, `HighlightedImage${Date.now()}${highlightedImageExtension}`);
});

app.get("/vectorize-image/:highlightedImageName", (req, res) => {
    const highlightedImageName = req.params.highlightedImageName;

    res.render("vectorize-image", {
        highlightedImageName: highlightedImageName
    });
});

app.post("/turn-image-into-vector", (req, res) => {
    const highlightedImageName = req.body.highlightedImageName;

    const pythonProcess = spawn("python", ["./vectorizer.py", highlightedImageName]);

    let headersSent = false;

    pythonProcess.stdout.on("data", (data) => {
        if (!headersSent) {
            const contentType = utils.getContentType(highlightedImageName);
            if (contentType) {
                res.setHeader("Content-Type", contentType);
            }
            res.setHeader("Content-Encoding", "binary");
            headersSent = true;
        }

        res.write(data);
    });

    pythonProcess.stderr.on("data", (data) => {
        console.log("Erro: " + data);
    });
    
    pythonProcess.on("close", () => {
        res.end();
    });
});

app.get("/download-vectorized-image/:vectorizedImageName", (req, res) => {
    const vectorizedImageName = req.params.vectorizedImageName;
    const vectorizedImageExtension = path.extname(vectorizedImageName);

    const downloadPath = `./database/images/vectorized-images/${vectorizedImageName}`;

    res.download(downloadPath, `VectorizedImage${Date.now()}${vectorizedImageExtension}`);
});

app.listen(3000, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("The server has initialized successfully!");
    }
});