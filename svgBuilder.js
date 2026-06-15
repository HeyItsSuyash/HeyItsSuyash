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
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;800;900&amp;display=swap');
            text { font-family: 'Montserrat', sans-serif; }
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
    <rect width="1200" height="450" fill="#000000" stroke="rgba(255,215,0,0.3)" stroke-width="2" rx="0" />
    <text x="600" y="250" text-anchor="middle" fill="rgba(255,255,255,0.03)" font-size="280" font-weight="700" letter-spacing="15">SUYASH</text>
    
    <!-- Navbar (Static Visuals) -->
    <g transform="translate(50, 40)">
        <rect width="1100" height="60"  fill="url(#nav-bg)"/>
        <image href="${logoB64}" x="20" y="15" width="30" height="30" />
        <text x="300" y="35" fill="#0f4f37" font-size="16" font-weight="600">HeyItsSuyash GitHub</text>
    </g>

    <g transform="translate(50, 180)">
        <text x="0" y="50" fill="#ffffff" font-size="90" font-weight="700">Suyash</text>
        <text x="0" y="90" fill="#FFD700" font-size="24" font-style="italic">/su:jaʃ/ (proper noun)</text>
        <text x="0" y="150" fill="#ffffff" font-size="28">A builder at heart.</text>
        <text x="0" y="190" fill="#ffffff" font-size="28">Turning ideas into digital ecosystems.</text>
    </g>

    <!-- Avatar -->
    <g class="animated-avatar" transform="translate(600, 200)">
        <image href="${avatarB64}" x="-200" y="-80" width="400" height="400"/>
    </g>

    <!-- Right Side Info -->
    <g transform="translate(900, 150)">
        <rect width="250" height="250"  fill="#000000" stroke="rgba(255,215,0,0.3)"  stroke-width="1" rx="0" />
        <text x="25" y="45" fill="#ffffff" font-size="24" font-weight="600">Location</text>
        <text x="25" y="75" fill="#dddddd" font-size="20">India 📍</text>
        <text x="25" y="125" fill="#ffffff" font-size="24" font-weight="600">Focus</text>
        <text x="25" y="155" fill="#dddddd" font-size="20">AI • Automation</text>
        <text x="25" y="205" fill="#ffffff" font-size="24" font-weight="600">Currently</text>
        <text x="25" y="235" fill="#dddddd" font-size="20">Building &amp; Shipping</text>
    </g>
</svg>`;
}

async function generateAbout() {
    const logoB64 = await getBase64Image("https://www.suyashshukla.com/_next/image?url=%2Fimages%2Fother-illustrations%2Flogo.png&w=96&q=75");
    return `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="280" viewBox="0 0 1200 280">
    ${COMMON_DEFS}
    <clipPath id="typing-clip">
        <rect x="0" y="0" width="0" height="150" class="typing-mask">
            <animate attributeName="width" from="0" to="1100" dur="4s" fill="freeze" />
        </rect>
    </clipPath>
    <rect width="1200" height="280" fill="#000000" stroke="rgba(255,215,0,0.3)" stroke-width="2" rx="0" />
    <g transform="translate(50, 30)">
        <circle cx="75" cy="75" r="40" fill="rgba(255,255,255,0.1)"/>
        <image href="${logoB64}" x="50" y="50" width="50" height="50" />
        <text x="140" y="85" fill="#ffffff" font-size="36" font-weight="600">About Me</text>
        <g clip-path="url(#typing-clip)" transform="translate(140, 135)">
            <text x="0" y="0" fill="#dddddd" font-size="24">I'm a Computer Science student at MMMUT and a Data Science student at IIT Madras.</text>
            <text x="0" y="40" fill="#dddddd" font-size="24">My journey is driven by curiosity, consistency, and the belief that technology empowers people.</text>
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
        ? `<image href="${iconB64}" x="30" y="30" width="60" height="60" preserveAspectRatio="xMidYMid meet" />`
        : `<rect x="30" y="30" width="60" height="60" fill="#${c.color}"/>`;

    return `
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="120" viewBox="0 0 300 120">
    ${COMMON_DEFS}
    <rect width="300" height="120" fill="#000000" stroke="rgba(255,215,0,0.3)" stroke-width="2" rx="0" />
    ${imageTag}
    <text x="100" y="55" fill="#ffffff" font-size="22" font-weight="600">${c.name}</text>
    <text x="100" y="80" fill="#dddddd" font-size="18">${c.text}</text>
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
        return `<svg xmlns="http://www.w3.org/2000/svg" width="414" height="200" viewBox="0 0 414 200"><rect width="414" height="200" fill="#000000" rx="0" /></svg>`;
    }
    const langColor = { "JavaScript": "#f1e05a", "Python": "#3572A5", "TypeScript": "#3178c6", "HTML": "#e34c26" };
    const color = repo.language ? (langColor[repo.language] || "#cccccc") : "#cccccc";
    
    const lines = wrapText(escapeXml(repo.readme_snippet), 30).slice(0, 5); // Max 5 lines
    const textTspans = lines.map((l, i) => `<tspan x="25" dy="${i === 0 ? 0 : 40}">${l}</tspan>`).join('');

    return `
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750">
    ${COMMON_DEFS}
    <rect width="600" height="750" fill="#000000" stroke="rgba(255,215,0,0.3)" stroke-width="2" rx="0" />
    <g transform="translate(15, 10)">
        <text x="25" y="80" fill="#ffffff" font-size="40" font-weight="800">${repo.name}</text>
        
        <text x="25" y="150" fill="#aaaaaa" font-size="28" font-family="'Montserrat', sans-serif">
            ${textTspans}
        </text>

        <circle cx="25" cy="700" r="12" fill="${color}"/>
        <text x="45" y="708" fill="#dddddd" font-size="24" font-weight="600">${repo.language || "Code"}</text>
        <text x="180" y="708" fill="#FFD700" font-size="24" font-weight="800">★ ${repo.stargazers_count}</text>
    </g>
</svg>`;
}


async function generateStats(stats) {
    return `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="400" viewBox="0 0 1200 400">
    ${COMMON_DEFS}
    <rect width="1200" height="400" fill="#000000" stroke="rgba(255,215,0,0.3)" stroke-width="2" rx="0" />
    
    <g transform="translate(50, 40)">
        <text x="25" y="45" fill="#ffffff" font-size="32" font-weight="600">GitHub Stats</text>
        <text x="25" y="100" fill="#dddddd" font-size="24">Repositories</text>
        <text x="360" y="100" fill="#ffffff" font-size="24" font-weight="600" text-anchor="end">${stats.repos}</text>
        <text x="25" y="140" fill="#dddddd" font-size="24">Followers</text>
        <text x="360" y="140" fill="#ffffff" font-size="24" font-weight="600" text-anchor="end">${stats.followers}</text>
        <text x="25" y="180" fill="#dddddd" font-size="24">Stars Earned</text>
        <text x="360" y="180" fill="#ffffff" font-size="24" font-weight="600" text-anchor="end">${stats.stars}+</text>
        <text x="25" y="220" fill="#dddddd" font-size="24">Contributions</text>
        <text x="360" y="220" fill="#ffffff" font-size="24" font-weight="600" text-anchor="end">${stats.contributions}+</text>
        <text x="25" y="260" fill="#dddddd" font-size="24">Pull Requests</text>
        <text x="360" y="260" fill="#ffffff" font-size="24" font-weight="600" text-anchor="end">${stats.prs}</text>
        <text x="25" y="300" fill="#dddddd" font-size="24">Issues</text>
        <text x="360" y="300" fill="#ffffff" font-size="24" font-weight="600" text-anchor="end">${stats.issues}</text>
        <text x="450" y="45" fill="#ffffff" font-size="32" font-weight="600">Top Languages</text>
        <circle cx="560" cy="180" r="75" fill="transparent" stroke="#3178c6" stroke-width="40" stroke-dasharray="250 471" />
        <circle cx="560" cy="180" r="75" fill="transparent" stroke="#f1e05a" stroke-width="40" stroke-dasharray="150 471" stroke-dashoffset="-250" />
        <circle cx="560" cy="180" r="75" fill="transparent" stroke="#3572A5" stroke-width="40" stroke-dasharray="71 471" stroke-dashoffset="-400" />
        
        <circle cx="750" cy="140" r="10" fill="#3178c6"/>
        <text x="780" y="148" fill="#dddddd" font-size="24">TypeScript</text>
        <text x="940" y="148" fill="#ffffff" font-size="24" font-weight="600">33%</text>

        <circle cx="750" cy="190" r="10" fill="#f1e05a"/>
        <text x="780" y="198" fill="#dddddd" font-size="24">JavaScript</text>
        <text x="940" y="198" fill="#ffffff" font-size="24" font-weight="600">23%</text>

        <circle cx="750" cy="240" r="10" fill="#3572A5"/>
        <text x="780" y="248" fill="#dddddd" font-size="24">Python</text>
        <text x="940" y="248" fill="#ffffff" font-size="24" font-weight="600">18%</text>
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
    const badgeWidth = 220;
    const badgeHeight = 70;
    const paddingX = 15;
    const paddingY = 15;
    
    // Calculate rows
    const itemsPerRow = 5;
    let y = 100;
    
    for (let i = 0; i < skillsWithB64.length; i += itemsPerRow) {
        const rowItems = skillsWithB64.slice(i, i + itemsPerRow);
        const rowWidth = rowItems.length * badgeWidth + (rowItems.length - 1) * paddingX;
        let x = (1200 - rowWidth) / 2; // center the row
        
        for (let j = 0; j < rowItems.length; j++) {
            const skill = rowItems[j];
            let imageTag = '';
            if (skill.b64) {
                imageTag = `<image href="${skill.b64}" x="25" y="15" width="40" height="40"/>`;
            }
            badges += `
        <g transform="translate(${x}, ${y})">
            <rect width="220" height="70"  fill="#111111" stroke="rgba(255,215,0,0.3)" stroke-width="1" rx="0" />
            ${imageTag}
            <text x="80" y="44" fill="#dddddd" font-size="24" font-weight="500">${skill.name}</text>
        </g>`;
            x += badgeWidth + paddingX;
        }
        y += badgeHeight + paddingY;
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${y + 30}" viewBox="0 0 1200 ${y + 30}">
    ${COMMON_DEFS}
    <rect width="1200" height="${y + 30}" fill="#000000" stroke="rgba(255,215,0,0.3)" stroke-width="2" rx="0" />
    <text x="50" y="60" fill="#ffffff" font-size="36" font-weight="600">Skills &amp; Tools</text>
    ${badges}
</svg>`;
}



async function generateViewAllCard() {
    return `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="100" viewBox="0 0 1200 100">
    <rect width="1200" height="100" fill="#000000" rx="0" />
    <text x="600" y="60" fill="#FFD700" font-size="32" font-family="'Montserrat', sans-serif" font-weight="800" text-anchor="middle">View All Repositories</text>
</svg>`;
}


module.exports = { generateViewAllCard,  generateSkills,  generateHero, generateAbout, generateSocial, generateProjectCard, generateStats };
