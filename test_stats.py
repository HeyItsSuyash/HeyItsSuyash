import urllib.request
import re

url = "https://github-readme-stats.vercel.app/api?username=HeyItsSuyash"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        svg = response.read().decode('utf-8')
        # The SVG contains text tags with the stats. 
        # Total Contributions is usually there.
        print(svg[:1000])
        # Find all numbers
        matches = re.findall(r'<text.*?>(.*?)</text>', svg)
        print("Texts in SVG:", matches)
except Exception as e:
    print(e)
