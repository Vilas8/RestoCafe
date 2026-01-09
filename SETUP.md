# RestoCafe Setup Guide

## Quick Start

This guide will help you get RestoCafe up and running on your local machine and deploy to Vercel.

## Prerequisites

- Node.js 16 or higher
- npm or yarn
- Git
- GitHub account
- Vercel account (free)

## Local Development

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/Vilas8/RestoCafe.git
cd RestoCafe

# Install dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy example env file
cp .env.example .env.local
```

Edit `.env.local` and update:

```env
# Optional: Supabase configuration (for backend integration)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Restaurant Information
NEXT_PUBLIC_RESTAURANT_NAME=RestoCafe
NEXT_PUBLIC_RESTAURANT_PHONE=+91-XXXXXXXXXX
NEXT_PUBLIC_RESTAURANT_EMAIL=info@restocafe.com
NEXT_PUBLIC_RESTAURANT_ADDRESS=Bengaluru, Karnataka
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

```bash
# Build the app
npm run build

# Start production server
npm start
```

## Deploy to Vercel

### Option 1: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Option 2: Using Vercel Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Go to [vercel.com](https://vercel.com)**
   - Sign in with GitHub
   - Click "Add New" → "Project"
   - Select your RestoCafe repository
   - Click "Import"

3. **Configure Environment Variables**
   - Go to "Settings" → "Environment Variables"
   - Add the following:
     ```
     NEXT_PUBLIC_RESTAURANT_NAME = RestoCafe
     NEXT_PUBLIC_RESTAURANT_PHONE = +91-8899776655
     NEXT_PUBLIC_RESTAURANT_EMAIL = hello@restocafe.com
     NEXT_PUBLIC_RESTAURANT_ADDRESS = Bengaluru, Karnataka
     ```

4. **Click Deploy**
   - Vercel will automatically build and deploy your site
   - You'll get a live URL like `https://resto-cafe-xxx.vercel.app`

## Customization

### Change Restaurant Info

Edit `src/lib/constants.ts`:

```typescript
export const RESTAURANT_INFO = {
  name: 'Your Restaurant Name',
  phone: '+91-YOUR-PHONE',
  email: 'your-email@example.com',
  address: 'Your Address, City, State',
  hours: 'Your Operating Hours',
  cuisines: ['Cuisine1', 'Cuisine2'],
};

export const MENU_ITEMS = [
  {
    id: '1',
    name: 'Dish Name',
    description: 'Dish description',
    price: 299,
    category: 'mains',
    image: 'image-url',
    vegetarian: true,
    spicy: 1,
    popular: true,
  },
  // ... add more items
];
```

### Change Color Theme

Edit `tailwind.config.ts`:

```typescript
colors: {
  primary: '#your-color',      // Main color (orange by default)
  secondary: '#your-color',    // Text color
  accent: '#your-color',       // Accent color
}
```

### Update Header/Footer Links

Edit `src/components/layout/Header.tsx` and `src/components/layout/Footer.tsx`

## Vercel Deployment Tips

1. **Auto-Deploy on Push**
   - Any push to main branch automatically deploys
   - Preview deploys for pull requests

2. **Custom Domain**
   - In Vercel Settings → Domains
   - Add your custom domain
   - Update DNS settings

3. **Analytics**
   - Vercel provides built-in Web Analytics
   - Check in Vercel dashboard

4. **Environment Variables**
   - Update in Vercel dashboard → Settings
   - Redeploy after changes

## Features Available

✅ Home page with hero section  
✅ Menu browsing with filtering  
✅ Shopping cart with persistence  
✅ Checkout with form validation  
✅ Order confirmation page  
✅ Table reservations  
✅ About page  
✅ Contact page with form  
✅ Responsive design  
✅ Smooth animations  
✅ Dark mode ready  

## Database Integration (Optional)

To add backend functionality with Supabase:

1. Create Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Get your URL and anon key
4. Add to `.env.local`
5. Create tables for:
   - Orders
   - Reservations
   - Contact messages

## Troubleshooting

### Issue: Build fails on Vercel
- Check Node.js version matches
- Clear cache: `vercel env pull`
- Check environment variables are set

### Issue: Styles not loading
- Clear `.next` folder
- Rebuild: `npm run build`
- Hard refresh browser (Ctrl+Shift+R)

### Issue: Cart not persisting
- Check localStorage is enabled
- Clear browser cache
- Check console for errors

## Performance Optimization

- Images are optimized with Next.js Image component
- Code splitting is automatic with Next.js
- CSS is minified with Tailwind
- Vercel provides edge caching

## Security

- Input validation with Zod
- No sensitive data in frontend
- HTTPS enforced by Vercel
- XSS protection

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Add custom domain
3. ✅ Customize restaurant info
4. ✅ Add your menu items
5. ✅ Set up Supabase (optional)
6. ✅ Configure email notifications (optional)

## Support

- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

---

**Ready to launch? Push to Vercel and share your restaurant with the world! 🚀**
