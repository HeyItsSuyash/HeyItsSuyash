const axios = require('axios');

// Helper to convert URLs to Base64 so they embed correctly in GitHub READMEs
async function getBase64Image(url) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const base64 = Buffer.from(response.data, 'binary').toString('base64');
        const mimeType = url.includes('.svg') ? 'image/svg+xml' : 'image/png';
        return `data:${mimeType};base64,${base64}`;
    } catch (e) {
        console.error(`Failed to fetch image: ${url}`);
        return ''; 
    }
}

// Generate the complete Native SVG
async function generateSVG(profile, repos, stats) {
    // 1. Fetch images as Base64 to bypass GitHub camo restrictions
    const avatarB64 = await getBase64Image("https://www.suyashshukla.com/_next/image?url=%2Fimages%2Fhero-avatar%2Fmain.png&w=2048&q=75");
    const logoB64 = await getBase64Image("https://www.suyashshukla.com/_next/image?url=%2Fimages%2Fother-illustrations%2Flogo.png&w=96&q=75");
    
    // 2. Generate Eco Cards dynamically with absolute coordinates
    let ecoCardsSVG = '';
    const startX = 50;
    let currentX = startX;
    let currentY = 820; // Y offset for projects section

    repos.forEach((repo, i) => {
        if (i % 3 === 0 && i !== 0) {
            currentX = startX;
            currentY += 150; // Next row
        }
        
        ecoCardsSVG += `
            <g transform="translate(${currentX}, ${currentY})">
                <rect width="350" height="130" rx="15" fill="rgba(18, 97, 72, 0.6)" stroke="rgba(255,255,255,0.1)" stroke-width="1" filter="url(#clay-shadow)"/>
                <text x="20" y="35" fill="#ffffff" font-size="18" font-family="Fredoka, sans-serif" font-weight="600">${repo.name}</text>
                <text x="20" y="65" fill="#bce0cf" font-size="14" font-family="Fredoka, sans-serif">${(repo.description || '').substring(0, 40)}...</text>
                
                <rect x="20" y="85" width="80" height="25" rx="12" fill="rgba(0,0,0,0.2)" />
                <text x="35" y="102" fill="#8cc3a9" font-size="12" font-family="Fredoka, sans-serif">${repo.language || 'Code'}</text>
                
                <rect x="110" y="85" width="60" height="25" rx="12" fill="rgba(0,0,0,0.2)" />
                <text x="125" y="102" fill="#8cc3a9" font-size="12" font-family="Fredoka, sans-serif">⭐ ${repo.stargazers_count}</text>
            </g>
        `;
        currentX += 370;
    });

    return `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1700" viewBox="0 0 1200 1700">
    <defs>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;500;600;700&amp;display=swap');
            
            text {
                font-family: 'Fredoka', sans-serif;
            }
            
            @keyframes breathe {
                0% { transform: scale(1); }
                50% { transform: scale(1.02); }
                100% { transform: scale(1); }
            }
            
            .animated-avatar {
                transform-origin: 600px 700px;
                animation: breathe 5s ease-in-out infinite;
            }

            @keyframes type {
                from { width: 0; }
                to { width: 900px; }
            }

            .typing-mask rect {
                animation: type 4s steps(60, end) forwards;
            }
        </style>

        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#0a563d"/>
            <stop offset="100%" stop-color="#0f6247"/>
        </linearGradient>

        <linearGradient id="nav-bg" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#a2d9c0"/>
            <stop offset="100%" stop-color="#c8e6d7"/>
        </linearGradient>

        <filter id="clay-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="8" dy="8" stdDeviation="10" flood-color="#052d1e" flood-opacity="0.4"/>
            <feDropShadow dx="-4" dy="-4" stdDeviation="6" flood-color="#197d5a" flood-opacity="0.2"/>
        </filter>

        <!-- Mask for typing animation effect -->
        <clipPath id="typing-clip">
            <rect x="150" y="550" width="0" height="150" class="typing-mask">
                <animate attributeName="width" from="0" to="900" dur="4s" fill="freeze" />
            </rect>
        </clipPath>
    </defs>

    <!-- Background -->
    <rect width="1200" height="1700" fill="url(#bg)"/>

    <!-- Background Giant Text -->
    <text x="600" y="200" text-anchor="middle" fill="rgba(255,255,255,0.03)" font-size="280" font-weight="700" letter-spacing="15">SUYASH</text>

    <!-- Navbar -->
    <g transform="translate(50, 40)">
        <rect width="1100" height="60" rx="30" fill="url(#nav-bg)" filter="drop-shadow(0 10px 20px rgba(0,0,0,0.15))"/>
        <image href="${logoB64}" x="20" y="15" width="30" height="30" />
        
        <text x="300" y="35" fill="#0f4f37" font-size="16" font-weight="600">Portfolio</text>
        <text x="400" y="35" fill="#0f4f37" font-size="16" font-weight="600">Codilio</text>
        <text x="500" y="35" fill="#0f4f37" font-size="16" font-weight="600">LinkedIn</text>
        <text x="610" y="35" fill="#0f4f37" font-size="16" font-weight="600">ProductHunt</text>
        
        <rect x="940" y="10" width="140" height="40" rx="20" fill="#0f4f37" />
        <text x="980" y="35" fill="#ffffff" font-size="16" font-weight="600">Project</text>
    </g>

    <!-- Hero Left -->
    <g transform="translate(50, 200)">
        <text x="0" y="50" fill="#ffffff" font-size="70" font-weight="700">Suyash</text>
        <text x="0" y="80" fill="#8cc3a9" font-size="18" font-style="italic">/su:jaʃ/ (proper noun)</text>
        
        <text x="0" y="130" fill="#ffffff" font-size="20">A builder at heart.</text>
        <text x="0" y="160" fill="#ffffff" font-size="20">Turning ideas into digital ecosystems</text>
        <text x="0" y="190" fill="#ffffff" font-size="20">that create real impact.</text>
    </g>

    <!-- Hero Right (Location / Focus) -->
    <g transform="translate(900, 200)">
        <rect width="250" height="250" rx="20" fill="rgba(18, 97, 72, 0.5)" filter="url(#clay-shadow)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
        
        <text x="25" y="45" fill="#ffffff" font-size="18" font-weight="600">Location</text>
        <text x="25" y="70" fill="#bce0cf" font-size="16">India 📍</text>
        
        <text x="25" y="115" fill="#ffffff" font-size="18" font-weight="600">Focus</text>
        <text x="25" y="140" fill="#bce0cf" font-size="16">AI • Automation</text>
        <text x="25" y="160" fill="#bce0cf" font-size="16">Product • Design</text>

        <text x="25" y="205" fill="#ffffff" font-size="18" font-weight="600">Currently</text>
        <text x="25" y="230" fill="#bce0cf" font-size="16">Building &amp; Shipping</text>
    </g>

    <!-- Hero Avatar with pure CSS Breathe Animation -->
    <g class="animated-avatar">
        <image href="${avatarB64}" x="350" y="150" width="500" height="500" preserveAspectRatio="xMidYMax meet"/>
    </g>

    <!-- About Me Section -->
    <g transform="translate(50, 520)">
        <rect width="1100" height="180" rx="20" fill="rgba(18, 97, 72, 0.5)" filter="url(#clay-shadow)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
        
        <!-- Icon -->
        <circle cx="60" cy="60" r="30" fill="rgba(255,255,255,0.1)"/>
        <image href="${logoB64}" x="40" y="40" width="40" height="40" />

        <!-- Title -->
        <text x="120" y="65" fill="#ffffff" font-size="28" font-weight="600">About Me</text>
        
        <!-- Typed out text using Native SVG clipPath animation -->
        <g clip-path="url(#typing-clip)">
            <text x="120" y="105" fill="#bce0cf" font-size="18">I'm a Computer Science student at MMMUT and a Data Science student at IIT Madras.</text>
            <text x="120" y="135" fill="#bce0cf" font-size="18">My journey is driven by curiosity, consistency, and the belief that technology empowers people.</text>
        </g>
    </g>

    <!-- Dynamic Projects Section -->
    <text x="50" y="780" fill="#ffffff" font-size="26" font-weight="600">My Projects</text>
    ${ecoCardsSVG}

    <!-- Bottom Data Grid (Stats / Languages / Graph) -->
    <g transform="translate(50, 1150)">
        <!-- GitHub Stats -->
        <rect x="0" y="0" width="350" height="250" rx="20" fill="rgba(18, 97, 72, 0.5)" filter="url(#clay-shadow)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
        <text x="25" y="45" fill="#ffffff" font-size="22" font-weight="600">GitHub Stats</text>
        
        <text x="25" y="90" fill="#bce0cf" font-size="18">Repositories</text>
        <text x="320" y="90" fill="#ffffff" font-size="18" font-weight="600" text-anchor="end">${stats.repos}</text>
        
        <text x="25" y="130" fill="#bce0cf" font-size="18">Followers</text>
        <text x="320" y="130" fill="#ffffff" font-size="18" font-weight="600" text-anchor="end">${stats.followers}</text>

        <text x="25" y="170" fill="#bce0cf" font-size="18">Stars Earned</text>
        <text x="320" y="170" fill="#ffffff" font-size="18" font-weight="600" text-anchor="end">${stats.stars}+</text>

        <text x="25" y="210" fill="#bce0cf" font-size="18">Contributions</text>
        <text x="320" y="210" fill="#ffffff" font-size="18" font-weight="600" text-anchor="end">${stats.contributions}+</text>

        <!-- Top Languages -->
        <rect x="380" y="0" width="720" height="250" rx="20" fill="rgba(18, 97, 72, 0.5)" filter="url(#clay-shadow)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
        <text x="405" y="45" fill="#ffffff" font-size="22" font-weight="600">Top Languages</text>
        
        <!-- Faking a Pie Chart with pure SVG circles -->
        <circle cx="480" cy="140" r="50" fill="transparent" stroke="#3178c6" stroke-width="25" stroke-dasharray="100 214" />
        <circle cx="480" cy="140" r="50" fill="transparent" stroke="#f1e05a" stroke-width="25" stroke-dasharray="80 234" stroke-dashoffset="-100" />
        <circle cx="480" cy="140" r="50" fill="transparent" stroke="#3572A5" stroke-width="25" stroke-dasharray="50 264" stroke-dashoffset="-180" />
        
        <circle cx="600" cy="110" r="6" fill="#3178c6"/>
        <text x="620" y="115" fill="#bce0cf" font-size="16">TypeScript</text>
        <text x="730" y="115" fill="#ffffff" font-size="16" font-weight="600">33%</text>

        <circle cx="600" cy="150" r="6" fill="#f1e05a"/>
        <text x="620" y="155" fill="#bce0cf" font-size="16">JavaScript</text>
        <text x="730" y="155" fill="#ffffff" font-size="16" font-weight="600">23%</text>

        <circle cx="600" cy="190" r="6" fill="#3572A5"/>
        <text x="620" y="195" fill="#bce0cf" font-size="16">Python</text>
        <text x="730" y="195" fill="#ffffff" font-size="16" font-weight="600">18%</text>
    </g>

    <!-- Footer Quote -->
    <g transform="translate(50, 1450)">
        <rect width="1100" height="100" rx="30" fill="rgba(18, 97, 72, 0.5)" filter="url(#clay-shadow)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
        <image href="${logoB64}" x="30" y="30" width="40" height="40" />
        <text x="100" y="55" fill="#bce0cf" font-size="20">"Technology becomes meaningful when it helps people build, connect, learn, and grow together."</text>
    </g>

</svg>`;
}

module.exports = { generateSVG };
