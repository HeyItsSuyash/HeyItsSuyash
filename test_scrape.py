import urllib.request
import re

USERNAME = 'HeyItsSuyash'
url = f"https://github.com/{USERNAME}"

req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        match = re.search(r'([0-9,]+)\s+contributions\s+in the last year', html)
        if match:
            print(f"Contributions: {match.group(1)}")
        else:
            print("Contributions not found in HTML")
except Exception as e:
    print(e)
