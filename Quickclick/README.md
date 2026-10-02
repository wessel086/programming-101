# Quick Click

Een browsergebaseerde reactiegame gebouwd met HTML, CSS en JavaScript. Klik zo snel mogelijk op de verschijnende cirkels voordat ze verdwijnen. Mis je een cirkel, of klik je naast een target? Dan verlies je tijd. Haal zo veel mogelijk punten binnen 30 seconden.

---

## Controls

| Actie | Wat het doet |
|---|---|
| Klik op een grijze cirkel | +1 punt |
| Klik op een groene cirkel | +3 seconden |
| Klik op een gouden cirkel | +5 punten |
| Klik naast een cirkel | -2 seconden |
| Cirkel verdwijnt zonder klik | -2 seconden |
| Level 4 | Alleen linkermuisknop telt |

---

## Levels

| Level | Target levensduur | Targetgrootte |
|---|---|---|
| 1 | 5s / 3s / 3s | Normaal |
| 2 | 4s / 2s / 2s | Normaal |
| 3 | 3s / 1s / 1s | Normaal |
| 4 | 3s / 1s / 1s | 60% van normaal |

---

## Hoe runnen

1. Clone de repository:
   ```
   git clone <https://gitlab.fdmci.hva.nl/propedeuse/projecten/2026-2027/out-d/programming-101/programming-101-van-wessel-kaldenbach>
   ```
2. Open `Home.html` in je browser (geen server nodig).
3. Voer je naam in, kies een level en klik op **Start game**.

> p5.js wordt geladen via CDN. Je hebt een internetverbinding nodig.

---

## Projectstructuur

```
quick-click/
├── Home.html
├── game.html
├── quickclick.js
├── game.js
├── Styleqc.css
└── fotos/
    └── muis.png
```

---

## Credits

| Bron | Gebruik |
|---|---|
| [p5.js](https://p5js.org/) via CDN | Canvas rendering en game loop |
| `fotos/muis.png` | Fecteezy, controls-uitleg op homepagina |
| 'fotos/crosshair.png' | https://www.citypng.com/photo/20168/red-crosshair-icon-transparent-background |
| geluiden/pew.wav | https://freesound.org/people/hotpin7/sounds/819682/ |
---

## Peer-review checklist

Uitgevoerd door: **Pim Van Dam**

- [v] Start de demo: werkt het zonder console-errors?
- [v] Interactie: doen beide acties wat ze moeten doen?
- [v] Variabelen/loops/functions/arrays/if's aanwezig en functioneel?
- [v] Code leesbaar: namen duidelijk, geen duplicatie, geen dode code?
- [v] Performance: geen zware berekeningen in draw() zonder noodzaak?
- [v] README compleet; credits voor externe assets staan erbij?
