# 🍽️ RestoCafe - Modern Restaurant Website

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-14.0+-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](#license)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com)

**A production-ready restaurant website with modern UI/UX, built with cutting-edge web technologies**

[Live Demo](#-live-demo) • [Features](#-features) • [Getting Started](#-getting-started) • [Tech Stack](#-tech-stack) • [Contributing](#-contributing)

</div>

---

## 🎯 Overview

RestoCafe is a fully functional, modern restaurant website that provides an exceptional user experience for browsing menus, placing online orders, and making table reservations. Built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**, it's optimized for Vercel deployment and ready for production use.

Whether you're a restaurant owner, developer, or enthusiast, RestoCafe serves as both a functional application and a learning resource for building modern web applications.

---

## ✨ Features

### 🏠 **Home Page**
- ✅ Eye-catching hero section with clear CTAs
- ✅ Feature highlights (Quality, Speed, Variety)
- ✅ Popular dishes showcase
- ✅ Smooth scroll animations
- ✅ Mobile-responsive design

### 🍕 **Menu Management**
- ✅ Browse items by category (Appetizers, Mains, Desserts, Beverages)
- ✅ Real-time search functionality
- ✅ Spice level indicators (🌶️ Mild, Medium, Hot)
- ✅ Vegetarian/Non-vegetarian badges
- ✅ Popular items highlighted
- ✅ Beautiful item cards with images

### 🛒 **Shopping Cart**
- ✅ Add/remove items seamlessly
- ✅ Adjust quantities on the fly
- ✅ Real-time total calculation
- ✅ Persistent storage (localStorage)
- ✅ Empty cart state handling
- ✅ Cart item counter in header

### 💳 **Checkout Process**
- ✅ Multi-step form with validation
- ✅ Customer information collection
- ✅ Delivery address input
- ✅ Multiple payment methods (Card, UPI, Cash on Delivery)
- ✅ Form validation using Zod
- ✅ Order summary sidebar
- ✅ Tax calculation

### 📋 **Order Confirmation**
- ✅ Order ID generation
- ✅ Estimated delivery time display
- ✅ Order details summary
- ✅ Delivery address confirmation
- ✅ Share & tracking options

### 📅 **Table Reservations**
- ✅ Easy-to-use booking form
- ✅ Date and time selection
- ✅ Guest count options (1-20 guests)
- ✅ Special requests field
- ✅ Instant confirmation
- ✅ Info cards for features
- ✅ Google Maps integration

### 📱 **Additional Pages**
- ✅ **About Page** - Restaurant story, team showcase
- ✅ **Contact Page** - Contact form, location, hours
- ✅ **Footer** - Quick links, social media, contact info
- ✅ **Header** - Navigation, cart icon with counter

### 🎨 **Design & UX**
- ✅ Fully responsive (Mobile, Tablet, Desktop)
- ✅ Smooth animations with Framer Motion
- ✅ Modern color scheme (Customizable)
- ✅ Accessibility features
- ✅ Dark mode ready
- ✅ Fast page loads
- ✅ SEO optimized

---

## 🚀 Tech Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) - React meta-framework with App Router
- **Language**: [TypeScript 5.3](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/) - Utility-first CSS
- **Animations**: [Framer Motion 10.16](https://www.framer.com/motion/) - Production-ready animations
- **Form Handling**: [React Hook Form 7.48](https://react-hook-form.com/) - Performant forms
- **Validation**: [Zod 3.22](https://zod.dev/) - TypeScript-first schema validation
- **Icons**: [Lucide React 0.292](https://lucide.dev/) - Beautiful SVG icons
- **Notifications**: [React Hot Toast 2.4](https://react-hot-toast.com/) - Notifications

### Backend Ready (Optional)
- **Database**: [Supabase](https://supabase.com/) - PostgreSQL + Real-time API

### Deployment
- **Hosting**: [Vercel](https://vercel.com/) - Edge network, serverless functions
- **Version Control**: [GitHub](https://github.com/)

---

## 📦 Project Structure

```
RestoCafe/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # 🏠 Home page
│   │   ├── menu/
│   │   │   └── page.tsx                # 🍕 Menu with filtering
│   │   ├── cart/
│   │   │   └── page.tsx                # 🛒 Shopping cart
│   │   ├── checkout/
│   │   │   └── page.tsx                # 💳 Checkout form
│   │   ├── order-success/
│   │   │   └── page.tsx                # ✅ Order confirmation
│   │   ├── reservations/
│   │   │   └── page.tsx                # 📅 Table booking
│   │   ├── about/
│   │   │   └── page.tsx                # ℹ️ About page
│   │   ├── contact/
│   │   │   └── page.tsx                # 📧 Contact page
│   │   ├── layout.tsx                  # 📄 Root layout
│   │   ├── globals.css                 # 🎨 Global styles
│   │   └── providers.tsx               # 🔧 React providers
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx              # 🔝 Navigation
│   │   │   └── Footer.tsx              # 🔚 Footer
│   │   ├── MenuItem.tsx                # 🍴 Menu item card
│   │   ├── CartItemCard.tsx            # 🛍️ Cart item
│   │   ├── CategoryFilter.tsx          # 🏷️ Filter component
│   │   └── SearchBar.tsx               # 🔍 Search component
│   ├── hooks/
│   │   └── useCart.ts                  # 🎣 Cart state hook
│   ├── lib/
│   │   ├── supabase.ts                 # 💾 Database client
│   │   ├── constants.ts                # ⚙️ Menu & restaurant info
│   │   └── utils.ts                    # 🛠️ Utility functions
│   └── types/
│       └── index.ts                    # 📝 TypeScript types
├── public/                             # 📁 Static assets
├── package.json                        # 📦 Dependencies
├── tsconfig.json                       # ⚙️ TypeScript config
├── tailwind.config.ts                  # 🎨 Tailwind config
├── next.config.js                      # ⚙️ Next.js config
├── postcss.config.js                   # ⚙️ PostCSS config
├── vercel.json                         # 🚀 Vercel config
├── README.md                           # 📚 Documentation
├── SETUP.md                            # 🔧 Setup guide
└── DEPLOY_NOW.md                       # ⚡ Quick deploy guide
```

---

## 🏃 Getting Started

### Prerequisites
- **Node.js** 16.0 or higher
- **npm** or **yarn**
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vilas8/RestoCafe.git
   cd RestoCafe
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your restaurant details:
   ```env
   NEXT_PUBLIC_RESTAURANT_NAME="Your Restaurant Name"
   NEXT_PUBLIC_RESTAURANT_PHONE="+91-XXXXXXXXXX"
   NEXT_PUBLIC_RESTAURANT_EMAIL="your-email@example.com"
   NEXT_PUBLIC_RESTAURANT_ADDRESS="Your Address, City, State"
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser 🎉

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

---

## 🚀 Deployment

### Deploy on Vercel (Recommended)

The easiest way to deploy RestoCafe is using [Vercel](https://vercel.com):

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy to Vercel"
   git push origin main
   ```

2. **Import on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Select your GitHub repository
   - Vercel auto-detects Next.js
   - Add environment variables
   - Click **Deploy**

3. **Get your live URL**
   - Your site is live! 🎉
   - Share the URL with the world

**Read [DEPLOY_NOW.md](./DEPLOY_NOW.md) for quick 2-minute deployment!**

---

## 🎨 Customization

### Change Restaurant Information

Edit `src/lib/constants.ts`:

```typescript
export const RESTAURANT_INFO = {
  name: 'Your Restaurant Name',
  phone: '+91-XXXXXXXXXX',
  email: 'your-email@example.com',
  address: 'Your Address, City, State',
  hours: 'Mon-Sun: 10:00 AM - 11:00 PM',
  cuisines: ['Indian', 'Italian', 'Continental'],
};
```

### Update Menu Items

Edit the `MENU_ITEMS` array in `src/lib/constants.ts`:

```typescript
export const MENU_ITEMS = [
  {
    id: '1',
    name: 'Dish Name',
    description: 'Delicious description',
    price: 299,
    category: 'mains',
    image: 'image-url',
    vegetarian: true,
    spicy: 1,
    popular: true,
  },
  // Add more items...
];
```

### Change Color Scheme

Edit `tailwind.config.ts`:

```typescript
colors: {
  primary: '#d97706',      // Main brand color (orange)
  secondary: '#1f2937',    // Text color (dark gray)
  accent: '#f59e0b',       // Accent color (amber)
}
```

---

## 📊 Available Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero, features, popular items |
| `/menu` | Menu | Browse & filter all items |
| `/cart` | Cart | View cart & manage items |
| `/checkout` | Checkout | Order form & payment |
| `/order-success` | Success | Order confirmation |
| `/reservations` | Reservations | Book a table |
| `/about` | About | Restaurant story & team |
| `/contact` | Contact | Contact form & info |

---

## 🎯 Key Features Explained

### State Management
- **Cart State**: Using `useCart` hook with localStorage persistence
- **Form State**: React Hook Form with Zod validation
- **UI State**: React hooks (useState, useEffect)

### Form Validation
- **Checkout**: Validates customer info, address, payment method
- **Reservations**: Validates name, email, phone, date, time, guests
- **Contact**: Validates name, email, subject, message
- All using **Zod** schema validation with React Hook Form

### Performance
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **CSS**: Minified with Tailwind CSS
- **Lighthouse Score**: 95+

### SEO
- **Meta Tags**: Optimized title & description
- **Open Graph**: Social media sharing
- **Structured Data**: Ready for schema.org

---

## 🔧 Configuration Files

### `next.config.js`
Next.js configuration with image optimization

### `tailwind.config.ts`
Tailwind CSS customization with design tokens

### `tsconfig.json`
TypeScript configuration with path aliases

### `postcss.config.js`
PostCSS plugins for Tailwind CSS

### `vercel.json`
Vercel deployment configuration

---

## 📚 Documentation

- **[README.md](./README.md)** - Project overview (this file)
- **[SETUP.md](./SETUP.md)** - Detailed setup & customization guide
- **[DEPLOY_NOW.md](./DEPLOY_NOW.md)** - Quick 2-minute deployment guide

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

You're free to use this project for:
- ✅ Personal projects
- ✅ Commercial websites
- ✅ Learning purposes
- ✅ Modifying and distributing

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) - The React framework
- Styled with [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- Animations by [Framer Motion](https://www.framer.com/motion/) - Modern animations
- Forms with [React Hook Form](https://react-hook-form.com/) - Performant forms
- Validation with [Zod](https://zod.dev/) - TypeScript schemas
- Icons from [Lucide](https://lucide.dev/) - Beautiful SVG icons
- Hosted on [Vercel](https://vercel.com/) - Edge network

---

## 📞 Support & Help

If you have questions or need help:

1. **Check existing documentation** - [SETUP.md](./SETUP.md), [DEPLOY_NOW.md](./DEPLOY_NOW.md)
2. **Search GitHub Issues** - Look for similar issues
3. **Create a new issue** - Describe your problem with details
4. **Email**: For business inquiries, contact via the contact page

---

## 🌟 Show Your Support

If you found this project helpful, please:
- ⭐ Star this repository
- 🍴 Fork it to create your own version
- 📢 Share with others
- 💬 Leave feedback in discussions

---

## 🗺️ Roadmap

### v1.0 (Current)
- ✅ Menu browsing with filtering
- ✅ Online ordering with checkout
- ✅ Table reservations
- ✅ Responsive design
- ✅ Form validation

### v1.1 (Planned)
- 📋 User authentication & profiles
- 💾 Supabase database integration
- 📧 Email notifications
- 📊 Admin dashboard
- ⭐ Reviews & ratings

### v2.0 (Future)
- 📱 Native mobile apps
- 🤖 AI-powered recommendations
- 💳 Payment gateway integration
- 📍 Real-time order tracking
- 🔔 Push notifications

---

<div align="center">

### Made with ❤️ by [Vilas Kumar](https://github.com/Vilas8)

**RestoCafe** - Bringing authentic flavors to your doorstep! 🍕🍔🍜

[⬆ Back to Top](#-restocafe---modern-restaurant-website)

</div>
