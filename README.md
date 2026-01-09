# RestoCafe - Modern Restaurant Website

A fully functional, production-ready restaurant website built with Next.js 14, TypeScript, and Tailwind CSS. Features include online menu browsing, shopping cart, online ordering, table reservations, and a modern UI/UX.

## 🚀 Features

- **🎨 Modern UI/UX** - Responsive design with smooth animations
- **📱 Fully Responsive** - Mobile-first design that works on all devices
- **🛒 Shopping Cart** - Add/remove items with persistent storage
- **🛍️ Online Ordering** - Complete checkout flow with multiple payment methods
- **📅 Table Reservations** - Easy-to-use booking system
- **📋 Menu Management** - Categorized menu with search and filtering
- **⚡ TypeScript** - Full type safety throughout the application
- **🎬 Animations** - Smooth animations using Framer Motion
- **🎯 Form Validation** - Robust form handling with Zod and React Hook Form
- **💾 Local Storage** - Cart and order persistence

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.3
- **Styling**: Tailwind CSS 3.4
- **Database Ready**: Supabase integration
- **Form Validation**: Zod + React Hook Form
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Deployment**: Vercel

## 📦 Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vilas8/RestoCafe.git
   cd RestoCafe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update the following in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_RESTAURANT_NAME=RestoCafe
   NEXT_PUBLIC_RESTAURANT_PHONE=+91-XXXXXXXXXX
   NEXT_PUBLIC_RESTAURANT_EMAIL=info@restocafe.com
   NEXT_PUBLIC_RESTAURANT_ADDRESS=Bengaluru, Karnataka
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
RestoCafe/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Home page
│   │   ├── menu/
│   │   │   └── page.tsx             # Menu page with filtering
│   │   ├── cart/
│   │   │   └── page.tsx             # Shopping cart
│   │   ├── checkout/
│   │   │   └── page.tsx             # Checkout form
│   │   ├── order-success/
│   │   │   └── page.tsx             # Order confirmation
│   │   ├── reservations/
│   │   │   └── page.tsx             # Table booking
│   │   ├── about/
│   │   │   └── page.tsx             # About page
│   │   ├── contact/
│   │   │   └── page.tsx             # Contact page
│   │   ├── layout.tsx               # Root layout
│   │   ├── globals.css              # Global styles
│   │   └── providers.tsx            # React providers
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx           # Navigation header
│   │   │   └── Footer.tsx           # Footer
│   │   ├── MenuItem.tsx             # Menu item card
│   │   ├── CartItemCard.tsx         # Cart item component
│   │   ├── CategoryFilter.tsx       # Menu filtering
│   │   └── SearchBar.tsx            # Search functionality
│   ├── hooks/
│   │   └── useCart.ts               # Cart state management
│   ├── lib/
│   │   ├── supabase.ts              # Supabase client
│   │   ├── constants.ts             # Menu items & restaurant info
│   │   └── utils.ts                 # Utility functions
│   └── types/
│       └── index.ts                 # TypeScript interfaces
├── public/                          # Static assets
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── tailwind.config.ts               # Tailwind CSS config
├── postcss.config.js                # PostCSS config
├── next.config.js                   # Next.js config
└── README.md                        # Documentation
```

## 🎯 Key Features Explained

### Menu System
- Browse items by category (Appetizers, Mains, Desserts, Beverages)
- Search functionality
- Item details with spice levels and dietary info
- Popular items showcase

### Shopping Cart
- Add/remove items
- Adjust quantities
- Persistent storage using localStorage
- Real-time total calculation

### Checkout Process
- Multi-step form with validation
- Delivery address collection
- Multiple payment methods (Card, UPI, Cash on Delivery)
- Order confirmation with tracking ID

### Reservations
- Easy table booking
- Date and time selection
- Guest count options
- Special requests field
- Instant confirmation

## 🔗 Available Routes

| Route | Description |
|-------|-------------|
| `/` | Home page with featured items |
| `/menu` | Browse all menu items |
| `/cart` | Shopping cart |
| `/checkout` | Place order |
| `/order-success` | Order confirmation |
| `/reservations` | Book a table |
| `/about` | Restaurant information |
| `/contact` | Contact form and info |

## 🎨 Customization

### Change Restaurant Info
Edit `src/lib/constants.ts`:
```typescript
export const RESTAURANT_INFO = {
  name: 'Your Restaurant Name',
  phone: '+91-XXXXXXXXXX',
  email: 'your-email@example.com',
  address: 'Your Address',
  hours: 'Your Hours',
  cuisines: ['Your', 'Cuisines'],
};
```

### Update Menu Items
Modify the `MENU_ITEMS` array in `src/lib/constants.ts` with your own menu.

### Change Colors
Edit `tailwind.config.ts` to update the color scheme:
```typescript
colors: {
  primary: '#your-color',
  secondary: '#your-color',
  accent: '#your-color',
}
```

## 📝 Forms & Validation

All forms use **Zod** for schema validation and **React Hook Form** for state management:
- Checkout form
- Reservation form
- Contact form

## 🚀 Deployment on Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables
   - Click Deploy

Your site will be live in minutes!

## 🔐 Environment Variables

```env
# Supabase (Optional - for backend integration)
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# Restaurant Info
NEXT_PUBLIC_RESTAURANT_NAME=RestoCafe
NEXT_PUBLIC_RESTAURANT_PHONE=+91-XXXXXXXXXX
NEXT_PUBLIC_RESTAURANT_EMAIL=info@restocafe.com
NEXT_PUBLIC_RESTAURANT_ADDRESS=Bengaluru, Karnataka
```

## 🐛 Troubleshooting

### Cart not persisting?
- Check browser console for localStorage errors
- Clear site data and refresh

### Forms not validating?
- Ensure all required fields are filled
- Check browser console for validation errors

### Animations not smooth?
- Ensure Framer Motion is installed
- Check browser hardware acceleration

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email hello@restocafe.com or visit our website.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Animations by [Framer Motion](https://www.framer.com/motion/)
- Form validation with [Zod](https://zod.dev/) and [React Hook Form](https://react-hook-form.com/)

---

**RestoCafe** - Bringing authentic flavors to your doorstep! 🍕🍜🎉
