# timed.cc

This is the frontend for [timed.cc](https://timed.cc) — a quick cross-device link sharing service that uses short codes and encryption.

The app is built with:

- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Naive UI](https://www.naiveui.com/)
- [CryptoJS](https://www.npmjs.com/package/crypto-js) for AES encryption
- [qrcode-vue3](https://github.com/scopewu/qrcode-vue3) for QR rendering
- [Cloudflare Workers](https://developers.cloudflare.com/workers/) backend

## 🚀 Usage

```bash
bun i
bun run dev
```

## 🔐 How It Works

- You paste a link into the app.
- The link is encrypted in the browser with AES encryption.
- The encrypted version is stored on the backend using a short code like `A:12345`
- The backend never **sees** or **stores the key**
- The frontend can generate a QR code for the link
- When resolving the link, the frontend decrypts the link using the key

## 🧩 Features

- 🔒 AES encryption
- 🕔 5-minute TTL on all links
- 📱 QR code generation
- 🖱️ Copy to clipboard

## Author

[Yerofey S.](https://github.com/yerofey)

## License

[MIT](https://github.com/yerofey/timed.cc/blob/master/LICENSE)
