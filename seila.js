const express = require('express');
const jsQR = require("jsqr");
const { createCanvas, loadImage } = require('canvas');
const multer  = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
const upload = multer({ storage: storage });

const app = express();

app.post('/decode', upload.single('image'), async (req, res) => {
    const image = await loadImage(req.file.path);
    const canvas = createCanvas(image.width, image.height);
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, image.width, image.height);
    const imageData = context.getImageData(0, 0, image.width, image.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    res.json({ data: code ? code.data : null });
});
app.use(express.static('public'));

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
