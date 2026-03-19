import os
import json

base_archive_path = "games/yofriendfromschool1_archive"

try:
    repos = [d for d in os.listdir(base_archive_path) if os.path.isdir(os.path.join(base_archive_path, d))]
    repos.sort()

    with open("repos_data.js", "w") as f:
        f.write("const archiveRepos = [\n")
        
        repo_readmes = {}
        for r in repos:
            repo_path = os.path.join(base_archive_path, r)
            
            # Default fallback url
            target_url = f"{base_archive_path}/{r}/"
            
            # Check for index.html first
            if os.path.exists(os.path.join(repo_path, "index.html")):
                target_url = f"{base_archive_path}/{r}/index.html"
            # Otherwise look for README.md
            elif os.path.exists(os.path.join(repo_path, "README.md")):
                target_url = f"readme-viewer.html?repo={r}"
                try:
                    with open(os.path.join(repo_path, "README.md"), "r", encoding="utf-8", errors="ignore") as md:
                        repo_readmes[r] = md.read()
                except Exception as ex:
                    print(f"Failed to read {r} README: {ex}")
                
            f.write(f'    {{ name: "{r}", url: "{target_url}", type: "Repo", desc: "Local GitHub Archive" }},\n')
            
        f.write("];\n\n")
        f.write("const repoReadmes = " + json.dumps(repo_readmes) + ";\n")
        
    print("Successfully generated advanced repos_data.js with offline README.md mapping.")
except Exception as e:
    print(f"Error: {e}")
