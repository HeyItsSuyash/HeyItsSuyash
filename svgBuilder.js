const axios = require('axios');

async function getBase64Image(url) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const base64 = Buffer.from(response.data, 'binary').toString('base64');
        const mimeType = url.includes('.svg') ? 'image/svg+xml' : 'image/png';
        return `data:${mimeType};base64,${base64}`;
    } catch (e) {
        return ''; 
    }
}

const COMMON_DEFS = `
    <defs>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;500;600;700&amp;display=swap');
            text { font-family: 'Fredoka', sans-serif; }
            @keyframes breathe { 0% { transform: scale(1); } 50% { transform: scale(1.02); } 100% { transform: scale(1); } }
            .animated-avatar { transform-origin: center bottom; animation: breathe 5s ease-in-out infinite; }
            @keyframes type { from { width: 0; } to { width: 900px; } }
            .typing-mask rect { animation: type 4s steps(60, end) forwards; }
        </style>
        <filter id="clay-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="8" dy="8" stdDeviation="10" flood-color="#052d1e" flood-opacity="0.4"/>
            <feDropShadow dx="-4" dy="-4" stdDeviation="6" flood-color="#197d5a" flood-opacity="0.2"/>
        </filter>
        <linearGradient id="nav-bg" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#a2d9c0"/>
            <stop offset="100%" stop-color="#c8e6d7"/>
        </linearGradient>
    </defs>
`;

async function generateHero() {
    const avatarB64 = await getBase64Image("https://www.suyashshukla.com/_next/image?url=%2Fimages%2Fhero-avatar%2Fmain.png&w=2048&q=75");
    const logoB64 = await getBase64Image("https://www.suyashshukla.com/_next/image?url=%2Fimages%2Fother-illustrations%2Flogo.png&w=96&q=75");

    return `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="450" viewBox="0 0 1200 450">
    ${COMMON_DEFS}
    <rect width="1200" height="450" fill="#000000"/>
    <text x="600" y="250" text-anchor="middle" fill="rgba(255,255,255,0.03)" font-size="280" font-weight="700" letter-spacing="15">SUYASH</text>
    
    <!-- Navbar (Static Visuals) -->
    <g transform="translate(50, 40)">
        <rect width="1100" height="60" rx="30" fill="url(#nav-bg)"/>
        <image href="${logoB64}" x="20" y="15" width="30" height="30" />
        <text x="300" y="35" fill="#0f4f37" font-size="16" font-weight="600">HeyItsSuyash GitHub</text>
    </g>

    <g transform="translate(50, 180)">
        <text x="0" y="50" fill="#ffffff" font-size="70" font-weight="700">Suyash</text>
        <text x="0" y="80" fill="#FFD700" font-size="18" font-style="italic">/su:jaʃ/ (proper noun)</text>
        <text x="0" y="130" fill="#ffffff" font-size="20">A builder at heart.</text>
        <text x="0" y="160" fill="#ffffff" font-size="20">Turning ideas into digital ecosystems.</text>
    </g>

    <!-- Avatar -->
    <g class="animated-avatar" transform="translate(600, 200)">
        <image href="${avatarB64}" x="-200" y="-80" width="400" height="400"/>
    </g>

    <!-- Right Side Info -->
    <g transform="translate(900, 150)">
        <rect width="250" height="250" rx="20" fill="#000000" stroke="rgba(255,215,0,0.3)" filter="url(#clay-shadow)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
        <text x="25" y="45" fill="#ffffff" font-size="18" font-weight="600">Location</text>
        <text x="25" y="70" fill="#dddddd" font-size="16">India 📍</text>
        <text x="25" y="115" fill="#ffffff" font-size="18" font-weight="600">Focus</text>
        <text x="25" y="140" fill="#dddddd" font-size="16">AI • Automation</text>
        <text x="25" y="205" fill="#ffffff" font-size="18" font-weight="600">Currently</text>
        <text x="25" y="230" fill="#dddddd" font-size="16">Building &amp; Shipping</text>
    </g>
</svg>`;
}

async function generateAbout() {
    const logoB64 = await getBase64Image("https://www.suyashshukla.com/_next/image?url=%2Fimages%2Fother-illustrations%2Flogo.png&w=96&q=75");
    return `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="220" viewBox="0 0 1200 220">
    ${COMMON_DEFS}
    <clipPath id="typing-clip">
        <rect x="0" y="0" width="0" height="150" class="typing-mask">
            <animate attributeName="width" from="0" to="900" dur="4s" fill="freeze" />
        </rect>
    </clipPath>
    <rect width="1200" height="220" fill="#000000"/>
    <g transform="translate(50, 20)">
        <rect width="1100" height="180" rx="20" fill="#000000" stroke="rgba(255,215,0,0.3)" filter="url(#clay-shadow)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
        <circle cx="60" cy="60" r="30" fill="rgba(255,255,255,0.1)"/>
        <image href="${logoB64}" x="40" y="40" width="40" height="40" />
        <text x="120" y="65" fill="#ffffff" font-size="28" font-weight="600">About Me</text>
        <g clip-path="url(#typing-clip)" transform="translate(120, 105)">
            <text x="0" y="0" fill="#dddddd" font-size="18">I'm a Computer Science student at MMMUT and a Data Science student at IIT Madras.</text>
            <text x="0" y="30" fill="#dddddd" font-size="18">My journey is driven by curiosity, consistency, and the belief that technology empowers people.</text>
        </g>
    </g>
</svg>`;
}

async function generateSocial(platform) {
    const config = {
        github: { color: "#181717", name: "GitHub", url: "https://github.com/HeyItsSuyash", text: "Follow me" },
        linkedin: { color: "#0A66C2", name: "LinkedIn", url: "https://linkedin.com/in/HeyItsSuyash", text: "Connect" },
        twitter: { color: "#000000", name: "X", url: "https://x.com/HeyItsSuyash", text: "Updates" },
        portfolio: { color: "#0f4f37", name: "Portfolio", url: "https://suyashshukla.com", text: "My Work" }
    };
    const c = config[platform] || config.github;
    return `
<svg xmlns="http://www.w3.org/2000/svg" width="285" height="100" viewBox="0 0 285 100">
    ${COMMON_DEFS}
    <rect width="285" height="100" fill="#000000"/>
    <g transform="translate(10, 10)">
        <rect width="265" height="80" rx="15" fill="#000000" stroke="rgba(255,215,0,0.3)" filter="url(#clay-shadow)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
        <rect x="20" y="20" width="40" height="40" rx="20" fill="${c.color}"/>
        <text x="75" y="40" fill="#ffffff" font-size="18" font-weight="600">${c.name}</text>
        <text x="75" y="60" fill="#dddddd" font-size="14">${c.text}</text>
    </g>
</svg>`;
}

async function generateProjectCard(repo) {
    if (!repo) return `<svg width="380" height="160"></svg>`;
    return `
<svg xmlns="http://www.w3.org/2000/svg" width="380" height="160" viewBox="0 0 380 160">
    ${COMMON_DEFS}
    <rect width="380" height="160" fill="#000000"/>
    <g transform="translate(15, 15)">
        <rect width="350" height="130" rx="15" fill="#000000" stroke="rgba(255,215,0,0.3)" stroke="rgba(255,255,255,0.1)" stroke-width="1" filter="url(#clay-shadow)"/>
        <text x="20" y="35" fill="#ffffff" font-size="18" font-weight="600">${(repo.name || '').substring(0, 25)}</text>
        <text x="20" y="65" fill="#dddddd" font-size="14">${(repo.description || '').substring(0, 40)}...</text>
        <rect x="20" y="85" width="80" height="25" rx="12" fill="rgba(0,0,0,0.2)" />
        <text x="35" y="102" fill="#FFD700" font-size="12">${repo.language || 'Code'}</text>
        <rect x="110" y="85" width="60" height="25" rx="12" fill="rgba(0,0,0,0.2)" />
        <text x="125" y="102" fill="#FFD700" font-size="12">⭐ ${repo.stargazers_count}</text>
    </g>
</svg>`;
}

async function generateStats(stats) {
    return `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="300" viewBox="0 0 1200 300">
    ${COMMON_DEFS}
    <rect width="1200" height="300" fill="#000000"/>
    
    <g transform="translate(50, 20)">
        <rect x="0" y="0" width="350" height="250" rx="20" fill="#000000" stroke="rgba(255,215,0,0.3)" filter="url(#clay-shadow)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
        <text x="25" y="45" fill="#ffffff" font-size="22" font-weight="600">GitHub Stats</text>
        <text x="25" y="90" fill="#dddddd" font-size="18">Repositories</text>
        <text x="320" y="90" fill="#ffffff" font-size="18" font-weight="600" text-anchor="end">${stats.repos}</text>
        <text x="25" y="130" fill="#dddddd" font-size="18">Followers</text>
        <text x="320" y="130" fill="#ffffff" font-size="18" font-weight="600" text-anchor="end">${stats.followers}</text>
        <text x="25" y="170" fill="#dddddd" font-size="18">Stars Earned</text>
        <text x="320" y="170" fill="#ffffff" font-size="18" font-weight="600" text-anchor="end">${stats.stars}+</text>
        <text x="25" y="210" fill="#dddddd" font-size="18">Contributions</text>
        <text x="320" y="210" fill="#ffffff" font-size="18" font-weight="600" text-anchor="end">${stats.contributions}+</text>
        
        <rect x="380" y="0" width="720" height="250" rx="20" fill="#000000" stroke="rgba(255,215,0,0.3)" filter="url(#clay-shadow)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
        <text x="405" y="45" fill="#ffffff" font-size="22" font-weight="600">Top Languages</text>
        <circle cx="480" cy="140" r="50" fill="transparent" stroke="#3178c6" stroke-width="25" stroke-dasharray="100 214" />
        <circle cx="480" cy="140" r="50" fill="transparent" stroke="#f1e05a" stroke-width="25" stroke-dasharray="80 234" stroke-dashoffset="-100" />
        <circle cx="480" cy="140" r="50" fill="transparent" stroke="#3572A5" stroke-width="25" stroke-dasharray="50 264" stroke-dashoffset="-180" />
        
        <circle cx="600" cy="110" r="6" fill="#3178c6"/>
        <text x="620" y="115" fill="#dddddd" font-size="16">TypeScript</text>
        <text x="730" y="115" fill="#ffffff" font-size="16" font-weight="600">33%</text>

        <circle cx="600" cy="150" r="6" fill="#f1e05a"/>
        <text x="620" y="155" fill="#dddddd" font-size="16">JavaScript</text>
        <text x="730" y="155" fill="#ffffff" font-size="16" font-weight="600">23%</text>

        <circle cx="600" cy="190" r="6" fill="#3572A5"/>
        <text x="620" y="195" fill="#dddddd" font-size="16">Python</text>
        <text x="730" y="195" fill="#ffffff" font-size="16" font-weight="600">18%</text>
    </g>
</svg>`;
}


async function generateSkills() {
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
    let x = 50;
    let y = 80;
    const badgeWidth = 140;
    const badgeHeight = 40;
    const paddingX = 15;
    const paddingY = 15;

    for (let i = 0; i < skills.length; i++) {
        const skill = skills[i];
        const b64 = await getBase64Image(skill.icon);
        badges += `
        <g transform="translate(${x}, ${y})">
            <rect width="130" height="36" rx="18" fill="#111111" stroke="rgba(255,215,0,0.3)" stroke-width="1"/>
            <image href="${b64}" x="12" y="8" width="20" height="20"/>
            <text x="40" y="24" fill="#dddddd" font-size="14" font-weight="500">${skill.name}</text>
        </g>`;
        x += badgeWidth + paddingX;
        if (x > 1050) {
            x = 50;
            y += badgeHeight + paddingY;
        }
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${y + 80}" viewBox="0 0 1200 ${y + 80}">
    ${COMMON_DEFS}
    <rect width="1200" height="${y + 80}" fill="#000000"/>
    <text x="50" y="45" fill="#ffffff" font-size="24" font-weight="600">Skills &amp; Tools</text>
    ${badges}
</svg>`;
}

module.exports = { generateSkills,  generateHero, generateAbout, generateSocial, generateProjectCard, generateStats };
