const langColors = require("./languageColors.json")
const app = require("express")()

async function getTopLangs() {
    let obj = {}
    let data = await fetch("http://127.0.0.1:3000/api/v1/users/zenit/repos?limit=0");
    data = await data.json();

    data.forEach(repo => {
        const lang = repo.language

        if (obj[lang] && lang !== "") {
            obj[lang]++
        } else if (lang !== "") {
            obj[lang] = 1
        }
    })

    return calculatePercent(obj);
}

function calculatePercent(obj) {
    const totalHits = Object.values(obj).reduce((acc, curr) => acc + curr, 0);
    const percentages = {};

    for (const [category, hits] of Object.entries(obj)) {
        const percent = (hits / totalHits) * 100;
        percentages[category] = percent.toFixed(2);
    }

    return percentages;
}

function makeSVG(data) {
    const svgContent = Object.entries(data)
      .map(([language, percentage], index) => {
        const color = langColors[language] || "#111111";
        const circleY = 60 + (index * 25); // Adjust Y position for each language
  
        return `<circle cx="60" cy="${circleY}" r="10" fill="${color}" /><text x="80" y="${circleY + 5}" fill="#cbd0da">${language}: ${percentage}%</text>`;
      })
      .join('');
  
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">${svgContent}</svg>`;
  
    return svg;
  }
  
app.get("/lang-stats.svg", async (req, res) => {
    res.setHeader("content-type", "image/svg+xml")
    res.send(makeSVG(await getTopLangs()))
})

app.listen(3003)