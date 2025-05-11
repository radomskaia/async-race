# Async Race

A single-page application that simulates an asynchronous car race with dynamic animations, car controls, and RESTful interaction with a mock server.

## 🔗 Task

Project completed as part of [RS School JavaScript course](https://github.com/rolling-scopes-school/tasks/tree/master/stage2/tasks/async-race).

## 🚀 Features

* View, create, update, and delete cars from the garage
* Generate multiple random cars at once
* Launch races with multiple cars simultaneously
* Animate cars moving across the screen with engine state updates
* Determine the winner and record the best time
* Track race winners and statistics in a separate table

## ⚙️ Tech Stack

* TypeScript
* HTML/CSS (no frameworks)
* REST API (CRUD operations + engine control)
* DOM-based animation (`requestAnimationFrame`)
* GitHub Pages for deployment

## 📦 Installation

```bash
git clone https://github.com/radomskaia/async-race.git
cd async-race
npm install
npm run dev
```

## 🖥️ Local API Server Required

To use the application, you must run a local mock API server:

1. Clone the server repository:

   ```bash
   git clone https://github.com/mikhama/async-race-api.git
   cd async-race-api
   ```

2. Install dependencies and start the server:

   ```bash
   npm install
   npm run start
   ```

3. The server will run at `http://localhost:3000`.

📌 The client app expects this API to be available locally at that address.

## 🔧 Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build the app for deploy |
| `npm run preview` | Preview production build |

## 📍 Deployment

Available at: **[https://radomskaia.github.io/async-race/](https://radomskaia.github.io/async-race/)**
