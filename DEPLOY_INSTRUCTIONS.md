# Deployment Instructions

## 1. Install Git
Your computer does not have Git installed. Please install it first:
1. Download from [git-scm.com](https://git-scm.com/download/win).
2. Run the installer (Click "Next" through the defaults).
3. **Restart your terminal/VS Code** after installation.

## 2. Initial Setup (One Time Only)
Run these commands in your terminal to upload your code for the first time:
```powershell
git init
git add .
git commit -m "Ready for deploy"
# Create a new repo on GitHub.com and replace the URL below:
git remote add origin https://github.com/SHYBOY2/studywebsite.git
git push -u origin main
```

## 3. Cloudflare Pages Setup
1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com).
2. Go to **Workers & Pages** > **Create Application** > **Connect to Git**.
3. Select your repo (`studywebsite`).
4. Use these **exact** build settings:

| Setting | Value |
| :--- | :--- |
| **Framework Preset** | `Next.js` |
| **Build Command** | `npm run pages:build` |
| **Output Directory** | `.vercel/output/static` |

5. **IMPORTANT**: Add this Environment Variable:
   - Variable: `NODE_VERSION`
   - Value: `20`

6. Click **Save and Deploy**.

## 4. How to Update Your Website
Whenever you modify code or add new features, run these 3 commands to update the live site:

```powershell
# 1. Stage all changes
git add .

# 2. Save changes with a message (change the message as needed)
git commit -m "Update site with new features"

# 3. Push to GitHub (Cloudflare will detect this and auto-deploy)
git push
```

After running `git push`, Cloudflare will automatically start building the new version. You can check the progress in the Cloudflare Dashboard under **Deployments**.
