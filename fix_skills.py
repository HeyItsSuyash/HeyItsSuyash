import re

with open('svgBuilder.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the generateSkills function completely
new_skills_func = """async function generateSkills() {
    const skills = [
        { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
        { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-line.svg' },
        { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
        { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
        { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
        { name: 'C++', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
        { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
        { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
        { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
        { name: 'TensorFlow', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg' },
        { name: 'PyTorch', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg' },
        { name: 'FastAPI', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg' },
        { name: 'Pandas', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg' },
        { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
        { name: 'Figma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
        { name: 'Blender', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blender/blender-original.svg' },
        { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
        { name: 'Linux', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg' },
        { name: 'Vercel', icon: 'https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png' },
        { name: 'Nginx', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg' }
    ];

    let badges = '';
    const badgeWidth = 140;
    const badgeHeight = 40;
    const paddingX = 15;
    const paddingY = 15;
    
    // Calculate rows
    const itemsPerRow = 7;
    let y = 80;
    
    for (let i = 0; i < skills.length; i += itemsPerRow) {
        const rowItems = skills.slice(i, i + itemsPerRow);
        const rowWidth = rowItems.length * badgeWidth + (rowItems.length - 1) * paddingX;
        let x = (1200 - rowWidth) / 2; // center the row
        
        for (let j = 0; j < rowItems.length; j++) {
            const skill = rowItems[j];
            const b64 = await getBase64Image(skill.icon);
            badges += `
        <g transform="translate(${x}, ${y})">
            <rect width="140" height="36" rx="18" fill="#111111" stroke="rgba(255,215,0,0.3)" stroke-width="1" filter="url(#clay-shadow)"/>
            <image href="${b64}" x="15" y="8" width="20" height="20"/>
            <text x="45" y="24" fill="#dddddd" font-size="14" font-weight="500">${skill.name}</text>
        </g>`;
            x += badgeWidth + paddingX;
        }
        y += badgeHeight + paddingY;
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${y + 30}" viewBox="0 0 1200 ${y + 30}">
    ${COMMON_DEFS}
    <rect width="1200" height="${y + 30}" fill="#000000"/>
    <text x="50" y="45" fill="#ffffff" font-size="28" font-weight="600">Skills &amp; Tools</text>
    ${badges}
</svg>`;
}"""

content = re.sub(r'async function generateSkills\(\).*?return `<svg[^>]*>.*?</svg>`;\n}', new_skills_func, content, flags=re.DOTALL)

with open('svgBuilder.js', 'w', encoding='utf-8') as f:
    f.write(content)
