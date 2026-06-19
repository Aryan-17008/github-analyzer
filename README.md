# 🚀 GitHub Analyzer

A modern web application that analyzes GitHub profiles and visualizes developer activity using interactive dashboards, repository insights, and a Developer Signature radar chart.

## 📌 Overview

GitHub Analyzer fetches public GitHub data and transforms it into an easy-to-understand developer dashboard.

Users can enter any GitHub username and instantly view:

- Profile information
- Repository statistics
- Top programming languages
- Developer Signature radar chart
- Developer performance metrics

---

## ✨ Features

### 👤 Profile Analysis

Displays:

- Name
- Username
- Profile picture
- Bio
- Followers
- Following
- Public repositories
- Location

### 📁 Repository Explorer

- Shows top repositories
- Displays repository stars
- Displays repository language
- Clickable repository cards
- Opens repositories directly on GitHub

### 💻 Language Analysis

Displays the most frequently used programming languages.

### 📊 Developer Signature

Interactive radar chart that visualizes:

- Commits
- Stars
- Repositories
- Followers
- Languages
- Overall impact

### 📈 Developer Metrics

Generates:

- Code Score
- Consistency Score
- Impact Score
- Developer Rank

---

## 🛠️ Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Node.js
- Express.js

### Libraries

- Axios
- CORS
- Chart.js
- Dotenv

### API

- GitHub REST API

---

## 📂 Project Structure

```
github-analyzer/
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── server.js
├── package.json
├── package-lock.json
├── .env
└── README.md
```

---

## ⚙️ Installation

### Clone repository

```bash
git clone https://github.com/Aryan-17008/github-analyzer.git
```

### Enter project directory

```bash
cd github-analyzer
```

### Install dependencies

```bash
npm install
```

### Create environment file

Create a `.env` file.

```env
PORT=3000
```

### Start server

```bash
npm start
```

or

```bash
node server.js
```

Application will run at:

```
http://localhost:3000
```

---

## 🚀 Usage

1. Open the application.
2. Enter a GitHub username.
3. Click **Run Analysis**.
4. Explore the dashboard and developer insights.

---

## 📷 Screenshots

Add screenshots here after deployment.

Example:

- Home Page
- Developer Signature Radar Chart
- Repository Dashboard

---

## 🔮 Future Improvements

- Improve radar chart accuracy
- Display additional repositories
- Add contribution analysis
- Add dark/light theme toggle
- Add repository filtering
- Add export functionality

---

## 👨‍💻 Author

**Aryan Saundade**

GitHub: https://github.com/Aryan-17008

---

## 📄 License

This project is licensed under the MIT License.
