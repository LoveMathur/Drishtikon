# Using NPX with Drishtikon Frontend

## ✅ Fixed Issues

1. **Tailwind CSS v4 Error**: Downgraded to Tailwind CSS v3 (stable) which works properly with PostCSS
2. **NPX Requirement**: All commands now use `npx` as requested

## 🚀 Running Commands with NPX

### Start Development Server
```bash
cd /home/kirmaada/Projects/Drishtikon/frontend
npx vite
```
**Current URL**: http://localhost:5174/

### Build for Production
```bash
npx vite build
```

### Preview Production Build
```bash
npx vite preview
```

### Run Linter
```bash
npx eslint .
```

### Alternative: Use package.json scripts (now with npx)
```bash
source /home/kirmaada/.bashrc
npx npm run dev      # Start dev server
npx npm run build    # Build for production
npx npm run preview  # Preview build
```

## 📦 Package Management with NPX

### Install Dependencies
```bash
npx npm install <package-name>
```

### Install Dev Dependencies
```bash
npx npm install -D <package-name>
```

### Uninstall Packages
```bash
npx npm uninstall <package-name>
```

## 🔧 Current Configuration

### Tailwind CSS v3
- **Version**: 3.4.19 (stable)
- **PostCSS**: 8.5.8
- **Autoprefixer**: 10.4.27

### Vite
- **Version**: 8.0.4
- **Port**: 5174 (auto-incremented from 5173)

## ✨ What Changed

1. **Removed**: Tailwind CSS v4 (had PostCSS compatibility issues)
2. **Installed**: Tailwind CSS v3.4.19 (stable and compatible)
3. **Updated**: All scripts in package.json to use `npx`
4. **Fixed**: CSS configuration for v3 compatibility

## 🎯 Current Status

✅ Frontend running: http://localhost:5174/  
✅ Backend running: http://localhost:8001/  
✅ All commands use npx  
✅ Tailwind CSS v3 working properly  
✅ No errors  

## 📝 Notes

- Always use `source /home/kirmaada/.bashrc` before npx commands to ensure Node.js is in PATH
- Port changed from 5173 to 5174 (Vite auto-incremented due to port conflict)
- All Tailwind utilities working (gradients, glass effects, animations)
- React 19 + Vite 8 + Tailwind 3 = stable combination

---

**Last Updated**: 2026-04-07  
**Status**: ✅ All Issues Resolved
