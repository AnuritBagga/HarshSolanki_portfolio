# Harsh Solanki — Portfolio

A hand-built single-page portfolio. No framework, no build step, no dependencies.
Open `index.html` in a browser and it runs.

## What's in here

```
index.html                    the whole page
assets/css/style.css          all styling and animation
assets/js/main.js             loader sequence, nav, scroll reveals, hero video
assets/js/harshbot.js         the HarshBot chat assistant
assets/media/walk.webm        hero video, VP9 (Chrome, Firefox, Edge)
assets/media/walk.mp4         hero video, H.264 (Safari, iOS)
assets/media/poster.jpg       first frame, shown before the video plays
assets/img/harshbot.webp      standing 3D character (the chat assistant)
assets/img/peek.webp          caricature that peeks in during loading
assets/img/portrait.webp      portrait used in the About section
assets/docs/...Resume.pdf     the résumé the download button serves
```

## Putting it online

It's a static site, so any static host works. Drag the whole folder onto
**Netlify Drop** (app.netlify.com/drop), or push it to a GitHub repo and turn on
**GitHub Pages** (Settings → Pages → Deploy from branch → root). Vercel and
Cloudflare Pages work the same way. No server, no database, no API keys.

For a custom domain like `harshsolanki.com`, buy the domain and point it at
whichever host you picked — each of them has a one-page guide for this.

## Editing your details

Everything is plain text, so search for what you want to change:

| What | Where |
|---|---|
| Email, phone, LinkedIn | `index.html` — Contact section, and `assets/js/harshbot.js` |
| Project descriptions | `index.html` — `<section id="projects">` |
| Skill percentages | `index.html` — the `data-v="88"` attributes |
| Timeline entries | `index.html` — `<section id="journey">` |
| Colours | `assets/css/style.css` — the `:root` block at the top |
| Loading console lines | `assets/js/main.js` — the `LINES` array |

## Teaching HarshBot new answers

HarshBot runs entirely in the visitor's browser. There is no API and no cost,
but it only knows what's written into it. Open `assets/js/harshbot.js` and add
an entry to the `KB` array:

```js
{ k: ['drone', 'quadcopter', 'uav'],
  a: "Harsh built a quadcopter in 2026 with ..." },
```

`k` is the list of phrases a visitor might type. `a` is the reply — basic HTML
like `<b>bold</b>` and `<br>` works. Longer, more specific phrases score higher,
so add the exact wording people are likely to use.

## Replacing the video

Replace both `assets/media/walk.webm` and `assets/media/walk.mp4` and regenerate
the poster frame. Two encodings are shipped because Safari does not play WebM and
some Chromium builds do not ship the H.264 decoder. With ffmpeg:

```bash
ffmpeg -i source.mov -an -vf scale=1000:-2 -c:v libx264 -crf 26 -pix_fmt yuv420p -movflags +faststart walk.mp4
ffmpeg -i source.mov -an -vf scale=1000:-2 -c:v libvpx-vp9 -crf 36 -b:v 0 walk.webm
ffmpeg -ss 0.4 -i walk.mp4 -frames:v 1 poster.jpg
```

Keep each under a few MB so the page stays fast.

## Browser notes

- The hero video is muted and `playsinline`, so it autoplays on iOS and Android.
- Everything respects `prefers-reduced-motion`: the loader skips, the video
  holds on its poster, and animations stop.
- If JavaScript is blocked, the loader is bypassed and the full page still reads.
