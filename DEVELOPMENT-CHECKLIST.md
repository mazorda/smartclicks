# Development Workflow Checklist

## 1. Development Phase

### VS Code Setup Requirements
- [ ] Node.js 18+ installed
- [ ] Git configured with SSH key
- [ ] VS Code configured with:
  - Auto Save: onFocusChange
  - Format On Save: enabled
  - Default Formatter: Prettier
  - Tab Size: 2

### Required VS Code Extensions
- [ ] ESLint
- [ ] Prettier
- [ ] TypeScript and JavaScript Language Features
- [ ] Tailwind CSS IntelliSense
- [ ] GitLens
- [ ] Error Lens
- [ ] React Developer Tools (browser extension)

### Environment Setup
- [ ] Copy `.env.example` to `.env`
- [ ] Verify required environment variables:
  ```
  VITE_SUPABASE_URL=
  VITE_SUPABASE_ANON_KEY=
  ```
- [ ] Install dependencies: `npm install`

### Starting Local Development
1. Run the development server:
   ```bash
   npm run dev
   ```
2. Look for the Local URL in the terminal output:
   ```
   ➜  Local:   http://localhost:3007/
   ```
   Note: The port number (3007) may vary depending on port availability

3. Open the Local URL in your browser
4. The site will automatically reload when you make changes

### Package.json Scripts Guide
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build locally
npm test            # Run tests
npm run lint        # Run ESLint
npm run typecheck   # Check TypeScript types
```

## 2. Testing Phase

### Local Testing Steps
1. Start development server:
   ```bash
   npm run dev
   ```
2. Wait for the terminal to show the Local URL (e.g., http://localhost:3007/)
3. Open the URL in your browser
4. Verify hot reload is working:
   - Make a small change to a component
   - Save the file
   - Browser should update automatically
5. Check console for errors

### Common Test Scenarios
- [ ] Test authentication flow
- [ ] Verify domain audit functionality
- [ ] Check dashboard data loading
- [ ] Test responsive design (mobile/desktop)
- [ ] Verify theme switching
- [ ] Test form submissions
- [ ] Check error handling

### Debug Procedures
1. Check browser console for errors
2. Verify network requests in DevTools
3. Check React Components tab
4. Review Supabase logs if needed

### Performance Checks
- [ ] Run Lighthouse audit
- [ ] Check bundle size: `npm run build`
- [ ] Verify loading states
- [ ] Test on slower connections
- [ ] Monitor memory usage in DevTools

## 3. Deployment Phase

### Git Commit Guidelines
- Use conventional commits:
  ```
  feat: add new feature
  fix: bug fix
  docs: documentation changes
  style: formatting changes
  refactor: code restructuring
  test: adding tests
  chore: maintenance tasks
  ```

### Push Procedures
1. Run final checks:
   ```bash
   npm run typecheck
   npm run lint
   npm test
   npm run build
   ```
2. Stage changes: `git add .`
3. Commit with meaningful message
4. Push to GitHub: `git push origin main`

### Netlify Deployment Verification
1. Monitor deployment in Netlify dashboard
2. Check deploy preview URL
3. Verify:
   - [ ] Environment variables
   - [ ] Build logs
   - [ ] Deploy preview functionality
   - [ ] Production URL (smartclicks.ai)

### Post-Deployment Checks
- [ ] Verify production environment
- [ ] Check all critical paths
- [ ] Monitor error logging
- [ ] Test authentication flow
- [ ] Verify API connections
- [ ] Check analytics tracking

## 4. Emergency Procedures

### Common Issues & Solutions

#### Build Failures
1. Check Netlify build logs
2. Verify environment variables
3. Clear cache and rebuild
4. Check for dependency conflicts

#### Runtime Errors
1. Check browser console
2. Review error tracking service
3. Verify API endpoints
4. Check Supabase status

#### Local Development Issues
1. Port already in use:
   - The dev server will automatically try the next available port
   - Look for the correct URL in terminal output
2. Dependencies issues:
   - Run `npm install` to update dependencies
   - Delete node_modules and run `npm install` again
3. Environment variables:
   - Verify `.env` file exists
   - Check all required variables are set
4. Hot reload not working:
   - Check terminal for errors
   - Restart dev server

### Rollback Procedures
1. Identify last working commit
2. Revert in GitHub:
   ```bash
   git revert HEAD
   git push origin main
   ```
3. Monitor Netlify auto-deployment
4. Verify rollback success

### Support Contacts
- Technical Lead: [Contact Info]
- DevOps Support: [Contact Info]
- Supabase Support: https://supabase.com/support
- Netlify Support: https://www.netlify.com/support/

### Debug Logs Location
- Development: Browser console & terminal
- Production: Netlify deploy logs
- Database: Supabase logs
- Application: Error tracking service
- Server: Netlify Functions logs

## Quick Reference

### Local Development URLs
- Development: Check terminal output for correct URL (e.g., http://localhost:3007/)
- Supabase Studio: http://localhost:54323

### Production URLs
- Production: https://smartclicks.ai
- Staging: [Your staging URL]

### Useful Commands
```bash
# Development
npm run dev          # Start local server
npm run typecheck    # Check types
npm run lint        # Lint code

# Testing
npm test            # Run all tests
npm test:watch      # Run tests in watch mode

# Deployment
npm run build       # Build for production
npm run preview     # Preview production build
```

Remember: Always pull latest changes before starting development:
```bash
git pull origin main
npm install        # If dependencies changed
