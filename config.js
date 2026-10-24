/* ========================================
   BINGO PARTY — CONFIGURATION FILE
   ========================================
   Customize this file for your event!
   Change the theme, colors, blessings, 
   and event details below.
   ======================================== */

const BINGO_CONFIG = {

    // ==========================================
    // EVENT DETAILS
    // ==========================================
    event: {
        title: "दशैं बिन्गो",             // Main title (can use any language)
        subtitle: "Dashain Bingo",         // Subtitle / English name
        tagline: "Celebrate the joy of Vijaya Dashami with family & community",
        navIcon: "🪷",                     // Emoji shown in navbar
        totalCards: 200,                   // Total bingo cards to generate
        totalPlayers: 50,                  // Number of players
    },

    // ==========================================
    // CARD DESIGN
    // ==========================================
    card: {
        headerText: "दशैं BINGO",          // Text on top of each card
        freeSpaceEmoji: "🪷",              // Emoji in the free center space
        freeSpaceText: "FREE",             // Text under the emoji
        footerText: "विजया दशमीको हार्दिक मंगलमय शुभकामना! 🌺", // Bottom of each card
    },

    // ==========================================
    // THEME COLORS (CSS custom properties)
    // Uncomment and change to override defaults
    // ==========================================
    // theme: {
    //     primary:      "#D32F2F",   // Main accent (default: Tika Red)
    //     primaryDeep:  "#B71C1C",   // Darker shade
    //     primaryLight: "#EF5350",   // Lighter shade
    //     secondary:    "#2E7D32",   // Secondary accent (default: Jamara Green)
    //     accent:       "#F9A825",   // Highlight color (default: Marigold Yellow)
    //     gold:         "#FFB300",   // Gold accents
    //     bgDark:       "#1a0a0a",   // Page background
    //     bgCard:       "#2a1515",   // Card/section background
    // },

    // ==========================================
    // BLESSINGS / MESSAGES FOR WINNERS
    // Customize for your culture/event!
    // Each item: { nepali: "...", english: "..." }
    // (You can use any two languages — rename keys as needed)
    // ==========================================
    blessings: {
        // Category 1 — e.g., for daughters, women, or group A
        category1: {
            label: "🌺 For Daughters (छोरीहरूको लागि)",
            items: [
                {
                    nepali: "सदा सुखी, सम्पन्न र स्वस्थ रहोस्। दशैंको यो पावन अवसरमा तिम्रो जीवन खुशीले भरिपूर्ण होस्।",
                    english: "May you always be happy, prosperous and healthy. On this auspicious occasion of Dashain, may your life be filled with joy."
                },
                {
                    nepali: "आयु, विद्या, बुद्धि, कीर्ति, सुख र बल प्राप्त होस्। दुर्गा माताको कृपा सधैं रहोस्।",
                    english: "May you receive long life, knowledge, wisdom, fame, happiness and strength. May Goddess Durga's blessings always be with you."
                },
                {
                    nepali: "जीवनमा सबै सपना पूरा होस्। दशैंले तिम्रो घरमा खुशी र शान्ति ल्याओस्।",
                    english: "May all your dreams come true. May Dashain bring happiness and peace to your home."
                },
                {
                    nepali: "विजया दशमीको टीका र जमराले तिम्रो जीवनमा नयाँ ऊर्जा र उमंग ल्याओस्।",
                    english: "May the tika and jamara of Vijaya Dashami bring new energy and enthusiasm to your life."
                },
                {
                    nepali: "नवदुर्गाको आशीर्वादले तिम्रो जीवन सुन्दर र सफल होस्। विजया दशमीको शुभकामना!",
                    english: "May the blessings of Navadurga make your life beautiful and successful. Happy Vijaya Dashami!"
                },
                {
                    nepali: "तिम्रो मुहारमा सधैं मुस्कान रहोस्, तिम्रो हृदयमा सधैं प्रेम रहोस्।",
                    english: "May your face always carry a smile, may your heart always be filled with love."
                }
            ]
        },

        // Category 2 — e.g., for sons, men, or group B
        category2: {
            label: "🌿 For Sons (छोराहरूको लागि)",
            items: [
                {
                    nepali: "शक्ति, साहस र बुद्धिले परिपूर्ण भई जीवनमा सबै कठिनाइहरू जित्ने शक्ति प्राप्त गर।",
                    english: "May you be endowed with strength, courage and wisdom to overcome all difficulties in life."
                },
                {
                    nepali: "यस दशैंमा तिम्रो जीवनमा नयाँ सफलताको बाटो खुलोस्। दुर्गा माताको कृपा रहोस्।",
                    english: "May new paths of success open in your life this Dashain. May Goddess Durga's grace be with you."
                },
                {
                    nepali: "आयुष्मान भव। धनवान भव। विद्यावान भव। कीर्तिमान भव। विजयी भव।",
                    english: "May you live long. May you be wealthy. May you be learned. May you be renowned. May you be victorious."
                },
                {
                    nepali: "दशैंको टीका र जमराले तिम्रो जीवनमा सदा हरियाली र समृद्धि ल्याओस्।",
                    english: "May the tika and jamara of Dashain always bring greenery and prosperity to your life."
                },
                {
                    nepali: "जीवनको हरेक क्षेत्रमा विजयी होऊ। असत्यमाथि सत्यको विजय सधैं होस्।",
                    english: "May you be victorious in every field of life. May truth always triumph over falsehood."
                },
                {
                    nepali: "बडादशैंको यो शुभ अवसरमा तिम्रो जीवन उज्यालो र सफल होस्।",
                    english: "On this auspicious occasion of Bada Dashain, may your life be bright and successful."
                }
            ]
        },

        // Category 3 — e.g., for everyone
        category3: {
            label: "🙏 For Everyone (सबैका लागि)",
            items: [
                {
                    nepali: "दशैंको रमाइलो सबैलाई मिलोस्। हामी सबै नेपाली एक परिवार हौं!",
                    english: "May everyone enjoy the festivities of Dashain. We Nepalis are all one family!"
                },
                {
                    nepali: "यो दशैंमा सबैको घरमा हाँसो, खुशी र शान्ति छाओस्।",
                    english: "May laughter, happiness and peace fill everyone's home this Dashain."
                },
                {
                    nepali: "टीकाको लालिमा, जमराको हरियाली, र दक्षिणाको समृद्धि सबैलाई प्राप्त होस्।",
                    english: "May everyone receive the redness of tika, the greenery of jamara, and the prosperity of dakshina."
                },
                {
                    nepali: "विजया दशमीको यो पावन पर्वले हामी सबैमा नयाँ उत्साह र ऊर्जा ल्याओस्।",
                    english: "May this sacred festival of Vijaya Dashami bring new enthusiasm and energy to all of us."
                },
                {
                    nepali: "समुदायमा एकता, प्रेम र सद्भाव बढ्दो रहोस्। दशैंले हामीलाई जोड्दो रहोस्।",
                    english: "May unity, love and harmony continue to grow in our community. May Dashain continue to unite us."
                },
                {
                    nepali: "बिन्गो खेलमा जित्ने सबैलाई बधाई! दशैंको आशीर्वाद सबैमाथि रहोस्!",
                    english: "Congratulations to all bingo winners! May Dashain blessings be upon everyone!"
                }
            ]
        }
    },

    // ==========================================
    // ASHIRBAD PAGE HEADER
    // ==========================================
    ashirbadPage: {
        titleNepali: "दशैंको शुभकामना",
        titleEnglish: "Dashain Ashirbad",
        subtitle: "Blessings for the winners and all players",
        randomButtonText: "🎲 Random Ashirbad for Winner",
        winnerEmojis: ['🏆', '🎉', '🌺', '🪷', '🙏', '✨', '🎊'],
    }
};
