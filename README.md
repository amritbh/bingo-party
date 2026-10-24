# 🎲 Bingo Party

A beautiful, customizable Bingo game web application for community events and celebrations. Ships with a **Dashain (दशैं)** theme but is fully configurable for any event — Christmas, Diwali, Holi, New Year, or any party!

![Bingo Party](https://img.shields.io/badge/Game-Bingo_Party-red?style=for-the-badge) ![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-green?style=for-the-badge) ![Offline](https://img.shields.io/badge/Works-Offline-blue?style=for-the-badge)

## ✨ Features

- 🎴 **200+ Unique Bingo Cards** — Auto-generated, printable (1/2/4/6 per page)
- 🎯 **Random Number Caller** — Big-screen display for projector/TV with sound effects
- 🌺 **Custom Blessings/Messages** — Configurable winner messages in any language
- 📱 **Fully Responsive** — Works on PC, projector, iPhone, iPad
- 🖨️ **Print Optimized** — Color-ready, beautiful card layouts
- 🔊 **Sound Effects** — Audio feedback on number calls
- ⌨️ **Keyboard Shortcuts** — Press Spacebar to call numbers
- 🌐 **No Internet Required** — Works completely offline!
- 🎨 **Fully Customizable** — Colors, text, blessings — all via `config.js`

## 🚀 Quick Start

```bash
# No installation needed! Just open in any browser:
open index.html

# Or use a local server:
python3 -m http.server 8888
```

## 🎨 Customization

Edit `config.js` to customize everything for your event:

```javascript
const BINGO_CONFIG = {
    event: {
        title: "Christmas Bingo",        // Your event title
        subtitle: "Holiday Fun!",         // Subtitle
        navIcon: "🎄",                   // Navigation emoji
        totalCards: 100,                  // Number of cards
        totalPlayers: 25,                // Number of players
    },
    card: {
        headerText: "🎄 BINGO",          // Card header
        freeSpaceEmoji: "⭐",            // Center space emoji
        footerText: "Merry Christmas! 🎅", // Card footer
    },
    // Change colors, blessings, and more!
};
```

### What You Can Customize

| Setting | Description |
|---------|-------------|
| `event.*` | Title, subtitle, player/card counts, icon |
| `card.*` | Card header, footer, free space design |
| `theme.*` | All colors — primary, secondary, accent, backgrounds |
| `blessings.*` | Winner messages in any language (3 categories) |
| `ashirbadPage.*` | Blessings page title, button text, emojis |

## 🎮 How to Play

1. **Print Cards** — Go to "Print Cards" tab → Generate → Print
2. **Distribute** — Give cards to players (e.g., 4 each for 50 players)
3. **Call Numbers** — Open "Number Caller" on projector, click or press **Spacebar**
4. **BINGO!** — First to complete a line shouts "BINGO!"
5. **Bless the Winner** — Switch to "Ashirbad" tab for a random winner message!

### Game Variations

| Round | Pattern | Description |
|-------|---------|-------------|
| 1 | Single Line | Any row, column, or diagonal |
| 2 | Four Corners | All 4 corner numbers |
| 3 | X Pattern | Both diagonals |
| 4 | Full House | All numbers on the card |

## 📁 Project Structure

```
bingo-party/
├── index.html    # Main page (4 sections: Home, Cards, Caller, Blessings)
├── style.css     # Theme design system (CSS custom properties)
├── app.js        # Core logic (card generator, caller, blessings)
├── config.js     # ⚙️ YOUR CUSTOMIZATION FILE — edit this!
└── README.md
```

## 🛠️ Tech Stack

- **Pure HTML, CSS, JavaScript** — No frameworks, no dependencies, no build step
- **Web Audio API** — Sound effects
- **CSS Custom Properties** — Theme system
- **Seeded RNG** — Reproducible, unique card generation
- **CSS Print Media Queries** — Optimized printing

## 🎉 Default Theme: Dashain (दशैं)

The default theme celebrates **Dashain**, Nepal's greatest festival:
- 🔴 **Tika Red** — The sacred vermillion blessing mark
- 🟢 **Jamara Green** — Sacred barley grass sprouts
- 🟡 **Marigold Yellow** — Festive sayapatri flowers
- Includes **Dashain Ashirbad** (blessings) in Nepali & English

## 📄 License

MIT License — Free to use for any celebration! 🎉

## 🙏 Contributing

Fork it, customize it, share it with your community!
