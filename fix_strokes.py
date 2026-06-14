import re

with open('svgBuilder.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(' stroke="rgba(255,255,255,0.1)"', '')
content = content.replace(' stroke="rgba(255,255,255,0.08)"', '')

with open('svgBuilder.js', 'w', encoding='utf-8') as f:
    f.write(content)
