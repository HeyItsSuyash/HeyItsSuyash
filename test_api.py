import urllib.request
import json

USERNAME = 'HeyItsSuyash'
url = f"https://api.github.com/users/{USERNAME}/repos?per_page=100"

req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        total_stars = sum(repo['stargazers_count'] for repo in data)
        print(f"Total repos: {len(data)}")
        print(f"Total stars: {total_stars}")
except Exception as e:
    print(e)
