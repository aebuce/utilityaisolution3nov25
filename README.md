# Facility Management Presentation

A React-based presentation application showcasing facility management solutions, cost analysis, and technical architecture. This application is deployed on GitHub Pages and features interactive slides with charts, diagrams, and highlighting capabilities.

## 🌐 Live Demo

The presentation is deployed and accessible at: **https://aebuce.github.io/utilityaisolution3nov25/**

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.com) (recommended) or Node.js 18+
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/aebuce/utilityaisolution3nov25.git
cd utilityaisolution3nov25
```

2. Install dependencies:
```bash
bun install
```

### Development

Start the development server:
```bash
bun run dev
```

The application will be available at `http://localhost:3000`

### Building for Production

Build the application for production:
```bash
bun run build:prod
```

Preview the production build locally:
```bash
bun run preview:dist
```

The preview will be available at `http://localhost:4173/utilityaisolution3nov25/`

## 📦 Deployment

### Automatic Deployment

The application is automatically deployed to GitHub Pages when changes are pushed to the `main` branch. The deployment process:

1. **Build**: The application is built using Vite with production optimizations
2. **Deploy**: Built files are deployed to GitHub Pages using GitHub Actions
3. **Access**: The live application is available at the GitHub Pages URL

### Manual Deployment

To manually trigger a deployment:

1. Go to the [Actions tab](https://github.com/aebuce/utilityaisolution3nov25/actions) in the GitHub repository
2. Select the "Deploy to GitHub Pages" workflow
3. Click "Run workflow" and select the `main` branch

### GitHub Pages Configuration

The application is configured for GitHub Pages deployment with:
- **Base path**: `/utilityaisolution3nov25/` (repository name)
- **Asset organization**: CSS, JS, and images are organized in subdirectories
- **Static hosting optimization**: Proper asset fingerprinting and caching

## 🛠️ Development Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Build for production |
| `bun run build:prod` | Build for production (explicit mode) |
| `bun run preview` | Preview production build |
| `bun run preview:dist` | Preview with host access |

## 🏗️ Project Structure

```
src/
├── components/          # React components
├── contexts/           # React contexts
├── config/            # Configuration files
├── styles/            # CSS stylesheets
└── main.tsx          # Application entry point
```

## 🔧 Troubleshooting

### Common Issues

**1. Application not loading on GitHub Pages**
- Verify the repository has GitHub Pages enabled
- Check that the source is set to "GitHub Actions"
- Ensure the workflow completed successfully

**2. Assets not loading (404 errors)**
- Confirm the base path is correctly set in `vite.config.ts`
- Check that asset paths are relative, not absolute

**3. Build failures**
- Ensure all dependencies are installed: `bun install`
- Check for TypeScript errors: `bun run build`
- Review the GitHub Actions logs for specific error messages

**4. Local preview not working**
- Make sure you're using the correct preview URL with the base path
- Try clearing browser cache and hard refresh

### Getting Help

If you encounter issues:

1. Check the [GitHub Actions logs](https://github.com/aebuce/utilityaisolution3nov25/actions) for deployment errors
2. Verify your local environment matches the production requirements
3. Clear browser cache and try accessing the application in an incognito window
4. Check the browser console for JavaScript errors

### Error Reporting

The application includes error boundaries and logging. If you encounter errors:
- Check the browser console for detailed error information
- Error details are stored in sessionStorage for debugging
- Technical details are available in the error boundary UI

## 📄 License

This project was created using `bun init` in bun v1.3.1. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
