# ☄️ Our Ending Days

Do you know when we will all perish? Do you wanna know? Find out when the next Armageddon will be!

> *How much time do we have left… until the next end of the world?*

A full-stack web application that visualizes the time between predicted "end of the world" events — with a live countdown, dynamic progress tracking, and historical navigation.

---

## 🌐 Live Demo

👉 https://ourendingdays.com

---

## 🧠 Concept

The app calculates:

* ⏳ Time remaining until the next predicted apocalypse
* 📊 Progress between the previous and next "end of the world"
* 📜 Historical and future events with descriptions

> It answers one question:
> **Where are we right now between two doomsdays?**

---

## ⚙️ Tech Stack

### Frontend

* HTML5 + CSS (Foundation)
* Vanilla JavaScript
* Particles.js (background animation)

### Backend

* Node.js
* Express.js

### Database

* MySQL

### Deployment

* Node.js App environment

---

## 🏗️ Architecture

```
Client (Browser)
      ↓
Express Server (Node.js)
      ↓
MySQL Database
```

* `/` → serves frontend (static files)
* `/api/doomsdays` → returns events from DB
* frontend fetches → calculates → renders UI

---

## 📂 Project Structure

```
endingdays/
├── server.js
├── package.json
├── public/
│   ├── index.html
│   ├── js/
│   │   └── main.js
│   ├── assets/
│   ├── img/
│   └── fonts/
```

---

## 🔥 Features

* ⏱️ Real-time countdown timer
* 📊 Dynamic progress bar between events
* 🎨 Color changes based on time
* 🔄 Navigation between past & future doomsdays
* 🌌 Animated particle background
* 🧠 Data-driven (MySQL API)

---

## 🧮 Core Logic

Progress calculation:

```
progress = (now - previous) / (next - previous)
```

* Returns value between `0` and `1`
* Converted to percentage for UI

---

## 🚀 Getting Started (Local)

```bash
git clone https://github.com/yourusername/ourendingdays.git
cd endingdays
npm install
```

Create `.env`:

```
DB_HOST=...
DB_PORT=...
DB_USER=...
DB_PASSWORD=...
DB_NAME=...
PORT=3000
```

Run:

```bash
node server.js
```

---

## ⚠️ Notes

* Large future years (e.g. 22000000000) require special handling (JavaScript Date limits)
* Designed to be extended with admin features or APIs

---

## 🧠 Future Improvements

* 🛠 Admin panel for adding events
* 🌍 External API integration (e.g. NASA, predictions)
* 📱 Mobile optimization
* 🎬 Smooth animations & transitions

---

## 👨‍💻 Author

**Pavlo Mospan(c) 2017**. Updated 2026

* 💼 Data Scientist / AI Engineer
* 🌍 Augsburg, Germany

---

## ⭐️ Show your support

If you like this project:

* ⭐️ Star the repo
* 🍴 Fork it
* 🧠 Share ideas

---

> *Time is running…*
