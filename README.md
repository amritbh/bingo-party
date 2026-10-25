# 🎲 Bingo Party — Dashain Bingo (दशैं बिन्गो)

A beautiful, customizable Bingo game web application for community events and celebrations. Ships with a **Dashain (दशैं)** theme featuring traditional Sanskrit mantras and Nepali blessings, but is fully configurable for any event — Christmas, Diwali, Holi, birthdays, or any party!

[![Play Online](https://img.shields.io/badge/Play%20Online-GitHub%20Pages-brightgreen?style=for-the-badge&logo=github)](https://amritbh.github.io/bingo-party/)
![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-blue?style=for-the-badge)
![Works Offline](https://img.shields.io/badge/Works-100%25%20Offline-orange?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

🌐 **Live Web App:** [https://amritbh.github.io/bingo-party/](https://amritbh.github.io/bingo-party/)

---

## 🚀 Quick Start — Clone & Play

No installation, no npm, no build step. Works immediately in any browser!

```bash
# 1. Clone the repository
git clone https://github.com/amritbh/bingo-party.git

# 2. Enter directory
cd bingo-party

# 3. Open directly in your browser:
# On Mac:
open index.html

# On Windows:
start index.html

# On Linux:
xdg-open index.html

# Or run a local HTTP server:
python3 -m http.server 8888
```

Then visit `http://localhost:8888` on your computer or mobile device!

---

## ✨ Features

- 🎴 **200 Unique Printable Bingo Cards** — Auto-generated, seed-based unique cards (1, 2, 4, or 6 per page for printing)
- 🎯 **Interactive Number Caller** — Projector-ready big screen caller with audio chimes and interactive 75-number board
- 🕉️ **Traditional Sanskrit Mantras & Ashirbad** — Authentic Vedic & Puranic mantras:
  - *पुरुष टीका मन्त्र (Tika Ashirbad for Men — आयुर्द्रोणसुते...)*
  - *महिला टीका मन्त्र (Tika Ashirbad for Women — जयन्ती मङ्गला काली...)*
  - *सर्वमङ्गलमाङ्गल्ये (Universal Auspiciousness)*
  - *देवी शक्ति मन्त्र (Power & Vitality)*
  - *सर्वाबाधा विनिर्मुक्तो (Freedom from Obstacles)*
  - *विश्व शान्ति प्रार्थना (Universal Well-being)*
- 🌺 **Nepali Blessings** — Curated blessings for daughters, sons, and the whole community
- 🎲 **Random Winner Blessing Picker** — Click to award an auspicious blessing / mantra to the game winner
- 📱 **Fully Responsive** — Seamlessly adapts from desktop projector displays to iPad and mobile phones
- 🖨️ **Print Optimized** — Dedicated CSS `@media print` rules for clean, colorful, border-perfect card printing
- ⌨️ **Keyboard Friendly** — Press `Spacebar` to draw the next number
- 🌐 **100% Offline Capable** — Runs completely standalone from a USB drive or folder without internet

---

## 🎮 How to Run Your Community Event

| Step | Action | Detail |
|------|--------|--------|
| **1. Print Cards** | Go to **"Print Cards"** tab | Select 1–200 cards, 4 per page, and print on light cream/yellow paper. |
| **2. Distribute** | Hand out to players | Give 4 cards per player (e.g., 50 players × 4 cards = 200 cards). |
| **3. Project Caller** | Connect PC to TV/Projector | Open `index.html` or the [Live Site](https://amritbh.github.io/bingo-party/), switch to **"Number Caller"**, press **F11** for full screen. |
| **4. Call Numbers** | Press **Spacebar** or click **"Call Number"** | The screen calls out numbers with sound and marks them on the master board. |
| **5. Celebrate BINGO!** | Player shouts **"BINGO!"** | Verify card against caller board. |
| **6. Award Ashirbad** | Go to **"Ashirbad"** tab | Click **"🎲 Random Ashirbad / Mantra for Winner"** to read and bestow the blessing! |

---

## 🏆 Winning Rules & Prize Patterns (खेलका नियम तथा पुरस्कार)

In community and family Bingo, awarding prizes across **4 sequential rounds** keeps everyone excited from start to finish!

| Prize Round | Winning Pattern | Rule & Description | Sample Reward / Dakshina |
|:---:|:---:|---|:---:|
| **Round 1: 1st Prize**<br>(पहिलो पुरस्कार) | **१ लाइन (Single Line)** | Any complete line of 5 numbers (horizontal row, vertical column, or diagonal). Center FREE space counts! | Early Bird Prize / दक्षिणा |
| **Round 2: Bonus**<br>(बोनस पुरस्कार) | **४ कुना (Four Corners)** | The 4 extreme corner numbers of the card (top-left, top-right, bottom-left, bottom-right). | Sweet box or gift token |
| **Round 3: 2nd Prize**<br>(दोस्रो पुरस्कार) | **२ लाइन (Two Lines)** | Any 2 completed lines on the same card (e.g., 2 horizontal rows or 1 row + 1 column). | 2nd Place Prize / दक्षिणा |
| **Round 4: Grand Bumper**<br>(👑 बम्पर पुरस्कार) | **पूरा कार्ड (Full House / Blackout)** | **All 24 numbers matched on the card!** The first player to cover the entire card wins the Grand Bumper Prize! | 🏆 Grand Dashain Bumper Gift |

### 💡 Host Tips for Running the Rounds:
1. **Don't clear cards between rounds:** Players keep marking their existing cards as numbers continue to be drawn, progressing from 1 Line → Corners → 2 Lines → Full House.
2. **Immediate verification:** When a player shouts *"BINGO!"*, quickly check the numbers against the **Called Numbers Board** on the screen.
3. **Ties:** If two players shout at the exact same number, award both or do a quick 1-number draw tiebreaker!

---

## 🎨 Easy Customization

Everything is controlled by a single file: `config.js`! No coding required:

```javascript
const BINGO_CONFIG = {
    event: {
        title: "दशैं बिन्गो",             // Main event title
        subtitle: "Dashain Bingo",         // Subtitle
        tagline: "Celebrate Vijaya Dashami with family & community",
        navIcon: "🪷",
        totalCards: 200,                   // Total cards to generate
        totalPlayers: 50,                  // Number of players
    },
    card: {
        headerText: "दशैं BINGO",
        freeSpaceEmoji: "🪷",
        footerText: "विजया दशमीको हार्दिक मंगलमय शुभकामना! 🌺",
    },
    // Customize colors, mantras, blessings, and languages!
};
```

---

## 📁 Repository Structure

```
bingo-party/
├── index.html    # Single-page web app (Home, Print Cards, Number Caller, Ashirbad)
├── config.js     # ⚙️ Configuration file for easy customization
├── app.js        # Core logic: PRNG bingo cards, number caller, audio, dynamic ashirbad
├── style.css     # Festive theme: Tika Red (#D32F2F), Jamara Green (#2E7D32), Marigold (#F9A825)
└── README.md
```

---

## 📄 License

MIT License — free to use, share, and customize for any community festival or family party! 🎉
