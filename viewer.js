const express = require('express')
const path = require('path');
const fs = require('fs');
const app = express()
const port = 3000


const logsDirectory = path.join(__dirname, 'logs');

app.get('/', (req, res) => {
  res.send('Hello World! This is my Node! David ist süß.')
})

app.use('/viewer', express.static(path.join(__dirname, 'viewer')));

app.get('/logs/:index', (req, res) => {
    const index = parseInt(req.params.index)-1;
    if (isNaN(index) || index < 0) {
        return res.status(400).send('Invalid index');
    }

    fs.readdir(logsDirectory, (err, files) => {
        if (err) {
            return res.status(500).send('Error reading directory');
        }

        // Filter out only files that are images
        const imageFiles = files.filter(file => {
            return /\.(png|jpg|jpeg|gif)$/i.test(file);
        });

        if (index >= 0 && index < imageFiles.length) {
            const imagePath = path.join(logsDirectory, imageFiles[index]);
            res.sendFile(imagePath);
        } else {
            res.status(404).send('Image not found');
        }
    });
});

app.get('/logs/text/:index', (req, res) => {
    const index = parseInt(req.params.index)-1;
    if (isNaN(index) || index < 0) {
        return res.status(400).send('Invalid index');
    }

    fs.readdir(logsDirectory, (err, files) => {
        if (err) {
            return res.status(500).send('Error reading directory');
        }

        // Filter out only files that are text files
        const textFiles = files.filter(file => {
            return /\.txt$/i.test(file);
        });

        if (index >= 0 && index < textFiles.length) {
            const textFilePath = path.join(logsDirectory, textFiles[index]);
            fs.readFile(textFilePath, 'utf8', (err, data) => {
                if (err) {
                    return res.status(500).send('Error reading file');
                }
                res.send(data);
            });
        } else {
            res.status(404).send('Text file not found');
        }
    });
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
