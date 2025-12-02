const NodeMediaServer = require('node-media-server');
const express = require('express');

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    allow_origin: '*'
  },
  relay: {
    ffmpeg: '/usr/bin/ffmpeg',
    tasks: [
      {
        app: 'live',
        mode: 'push',
        edge: `rtmp://a.rtmp.youtube.com/live2/${process.env.YT_KEY}`,
        name: 'youtube'
      },
      {
        app: 'live',
        mode: 'push',
        edge: `rtmp://live.tiktok.com/live/${process.env.TIKTOK_KEY}`,
        name: 'tiktok'
      },
      {
        app: 'live',
        mode: 'push',
        edge: `rtmps://live-upload.instagram.com:443/rtmp/${process.env.INSTAGRAM_KEY}`,
        name: 'instagram'
      }
    ]
  }
};

const nms = new NodeMediaServer(config);
nms.run();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req,res)=>res.send("Restream server running"));
app.listen(PORT, ()=>console.log("Healthcheck on", PORT));
