# 🚀 Free Hosting Guide for Knowledge and Skills Hub

## Option 1: Vercel (Recommended - Best for Next.js)

### Steps:
1. **Create GitHub Repository:**
   - Go to [GitHub.com](https://github.com)
   - Create new repository: `knowledge-skills-hub`
   - Upload your project files

2. **Deploy to Vercel:**
   - Go to [Vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your repository
   - Vercel auto-detects Next.js and deploys

**Result:** `https://your-project.vercel.app`

---

## Option 2: Netlify

### Steps:
1. **Create GitHub Repository** (same as above)

2. **Deploy to Netlify:**
   - Go to [Netlify.com](https://netlify.com)
   - Sign up with GitHub
   - Click "New site from Git"
   - Choose your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`

**Result:** `https://your-project.netlify.app`

---

## Option 3: GitHub Pages

### Steps:
1. **Create GitHub Repository:**
   - Go to [GitHub.com](https://github.com)
   - Create new repository: `knowledge-skills-hub`
   - Upload your project

2. **Enable GitHub Pages:**
   - Go to repository Settings
   - Scroll to "Pages" section
   - Source: "Deploy from a branch"
   - Branch: `main` or `master`
   - Folder: `/ (root)`

3. **Build and Deploy:**
   ```bash
   cd frontend
   npm run build
   ```
   - Copy contents of `out` folder to repository root
   - Commit and push

**Result:** `https://yourusername.github.io/knowledge-skills-hub`

---

## 🎯 Quick Start (Vercel - Easiest)

1. **Upload to GitHub**
2. **Go to [Vercel.com](https://vercel.com)**
3. **Import repository**
4. **Done!** Your site is live in 2 minutes

## 📝 Notes:
- **Vercel** is best for Next.js apps
- **Netlify** is great for static sites
- **GitHub Pages** is completely free but requires manual build
- All options provide HTTPS and custom domains

## 🔧 Backend Note:
For production, you'll need to host the backend separately or use serverless functions.
