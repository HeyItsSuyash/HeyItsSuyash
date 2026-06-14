const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function getBase64Image(url) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const base64 = Buffer.from(response.data, 'binary').toString('base64');
        const mimeType = url.includes('.svg') || url.includes('simpleicons.org') ? 'image/svg+xml' : 'image/png';
        return `data:${mimeType};base64,${base64}`;
    } catch (e) {
        return ''; 
    }
}

const COMMON_DEFS = `
    <defs>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&amp;display=swap');
            text { font-family: 'Space Grotesk', sans-serif; }
            @keyframes breathe { 0% { transform: scale(1); } 50% { transform: scale(1.02); } 100% { transform: scale(1); } }
            .animated-avatar { transform-origin: center bottom; animation: breathe 5s ease-in-out infinite; }
            @keyframes type { from { width: 0; } to { width: 900px; } }
            .typing-mask rect { animation: type 4s steps(60, end) forwards; }
        </style>
        <filter id="clay-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
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
    <rect width="1200" height="450" fill="#000000"/ rx="15">
    <text x="600" y="250" text-anchor="middle" fill="rgba(255,255,255,0.03)" font-size="280" font-weight="700" letter-spacing="15">SUYASH</text>
    
    <!-- Navbar (Static Visuals) -->
    <g transform="translate(50, 40)">
        <rect width="1100" height="60"  fill="url(#nav-bg)"/>
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
        <rect width="250" height="250"  fill="#000000" stroke="rgba(255,215,0,0.3)"  stroke-width="1"/ rx="15">
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
    <rect width="1200" height="220" fill="#000000"/ rx="15">
    <g transform="translate(50, 20)">
        <rect width="1100" height="180"  fill="#000000" stroke="rgba(255,215,0,0.3)"  stroke-width="1"/ rx="15">
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
        github: { file: "GitHub-Logo.wine.png", color: "181717", name: "GitHub", text: "Follow me" },
        codolio: { file: "codolio.jpg", color: "FF5722", name: "Codolio", text: "Coding Stats" },
        stackoverflow: { file: "stackoverflow.png", color: "F58025", name: "StackOverflow", text: "Reputation" },
        kaggle: { file: "kaggle.png", color: "20BEFF", name: "Kaggle", text: "Notebooks" },
        googledev: { file: "gdev.png", color: "4285F4", name: "Google Dev", text: "Profile" },
        discord: { file: "discord.png", color: "5865F2", name: "Discord", text: "Connect" },
        unstop: { file: "unstop.png", color: "0073E6", name: "Unstop", text: "Competitions" },
        devpost: { file: "devpost.jpg", color: "00B3E6", name: "Devpost", text: "Hackathons" }
    };
    const c = config[platform] || config.github;
    
    let iconB64 = "";
    try {
        const filePath = path.join(__dirname, 'social-icons', c.file);
        if (fs.existsSync(filePath)) {
            const fileData = fs.readFileSync(filePath);
            const mimeType = c.file.endsWith('.jpg') ? 'image/jpeg' : 'image/png';
            iconB64 = `data:${mimeType};base64,${fileData.toString('base64')}`;
        }
    } catch(e) {
        console.error("Failed to read local icon", e);
    }

    const imageTag = iconB64 
        ? `<image href="${iconB64}" x="20" y="20" width="40" height="40" preserveAspectRatio="xMidYMid meet" />`
        : `<rect x="20" y="20" width="40" height="40" fill="#${c.color}"/>`;

    return `
<svg xmlns="http://www.w3.org/2000/svg" width="285" height="100" viewBox="0 0 285 100">
    ${COMMON_DEFS}
    <rect width="285" height="100" fill="#000000"/ rx="15">
    <g transform="translate(10, 10)">
        <rect width="265" height="80"  fill="#000000" stroke="rgba(255,215,0,0.3)"  stroke-width="1"/ rx="15">
        ${imageTag}
        <text x="75" y="40" fill="#ffffff" font-size="18" font-weight="600">${c.name}</text>
        <text x="75" y="60" fill="#dddddd" font-size="14">${c.text}</text>
    </g>
</svg>`;
}



function escapeXml(unsafe) {
    if (!unsafe) return '';
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}

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
        return `<svg xmlns="http://www.w3.org/2000/svg" width="414" height="200" viewBox="0 0 414 200"><rect width="414" height="200" fill="#000000"/ rx="15"></svg>`;
    }
    const langColor = { "JavaScript": "#f1e05a", "Python": "#3572A5", "TypeScript": "#3178c6", "HTML": "#e34c26" };
    const color = repo.language ? (langColor[repo.language] || "#cccccc") : "#cccccc";
    
    const lines = wrapText(escapeXml(repo.readme_snippet), 45).slice(0, 3); // Max 3 lines
    const textTspans = lines.map((l, i) => `<tspan x="20" dy="${i === 0 ? 0 : 20}">${l}</tspan>`).join('');

    return `
<svg xmlns="http://www.w3.org/2000/svg" width="414" height="200" viewBox="0 0 414 200">
    ${COMMON_DEFS}
    <rect width="414" height="200" fill="#000000"/ rx="15">
    <g transform="translate(10, 10)">
        <rect width="394" height="180" fill="#000000" stroke="#FFD700" stroke-width="1"/ rx="15">
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


async function generateStats(stats) {
    return `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="300" viewBox="0 0 1200 300">
    ${COMMON_DEFS}
    <rect width="1200" height="300" fill="#000000"/ rx="15">
    
    <g transform="translate(50, 20)">
        <rect x="0" y="0" width="350" height="250"  fill="#000000" stroke="rgba(255,215,0,0.3)"  stroke-width="1"/ rx="15">
        <text x="25" y="45" fill="#ffffff" font-size="22" font-weight="600">GitHub Stats</text>
        <text x="25" y="90" fill="#dddddd" font-size="18">Repositories</text>
        <text x="320" y="90" fill="#ffffff" font-size="18" font-weight="600" text-anchor="end">${stats.repos}</text>
        <text x="25" y="130" fill="#dddddd" font-size="18">Followers</text>
        <text x="320" y="130" fill="#ffffff" font-size="18" font-weight="600" text-anchor="end">${stats.followers}</text>
        <text x="25" y="170" fill="#dddddd" font-size="18">Stars Earned</text>
        <text x="320" y="170" fill="#ffffff" font-size="18" font-weight="600" text-anchor="end">${stats.stars}+</text>
        <text x="25" y="210" fill="#dddddd" font-size="18">Contributions</text>
        <text x="320" y="210" fill="#ffffff" font-size="18" font-weight="600" text-anchor="end">${stats.contributions}+</text>
        
        <rect x="380" y="0" width="720" height="250"  fill="#000000" stroke="rgba(255,215,0,0.3)"  stroke-width="1"/ rx="15">
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
        { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
        { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
        { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
        { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
        { name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
        { name: 'SQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
        { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
        { name: 'Express.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
        { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
        { name: 'Astro', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/astro/astro-original.svg' },
        { name: 'Socket.IO', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg' },
        { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
        { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
        { name: 'TensorFlow', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg' },
        { name: 'PyTorch', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg' },
        { name: 'FastAPI', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg' },
        { name: 'Pandas', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg' },
        { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
        { name: 'Figma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
        { name: 'Blender', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blender/blender-original.svg' },
        { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
        { name: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
        { name: 'Linux', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg' },
        { name: 'Vercel', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg' },
        { name: 'Nginx', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg' },
        { name: 'Cloudflare', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cloudflare/cloudflare-original.svg' },
        { name: 'Canva', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg' },
        { name: 'Kaggle', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kaggle/kaggle-original.svg' },
        { name: 'Rust', icon: 'https://cdn.simpleicons.org/rust/ffffff' },
        { name: 'n8n', icon: 'https://cdn.simpleicons.org/n8n/EA4B71' }
    ];

    // Fetch all images concurrently to prevent GitHub Camo timeout (4 seconds)
    const skillsWithB64 = await Promise.all(skills.map(async skill => {
        return { ...skill, b64: await getBase64Image(skill.icon) };
    }));

    let badges = '';
    const badgeWidth = 180;
    const badgeHeight = 55;
    const paddingX = 15;
    const paddingY = 15;
    
    // Calculate rows
    const itemsPerRow = 6;
    let y = 80;
    
    for (let i = 0; i < skillsWithB64.length; i += itemsPerRow) {
        const rowItems = skillsWithB64.slice(i, i + itemsPerRow);
        const rowWidth = rowItems.length * badgeWidth + (rowItems.length - 1) * paddingX;
        let x = (1200 - rowWidth) / 2; // center the row
        
        for (let j = 0; j < rowItems.length; j++) {
            const skill = rowItems[j];
            badges += `
        <g transform="translate(${x}, ${y})">
            <rect width="180" height="55"  fill="#111111" stroke="rgba(255,215,0,0.3)" stroke-width="1" />
            <image href="${skill.b64}" x="20" y="13" width="30" height="30"/>
            <text x="60" y="34" fill="#dddddd" font-size="18" font-weight="500">${skill.name}</text>
        </g>`;
            x += badgeWidth + paddingX;
        }
        y += badgeHeight + paddingY;
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${y + 30}" viewBox="0 0 1200 ${y + 30}">
    ${COMMON_DEFS}
    <rect width="1200" height="${y + 30}" fill="#000000"/ rx="15">
    <text x="50" y="45" fill="#ffffff" font-size="28" font-weight="600">Skills &amp; Tools</text>
    ${badges}
</svg>`;
}



async function generateViewAllCard() {
    return `
<svg xmlns="http://www.w3.org/2000/svg" width="828" height="50" viewBox="0 0 828 50">
    <rect width="828" height="50" fill="#FFD700" rx="25" />
    <text x="414" y="32" fill="#000000" font-size="22" font-family="'Space Grotesk', sans-serif" font-weight="700" text-anchor="middle">View All Repositories</text>
</svg>`;
}


module.exports = { generateViewAllCard,  generateSkills,  generateHero, generateAbout, generateSocial, generateProjectCard, generateStats };
