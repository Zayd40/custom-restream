const NodeMediaServer = require('node-media-server');
const express = require('express');

const config = {
  logType: 3,
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60,
  },
  http: {
    port: 8000,
    allow_origin: '*',
  },
  // Relay incoming RTMP from /live/* to YouTube, TikTok, and Instagram
  relay: {
    ffmpeg: '/usr/bin/ffmpeg',
    tasks: [
      // YouTube Live
      {
        app: 'live',
        mode: 'push',
        edge: `rtmp://a.rtmp.youtube.com/live2${process.env.YT_KEY}`,
        name: 'youtube',
        appendName: false,
      },
      // TikTok Live (fill in TIKTOK_KEY from your TikTok Live Studio / stream settings)
      {
        app: 'live',
        mode: 'push',
        edge: `rtmp://live.tiktok.com/live/${process.env.TIKTOK_KEY}`,
        name: 'tiktok',
        appendName: false,
      },
      // Instagram Live Producer (you get a key from Instagram when you start a live)
      {
        app: 'live',
        mode: 'push',
        edge: `rtmps://edgetee-upload-lhr8-1.xx.fbcdn.net:443/rtmp/${process.env.INSTAGRAM_KEY}`,
        name: 'instagram',
        appendName: false,
      },
    ],
  },
};

const nms = new NodeMediaServer(config);
nms.run();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (_req, res) => {
  res.send('OK – Restream server is running (YouTube + TikTok + Instagram)');
});

app.listen(PORT, () => {
  console.log(`Healthcheck HTTP server listening on ${PORT}`);
});
