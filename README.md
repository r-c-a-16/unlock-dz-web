# UNLOCK DZ

An open-source assistant that helps you prepare appeal messages and keep track of account and game cases, in Arabic, English and French.

> The app prepares a draft for you. It never sends anything on your behalf, and it has no connection to any platform's moderation system. You review the draft and submit it yourself through the platform's official channel.

## Features

- **Appeal message drafts** for 30+ social networks and games, generated from neutral, editable templates in three languages (Arabic, English, French).
- **Case log** with statuses, notes and follow-up dates, stored locally in your browser. Export and import as JSON, or add follow-ups to your calendar (`.ics`).
- **Guided appeal information** for selected platforms, with a "last reviewed" date and a warning when the information gets old.
- **Safety checks** that block passwords, verification codes and card numbers from being entered or saved.
- **Scam checker** that scans a pasted "unban service" offer for common fraud signs, entirely on your device.
- **Screenshot reader (beta)** that suggests an issue type from a ban-message screenshot using client-side OCR.
- Light and dark themes, responsive layout from phones to desktops, and full RTL support.

## Privacy

All data stays in your browser (`localStorage`). The app has no backend and sends nothing to any server. The only network requests are for fonts, icons, help links you choose to open, and the OCR library, which is loaded on demand.

## Project structure

```
index.html      Page markup
css/style.css   Styles (light/dark themes, responsive layout)
js/app.js       Application logic (platforms, templates, log, OCR, i18n)
assets/         Logo, favicons and avatar
LICENSE         MIT License
```

There is no build step and there are no dependencies to install.

## Getting started

Clone the repository and open `index.html` in a browser, or serve the folder with any static file server:

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploying to GitHub Pages

1. Push the project to a GitHub repository, with `index.html` in the repository root.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, then select `main` and `/ (root)`.
4. Save. Your site will be available at `https://<your-username>.github.io/<your-repo>/`.

## Customizing

| What                 | Where                                                  |
| -------------------- | ------------------------------------------------------ |
| Platforms            | The `add(...)` blocks near the top of `js/app.js`      |
| Message templates    | The `T` object in `js/app.js`                          |
| Interface strings    | The `TR_DATA` translation table in `js/app.js`         |
| Appeal guidance      | The `APPEAL` object in `js/app.js`                     |
| Colors and theming   | CSS variables at the top of `css/style.css`            |

## Contributing

Issues and pull requests are welcome. When updating platform links or appeal guidance, please cite an official source and update the `checked` date.

## License

Released under the [MIT License](LICENSE). You are free to use, modify, distribute and sell this software, including for commercial purposes, as long as the copyright and license notice are kept.

## Third-party resources

- [Font Awesome](https://fontawesome.com), loaded from a CDN
- [Alexandria](https://fonts.google.com/specimen/Alexandria) via Google Fonts, loaded from a CDN
- [Tesseract.js](https://github.com/naptha/tesseract.js), loaded from a CDN only when the screenshot reader is used

## Disclaimer

Platform names such as WhatsApp, TikTok and Instagram are trademarks of their respective owners. This project is independent and is not affiliated with, endorsed by, or sponsored by any of them. The software is provided "as is", and it cannot guarantee the outcome of any appeal; the final decision always rests with the platform.
