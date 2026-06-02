# TestHub — SSC Exam Mock Test Platform

A complete Testbook / Prepp–style website for SSC exam preparation. Built with vanilla HTML, CSS & JavaScript — no build step, no framework, just open and run.

## ✨ Features

- **Home page** — live activity ticker, 8 exam categories, today's popular tests, test series bundles
- **Mock tests browser** — filter by exam / type / language, search, sort
- **Test-taking engine** — real SSC CBT interface with timer, question palette, mark-for-review, section navigation, English↔Hindi toggle
- **Result page** — animated score circle, AIR rank, percentile, section & topic breakdown, topper comparison, AI improvement tips
- **Test Series (Pro)** — 6 pre-built bundles (CGL, CHSL, MTS+GD, CPO, Mega Pack, Quant Booster)
- **Checkout flow** — UPI / Net Banking / Card, coupon codes, QR code, order confirmation
- **Admin panel** — login, dashboard stats, approve/reject payments, add/edit/delete test series, add new tests, view users
- **100 real SSC CGL questions** across Reasoning, GA, Quant, English
- Fully responsive (desktop, tablet, mobile)
- Persistent storage via `localStorage` for orders, series, drafts, admin auth

## 🚀 Run locally

```bash
# Option 1: Python
python3 -m http.server 8000
# then open http://localhost:8000

# Option 2: Node
npx serve .

# Option 3: just open index.html in your browser
```

## 📁 Project structure

```
.
├── index.html            Home page
├── tests.html            Browse all mock tests
├── test.html             Active test interface
├── result.html           Test result & analysis
├── series.html           Test series bundles
├── buy.html              Checkout / payment
├── admin.html            Admin panel (admin / admin123)
└── assets/
    ├── css/style.css
    └── js/
        ├── data.js       Question bank + catalog
        └── app.js        Application logic
```

## 🔐 Admin credentials

```
Username: admin
Password: admin123
```

## 🛒 Demo coupon codes

| Code      | Discount |
|-----------|----------|
| WELCOME50 | ₹50      |
| SSC2026   | ₹100     |
| MEGA      | ₹200     |
| FIRST     | ₹75      |

## 🧩 Tech stack

- Pure HTML5, CSS3, vanilla JavaScript
- Google Fonts (Inter + Poppins)
- SVG animations
- No build tools, no dependencies

## 📜 License

MIT
