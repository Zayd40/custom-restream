# My Restream Server (YouTube + TikTok + Instagram)

Simple Node.js + Node Media Server RTMP relay that takes one RTMP input and restreams it to:
- YouTube Live
- TikTok Live
- Instagram Live (Producer)

Designed to be easily deployable on Railway.

## Environment variables

Set these in Railway (or in a local `.env` if you prefer):

- `YT_KEY` – Your **YouTube Live stream key** (from YouTube Studio).
- `TIKTOK_KEY` – Your **TikTok stream key**.
  - TikTok usually provides **Server URL** and **Stream Key**.  
    This config assumes the server URL is `rtmp://live.tiktok.com/live` and the key is `TIKTOK_KEY`.
    If TikTok gives you a different server URL, edit `index.js` and update the `edge` value for TikTok.
- `INSTAGRAM_KEY` – Your **Instagram Live Producer stream key**.
  - Instagram Live Producer typically uses `rtmps://live-upload.instagram.com:443/rtmp/` as the URL,
    with the key appended at the end, which is what `index.js` is doing.

## How it works

- You send RTMP to: `rtmp://<host>:1935/live/<any-key>`
- Node Media Server receives it and relays the same stream via FFmpeg to:
  - YouTube: `rtmp://a.rtmp.youtube.com/live2/YT_KEY`
  - TikTok: `rtmp://live.tiktok.com/live/TIKTOK_KEY`
  - Instagram: `rtmps://live-upload.instagram.com:443/rtmp/INSTAGRAM_KEY`

## Local usage

```bash
npm install
npm start
```

Then in OBS (or another encoder):

- Server: `rtmp://localhost:1935/live`
- Stream key: anything (for example `teststream`)

The app will:
- Listen for RTMP on port **1935**
- Provide a simple HTTP healthcheck on port **8000** and on `PORT` (for Railway)

## Deploying to Railway

1. Push this folder to a new GitHub repo.
2. On Railway, create a new project from that GitHub repo.
3. In the Railway service settings, add environment variables:
   - `YT_KEY`
   - `TIKTOK_KEY`
   - `INSTAGRAM_KEY`
4. Under **Public Networking**, create a **TCP Proxy**:
   - Internal port: `1935`
5. Railway will give you a host and port, for example:
   - Host: `your-service.up.railway.app`
   - Port: `12345`

## Using it with OBS after deploying

In OBS:

- Server: `rtmp://your-service.up.railway.app:12345/live`
- Stream key: any key (e.g. `restream1`)

When you go live:
- The stream from OBS hits your Railway RTMP server.
- The Node Media Server relay sends that stream to YouTube, TikTok, and Instagram simultaneously,
  using the keys you configured in the environment variables.
