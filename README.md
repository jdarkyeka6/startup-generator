# SwipeStart

A mobile-first startup idea discovery prototype. Swipe left to pass, swipe right to save an idea.

## Included

- Tinder-style drag/swipe cards
- Pass, save and undo actions
- Category filters
- Saved ideas stored locally in the browser
- Responsive iPhone-style layout with safe-area support
- Keyboard arrow controls on desktop
- No framework or build step required

## Run locally

Open `index.html`, or serve the folder with any static web server.

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Next step: iPhone/TestFlight

This prototype is intentionally plain HTML/CSS/JS so it can be wrapped with Capacitor and opened in Xcode without rebuilding the product UI.
