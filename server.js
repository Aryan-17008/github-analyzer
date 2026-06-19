const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// GitHub API route
app.get("/api/github/:username", async (req, res) => {
  try {
    const { username } = req.params;

    const [profileRes, reposRes] = await Promise.all([
      axios.get(`https://api.github.com/users/${username}`),
      axios.get(`https://api.github.com/users/${username}/repos?per_page=100`)
    ]);

    const profile = profileRes.data;
    const repos = reposRes.data;

    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);

    const languages = {};
    repos.forEach(repo => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    const topLanguages = Object.entries(languages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([lang]) => lang);

    const topRepos = repos
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 20)
      .map(r => ({ name: r.name, stars: r.stargazers_count, language: r.language,  url: r.html_url }));

    res.json({
      name: profile.name || username,
      username: profile.login,
      avatar: profile.avatar_url,
      bio: profile.bio,
      followers: profile.followers,
      following: profile.following,
      public_repos: profile.public_repos,
      location: profile.location,
      totalStars,
      topLanguages,
      topRepos
    });

  } catch (err) {
    res.status(404).json({ error: "GitHub user not found!" });
  }
});

// Gemini AI Roast route
app.post("/api/roast", async (req, res) => {
  try {
    const { profileData } = req.body;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: `You are a savage but funny AI that roasts GitHub profiles.
Roast this developer in 4-5 sentences. Be funny and brutally honest but not mean.
Also give them a funny developer title like "The CSS Avoider" or "The Commit Spammer".

Profile:
- Name: ${profileData.name}
- Public Repos: ${profileData.public_repos}
- Followers: ${profileData.followers}
- Total Stars: ${profileData.totalStars}
- Top Languages: ${profileData.topLanguages.join(", ")}
- Top Repos: ${profileData.topRepos.map(r => r.name).join(", ")}

Respond ONLY in this JSON format, no extra text:
{
  "title": "funny developer title",
  "roast": "your roast here"
}`
          }]
        }]
      }
    );

    const text = response.data.candidates[0].content.parts[0].text;
    const clean = text.replace(/```json|```/g, "").trim();
    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch (e) {
      const titleMatch = clean.match(/"title"\s*:\s*"([^"]+)"/);
      const roastMatch = clean.match(/"roast"\s*:\s*"([^"]+)"/);
      parsed = {
        title: titleMatch ? titleMatch[1] : "The Mystery Coder",
        roast: roastMatch ? roastMatch[1] : clean
      };
    }
    res.json(parsed);

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "AI roast failed!" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
