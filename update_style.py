import re

with open('svgBuilder.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Change font to Space Grotesk
content = content.replace("family=Fredoka:wght@300;400;500;600;700", "family=Space+Grotesk:wght@300;400;500;600;700")
content = content.replace("font-family: 'Fredoka', sans-serif;", "font-family: 'Space Grotesk', sans-serif;")

# Remove rx (rounded corners)
content = re.sub(r'\brx="\d+"', '', content)

# Instead of "clay-shadow", use a sharper neon glow or remove it.
# The user wants "proper rectangles" or "simple vertical and horizontal rules".
content = content.replace('filter="url(#clay-shadow)"', '')

# Remove the drop shadow def completely to clean it up
# Wait, let's keep the filter but make it a sharp neon glow
neon_glow = """<filter id="clay-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>"""
content = re.sub(r'<filter id="clay-shadow".*?</filter>', neon_glow, content, flags=re.DOTALL)

with open('svgBuilder.js', 'w', encoding='utf-8') as f:
    f.write(content)
