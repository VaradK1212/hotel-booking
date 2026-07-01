# Sahyadri House — Hotel Booking Website

A responsive hotel booking website built for a boutique retreat in the Western Ghats (Lonavala, India). Built with vanilla HTML, CSS, and JavaScript — no frameworks, no build step.

**[Live Demo](#)** · Built as Internship Task 3

## Overview

Sahyadri House is a fictional hotel landing page designed to demonstrate three core front-end skills: responsive layouts, interactive JavaScript components, and live API integration. The site includes a full booking flow UI, a room-matching quiz, and real-time weather data for trip planning.

## Features

- **Fully Responsive Design** — Custom breakpoints at 1024px, 768px, and 480px reflow the layout for desktop, tablet, and mobile, including a collapsible hamburger nav.
- **Image Carousel** — Auto-rotating hero carousel with manual arrow controls, clickable dot indicators, and pause-on-hover.
- **Live Weather Widget** — Fetches real-time weather (temperature, humidity, wind, "feels like") for Lonavala from the free [Open-Meteo API](https://open-meteo.com/), no API key required.
- **"Find Your Room" Quiz** — A 4-question interactive quiz that scores answers and recommends one of four room types.
- **Booking Interactions** — Functional date pickers, guest selector, room search, and reserve buttons, each confirmed with toast notifications (no backend — this is a front-end demo).
- **Micro-interactions** — Ripple effects, hover states, and press feedback across all buttons for a more tactile feel.

## Tech Stack

- HTML5
- CSS3 (custom properties, CSS Grid, Flexbox, media queries)
- Vanilla JavaScript (ES6+, Fetch API, DOM manipulation)
- [Open-Meteo API](https://open-meteo.com/) for live weather data
- Google Fonts: Fraunces, Inter, JetBrains Mono

## Project Structure

```
├── index.html      # Page structure and content
├── styles.css       # Design tokens, layout, and responsive media queries
├── script.js         # Carousel, weather fetch, quiz logic, booking interactions
└── README.md
```

## Getting Started

1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/sahyadri-house.git
   ```
2. Open `index.html` in your browser — that's it, no build tools or dependencies needed.

> Note: the live weather widget requires an internet connection to reach the Open-Meteo API.

## What This Project Demonstrates

This was built as part of an internship task covering:
1. **Responsive design with media queries** — adapting layout, typography, and navigation across screen sizes.
2. **Interactive JavaScript** — a multi-step quiz with scoring logic and a rotating image carousel.
3. **Fetching external API data** — pulling and dynamically rendering live weather data on page load.

## Disclaimer

Sahyadri House, its rooms, prices, and reviews are fictional and created for portfolio purposes. Live weather data is real.

## License

This project is open source and available for learning purposes.
