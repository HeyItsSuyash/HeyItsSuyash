import re

with open('svgBuilder.js', 'r', encoding='utf-8') as f:
    content = f.read()

view_all_func = """
async function generateViewAllCard() {
    return `
<svg xmlns="http://www.w3.org/2000/svg" width="380" height="160" viewBox="0 0 380 160">
    ${COMMON_DEFS}
    <rect width="380" height="160" fill="#000000"/>
    <g transform="translate(15, 15)">
        <rect width="350" height="130" fill="#000000" stroke="#FFD700" stroke-width="1" filter="url(#clay-shadow)"/>
        <text x="175" y="65" fill="#ffffff" font-size="20" font-weight="600" text-anchor="middle">View All Repositories</text>
        <text x="175" y="90" fill="#FFD700" font-size="24" font-weight="600" text-anchor="middle">→</text>
    </g>
</svg>`;
}
"""

if "generateViewAllCard" not in content:
    content = content.replace("module.exports = {", view_all_func + "\nmodule.exports = {")
    content = content.replace("module.exports = {", "module.exports = { generateViewAllCard, ")

with open('svgBuilder.js', 'w', encoding='utf-8') as f:
    f.write(content)
