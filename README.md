# WS Pastebin — Electron client

Desktop client for a small authenticated Socket.IO text-sharing demo. Uses the [VirtualBoard Auth API](https://github.com/william-skogberg/VirtualBoard) and [WebSocket server](https://github.com/william-skogberg/Websocket).

## Run

1. Install Node.js and run `npm install`.
2. Update the demo server URLs at the top of `src/app.js` if your backends have different addresses.
3. Run `npm start` (or `npm run dev`). The application loads `src/index.html` directly; no frontend build step is required.
4. Optional: `npm run build` packages the app with electron-builder.

Session tokens are stored by Electron's main process using the OS encryption backend when one is available. On systems without a suitable encryption backend, tokens are **kept only in memory** and login will be needed after restart. The renderer communicates through a narrow preload bridge. Never commit real credentials.

**Scope:** prototype/student project, not a production-ready secure messenger. It currently loads the Socket.IO browser client from a CDN and uses demo backend URLs, so network access is required.
