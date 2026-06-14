import re

with open('svgBuilder.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Update generateProjectCard
new_project_card = """
function wrapText(text, maxChars) {
    if (!text) return [];
    const words = text.split(' ');
    let lines = [];
    let currentLine = '';
    for (let word of words) {
        if ((currentLine + word).length > maxChars) {
            lines.push(currentLine.trim());
            currentLine = word + ' ';
        } else {
            currentLine += word + ' ';
        }
    }
    if (currentLine) lines.push(currentLine.trim());
    return lines;
}

async function generateProjectCard(repo) {
    if (!repo) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="414" height="200" viewBox="0 0 414 200"><rect width="414" height="200" fill="#000000"/></svg>`;
    }
    const langColor = { "JavaScript": "#f1e05a", "Python": "#3572A5", "TypeScript": "#3178c6", "HTML": "#e34c26" };
    const color = repo.language ? (langColor[repo.language] || "#cccccc") : "#cccccc";
    
    const lines = wrapText(repo.readme_snippet, 45).slice(0, 3); // Max 3 lines
    const textTspans = lines.map((l, i) => `<tspan x="20" dy="${i === 0 ? 0 : 20}">${l}</tspan>`).join('');

    return `
<svg xmlns="http://www.w3.org/2000/svg" width="414" height="200" viewBox="0 0 414 200">
    ${COMMON_DEFS}
    <rect width="414" height="200" fill="#000000"/>
    <g transform="translate(10, 10)">
        <rect width="394" height="180" fill="#000000" stroke="#FFD700" stroke-width="1"/>
        <text x="20" y="40" fill="#ffffff" font-size="20" font-weight="600">${repo.name}</text>
        
        <text x="20" y="75" fill="#aaaaaa" font-size="14" font-family="'Space Grotesk', sans-serif">
            ${textTspans}
        </text>

        <circle cx="20" cy="155" r="5" fill="${color}"/>
        <text x="35" y="160" fill="#dddddd" font-size="14">${repo.language || "Code"}</text>
        <text x="120" y="160" fill="#FFD700" font-size="14">★ ${repo.stargazers_count}</text>
    </g>
</svg>`;
}
"""

content = re.sub(r'async function generateProjectCard\(repo\).*?</svg>`;\n}', new_project_card, content, flags=re.DOTALL)

# Update generateViewAllCard
new_view_all = """
async function generateViewAllCard() {
    return `
<svg xmlns="http://www.w3.org/2000/svg" width="414" height="200" viewBox="0 0 414 200">
    ${COMMON_DEFS}
    <rect width="414" height="200" fill="#000000"/>
    <g transform="translate(10, 10)">
        <rect width="394" height="180" fill="#000000" stroke="#FFD700" stroke-width="1"/>
        <text x="197" y="90" fill="#ffffff" font-size="22" font-weight="600" text-anchor="middle">View All Repositories</text>
        <text x="197" y="120" fill="#FFD700" font-size="28" font-weight="600" text-anchor="middle">→</text>
    </g>
</svg>`;
}
"""

content = re.sub(r'async function generateViewAllCard\(\).*?</svg>`;\n}', new_view_all, content, flags=re.DOTALL)

with open('svgBuilder.js', 'w', encoding='utf-8') as f:
    f.write(content)
