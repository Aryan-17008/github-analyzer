const searchBtn = document.getElementById("searchBtn");
const usernameInput = document.getElementById("username");

searchBtn.addEventListener("click", async () => {
  const username = usernameInput.value.trim();
  if (!username) return alert("Please enter a username!");

  searchBtn.textContent = "Analyzing...";
  searchBtn.disabled = true;

  try {
    const res = await fetch(`/api/github/${username}`);
    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    updateProfile(data);
    showTabs(data);
    showRadar(data);

  } catch (err) {
    alert("Something went wrong!");
  } finally {
    searchBtn.textContent = "Decode Any Developer";
    searchBtn.disabled = false;
  }
});

function updateProfile(data) {
  document.querySelector(".avatar").style.backgroundImage = `url(${data.avatar})`;
  document.querySelector(".avatar").style.backgroundSize = "cover";
  document.querySelector(".avatar").style.backgroundPosition = "center";

  document.querySelector(".profile-card h2").textContent = data.name;
  document.querySelector(".profile-card p").textContent = `@${data.username}`;

  const nums = document.querySelectorAll(".num");
  nums[0].textContent = data.public_repos;
  nums[1].textContent = data.topLanguages.length;
  nums[2].textContent = data.followers >= 1000
    ? (data.followers / 1000).toFixed(1) + "k"
    : data.followers;
  nums[3].textContent = data.totalStars >= 1000
    ? (data.totalStars / 1000).toFixed(1) + "k"
    : data.totalStars;

  const labels = document.querySelectorAll(".label");
  labels[3].textContent = "Total Stars";

  const bars = document.querySelectorAll(".bar");
  data.topLanguages.forEach((lang, i) => {
    if (bars[i]) {
      bars[i].setAttribute("data-lang", lang);
      bars[i].style.height = `${100 - i * 15}%`;
    }
  });
}

function showTabs(data) {
  let tabSection = document.getElementById("tab-section");
  if (!tabSection) {
    tabSection = document.createElement("div");
    tabSection.id = "tab-section";
    tabSection.className = "tab-section";
    document.querySelector("main.grid").appendChild(tabSection);
  }

  tabSection.innerHTML = `
    <div class="tab-buttons">
      <button class="tab-btn active" onclick="switchTab('repos', this)">📁 Repositories</button>
      <button class="tab-btn" onclick="switchTab('languages', this)">💻 Languages</button>
      <button class="tab-btn" onclick="switchTab('info', this)">👤 Profile Info</button>
    </div>

<div id="tab-repos" class="tab-content active">
  <div class="repo-list">

    ${data.topRepos.map(repo => `

      <div
        class="repo-card"
        onclick="window.open('https://github.com/${data.username}/${repo.name}','_blank')"
        style="cursor:pointer;"
      >

        <div class="repo-name">
          ${repo.name}
          <span style="font-size:11px;opacity:.5;">↗</span>
        </div>

        <div class="repo-meta">

          <span class="repo-lang">
            ${repo.language || "Unknown"}
          </span>

          <span class="repo-stars">
            ⭐ ${repo.stars}
          </span>

        </div>

      </div>

    `).join("")}

  </div>
</div>

    <div id="tab-languages" class="tab-content">
      <div class="lang-list">
        ${data.topLanguages.map((lang, i) => `
          <div class="lang-card">
            <div class="lang-bar-wrap">
              <div class="lang-bar-fill" style="width:${100 - i * 15}%"></div>
            </div>
            <div class="lang-meta">
              <span class="lang-name">${lang}</span>
              <span class="lang-pct">${100 - i * 15}%</span>
            </div>
          </div>
        `).join("")}
      </div>
    </div>

    <div id="tab-info" class="tab-content">
      <div class="info-list">
        <div class="info-row">
          <span class="info-label">📍 Location</span>
          <span class="info-value">${data.location || "Not specified"}</span>
        </div>
        <div class="info-row">
          <span class="info-label">📝 Bio</span>
          <span class="info-value">${data.bio || "No bio"}</span>
        </div>
        <div class="info-row">
          <span class="info-label">👥 Following</span>
          <span class="info-value">${data.following}</span>
        </div>
        <div class="info-row">
          <span class="info-label">📦 Total Repos</span>
          <span class="info-value">${data.public_repos}</span>
        </div>
        <div class="info-row">
          <span class="info-label">⭐ Total Stars</span>
          <span class="info-value">${data.totalStars}</span>
        </div>
      </div>
    </div>
  `;
}

function switchTab(tab, btn) {
  document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  document.getElementById("tab-" + tab).classList.add("active");
  btn.classList.add("active");
}

let radarChart = null;

function showRadar(data){

  let radarSection =
  document.getElementById("radar-section");

  if(!radarSection){

    radarSection =
    document.createElement("div");

    radarSection.id =
    "radar-section";

    radarSection.className =
    "radar-section";

    const tabs =
    document.getElementById("tab-section");

    if(tabs){

      tabs.parentNode.insertBefore(
        radarSection,
        tabs
      );

    }else{

      document
      .querySelector("main.grid")
      .appendChild(radarSection);

    }
  }

  const maxFollowers = 10000;
  const maxStars = 500;
  const maxRepos = 100;
  const maxLanguages = 10;

  const commitScore =
  Math.min(data.public_repos/maxRepos,1);

  const starScore =
  Math.min(data.totalStars/maxStars,1);

  const repoScore =
  Math.min(data.public_repos/maxRepos,1);

  const followerScore =
  Math.min(data.followers/maxFollowers,1);

  const langScore =
  Math.min(data.topLanguages.length/maxLanguages,1);

  const impactScore =
  Math.min(
    (data.totalStars+data.followers)
    /(maxStars+maxFollowers),
    1
  );

  const codeScore =
  Math.round(
    ((commitScore+repoScore)/2)*100
  );

  const consistency =
  Math.round(langScore*100);

  const impact =
  Math.round(impactScore*100);

  const rank =
  impact>80
  ?"S+"
  :impact>60
  ?"S"
  :impact>40
  ?"A"
  :"B";

  radarSection.innerHTML=`

<div class="radar-header">

<div class="radar-title">

● DEVELOPER SIGNATURE

</div>

</div>

<div class="radar-wrapper">

<div class="radar-chart">

<canvas id="signatureChart"></canvas>

</div>

<div class="radar-cards">

<div class="r-card">

<div class="r-number">

${codeScore}

</div>

<div class="r-label">

CODE SCORE

</div>

</div>

<div class="r-card">

<div class="r-number">

${consistency}

</div>

<div class="r-label">

CONSISTENCY

</div>

</div>

<div class="r-card">

<div class="r-number">

${impact}

</div>

<div class="r-label">

IMPACT

</div>

</div>

<div class="r-card">

<div class="r-number">

🔥 ${rank}

</div>

<div class="r-label">

DEV RANK

</div>

</div>

</div>

</div>

`;

  const ctx =
  document
  .getElementById(
    "signatureChart"
  );

  if(radarChart){

    radarChart.destroy();

  }


  radarChart =
radarChart = new Chart(ctx, {

  type: "radar",

  data: {

    labels: [
      "Activity",
      "Stars",
      "Repos",
      "Followers",
      "Languages",
      "Impact"
    ],

    datasets: [{

      data: [

        commitScore * 100,

        starScore * 100,

        repoScore * 100,

        followerScore * 100,

        langScore * 100,

        impact

      ],

      borderColor: "#4ade80",

      backgroundColor: "rgba(74,222,128,.25)",

      borderWidth: 4,

      pointRadius: 6,

      pointHoverRadius: 8,

      pointBackgroundColor: "#22d3ee"

    }]

  },

  options: {

    plugins: {

      legend: {

        display: false

      }

    },

    scales: {

      r: {

        min: 0,

        max: 100,

        ticks: {

          display: false

        },

        angleLines: {

          color: "rgba(74,222,128,.25)"

        },

        grid: {

          color: "rgba(74,222,128,.18)"

        },

        pointLabels: {

          color: "#ffffff",

          font: {

            size: 14,

            weight: "bold"

          }

        }

      }

    }

  }

});

}
