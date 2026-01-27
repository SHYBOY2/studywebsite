# Deployment Instructions

## 1. Install Git
Your computer does not have Git installed. Please install it first:
1. Download from [git-scm.com](https://git-scm.com/download/win).
2. Run the installer (Click "Next" through the defaults).
3. **Restart your terminal/VS Code** after installation.

## 2. Upload Code
Run these commands in your terminal:
```powershell
git init
git add .
git commit -m "Ready for deploy"
# Create a new repo on GitHub.com and replace the URL below:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## 3. Cloudflare Pages Setup
1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com).
2. Go to **Workers & Pages** > **Create Application** > **Connect to Git**.
3. Select your repo.
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
