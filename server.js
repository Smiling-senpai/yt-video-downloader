const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const ytdl = require('ytdl-core');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Endpoint to handle video download
app.post('/download', async (req, res) => {
    const videoUrl = req.body.url;

    if (!videoUrl || !ytdl.validateURL(videoUrl)) {
        return res.status(400).send({ error: 'Invalid YouTube URL' });
    }

    try {
        const videoInfo = await ytdl.getInfo(videoUrl);
        const videoTitle = videoInfo.videoDetails.title.replace(/[^a-zA-Z0-9]/g, '_');
        const filePath = `${videoTitle}.mp4`;

        // Stream the video to the client
        res.header('Content-Disposition', `attachment; filename="${filePath}"`);
        ytdl(videoUrl, { quality: 'highest' }).pipe(res);
    } catch (error) {
        console.error('Error downloading video:', error);
        res.status(500).send({ error: 'Failed to process the request' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
