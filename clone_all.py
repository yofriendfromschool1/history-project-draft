import os
import urllib.request
import json
import subprocess

username = "yofriendfromschool1"
api_url = f"https://api.github.com/users/{username}/repos?per_page=100"

print(f"Fetching repositories for {username}...")
try:
    with urllib.request.urlopen(api_url) as response:
        repos = json.loads(response.read().decode())
except Exception as e:
    print(f"Failed to fetch repositories: {e}")
    exit(1)
clone_dir = "games/yofriendfromschool1_archive"

if not os.path.exists(clone_dir):
    os.makedirs(clone_dir)

os.chdir(clone_dir)

count = 0
for repo in repos:
    clone_url = repo["clone_url"]
    name = repo["name"]
    print(f"[{count+1}/{len(repos)}] Cloning {name} (--depth=1)...")
    try:
        # Shallow clone to save massive amounts of time and space
        subprocess.run(["git", "clone", "--depth=1", clone_url], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except subprocess.CalledProcessError:
        print(f"Failed to clone {name} or it already exists.")
    count += 1

print("All repositories cloned successfully!")
