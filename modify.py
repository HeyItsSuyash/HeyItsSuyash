import re

def modify_github_svg():
    with open('github.svg', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Backgrounds to yellow/black
    content = content.replace('linear-gradient(135deg, #0a563d 0%, #0f6247 100%)', '#000000')
    content = content.replace('background: rgba(18, 97, 72, 0.5);', 'background: #000000;')
    content = content.replace('background: rgba(22, 110, 80, 0.8);', 'background: #FFD700; color: #000;')
    content = content.replace('border: 1px solid rgba(255, 255, 255, 0.08);', 'border: 1px solid rgba(255, 215, 0, 0.3);')
    content = content.replace('box-shadow: \n                10px 10px 20px rgba(5, 45, 30, 0.3),\n                -5px -5px 15px rgba(25, 125, 90, 0.2),', 
                              'box-shadow: \n                10px 10px 20px rgba(0, 0, 0, 0.5),\n                -5px -5px 15px rgba(20, 20, 20, 0.5),')
    content = content.replace('color: #bce0cf;', 'color: #dddddd;')
    content = content.replace('color: #8cc3a9;', 'color: #FFD700;')
    
    # Text changes
    content = content.replace('color: #fff;', 'color: #ffffff;')
    
    # 2. Remove navbar, hero, about from CSS and HTML completely
    # First, HTML parts:
    content = re.sub(r'<div class="navbar">.*?</div>\s*<!-- Hero Section -->', '<!-- Hero Section -->', content, flags=re.DOTALL)
    content = re.sub(r'<div class="bg-text">SUYASH</div>', '', content)
    content = re.sub(r'<div class="hero">.*?</div>\s*<!-- About Me -->', '<!-- About Me -->', content, flags=re.DOTALL)
    content = re.sub(r'<div class="about-card clay">.*?</div>\s*<!-- My Projects \(Horizontal Scroll\) -->', '<!-- My Projects -->', content, flags=re.DOTALL)
    
    # Remove CSS sections (not strictly necessary but cleans it up)
    # The SVG will still be valid and just not use these styles.
    
    # 3. Create a completely black section for projects, white text
    # In JS: `const langColor = langColors[repo.language] || '#8cc3a9';` -> `#FFD700`
    content = content.replace("|| '#8cc3a9';", "|| '#FFD700';")
    content = content.replace('stroke="#8cc3a9"', 'stroke="#FFD700"')
    
    with open('github.svg', 'w', encoding='utf-8') as f:
        f.write(content)

def modify_svg_builder():
    with open('svgBuilder.js', 'r', encoding='utf-8') as f:
        content = f.read()

    # Change generateProjectCard to be black background, white text
    # Change generateStats to black/yellow
    content = content.replace('fill="#0b583f"', 'fill="#000000"')
    content = content.replace('fill="rgba(18, 97, 72, 0.5)"', 'fill="#000000" stroke="rgba(255,215,0,0.3)"')
    content = content.replace('fill="rgba(18, 97, 72, 0.6)"', 'fill="#000000" stroke="rgba(255,215,0,0.3)"')
    content = content.replace('fill="#bce0cf"', 'fill="#dddddd"')
    content = content.replace('fill="#8cc3a9"', 'fill="#FFD700"')
    
    with open('svgBuilder.js', 'w', encoding='utf-8') as f:
        f.write(content)

modify_github_svg()
modify_svg_builder()
