# PH-HealthCare Frontend

A modern, responsive healthcare platform built with Next.js 15, React, TypeScript, and Tailwind CSS. Connect with verified doctors, book appointments, and manage your health digitally.

## Features

- **Doctor Discovery**: Browse and filter verified doctors by specialty, gender, and consultation fee
- **User Authentication**: Separate signup flows for patients and doctors with role-based access
- **Responsive Design**: Mobile-first approach with beautiful UI across all devices
- **Real-time Search**: Search doctors by name or specialty
- **Rating & Reviews**: View doctor ratings and patient testimonials
- **Animation**: Smooth transitions and micro-interactions with Framer Motion
- **Dark Mode Support**: Built-in light/dark theme switching
- **State Management**: React Query for efficient server state management

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/UI
- **Forms**: React Hook Form + Zod
- **State Management**: React Query v5
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Notifications**: Sonner
- **Theme**: Next Themes

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public routes
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Landing page
│   │   ├── doctors/
│   │   │   └── page.tsx          # Doctor discovery
│   │   └── auth/
│   │       └── page.tsx          # Authentication page
│   ├── (protected)/              # Protected routes (requires auth)
│   │   ├── dashboard/
│   │   └── appointments/
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   └── providers.tsx             # App providers
├── features/                     # Feature-based modules
│   ├── auth/                     # Authentication
│   │   ├── components/
│   │   ├── validations/
│   │   └── services/
│   ├── doctors/                  # Doctor-related features
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
│   ├── appointments/             # Appointment management
│   └── shared/                   # Shared utilities
│       ├── components/
│       ├── types/
│       ├── constants/
│       └── utils/
└── lib/                          # Configuration
    ├── axios-client.ts           # Axios setup
    ├── react-query.ts            # React Query setup
    └── utils.ts
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ph-healthcare-frontend
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Setup environment variables**
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

4. **Run the development server**
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Key Components

### Shared Components
- **Navbar**: Navigation with mobile menu
- **Footer**: Footer with links and contact info
- **StatCard**: Reusable statistics display card

### Doctor Features
- **DoctorCard**: Doctor profile card with quick info
- **DoctorFilters**: Advanced filtering (specialty, gender, price range)
- **FeaturedDoctorsCarousel**: Carousel for featured doctors

### Authentication
- **RoleTab**: Role switcher (Patient/Doctor)
- **SignupForm**: Comprehensive signup form with validation
- **Auth Page**: Beautiful authentication page with split layout

## API Integration

The frontend is designed to work with a backend API. Update the `NEXT_PUBLIC_API_URL` environment variable to point to your backend server.

### Expected API Endpoints

- `GET /api/doctors` - List doctors with filtering
- `GET /api/doctors/:id` - Get doctor details
- `POST /api/auth/signup` - User signup
- `POST /api/auth/login` - User login
- `POST /api/appointments` - Create appointment

See the `features/shared/constants/index.ts` for all defined endpoints.

## Customization

### Theme Colors

Update the CSS variables in `app/globals.css`:
- Primary color: `--primary`
- Secondary color: `--secondary`
- Background: `--background`
- Foreground: `--foreground`

### Fonts

The project uses Inter font from Google Fonts. Customize fonts in `app/layout.tsx` and `tailwind.config.ts`.

## Development Guidelines

### Creating New Features

1. Create a feature folder under `features/`
2. Structure: `components/`, `hooks/`, `services/`, `validations/`
3. Use TypeScript for type safety
4. Export types from `types/index.ts`
5. Use React Query for server state
6. Add Zod validation for forms

### Form Handling

Use React Hook Form + Zod for all forms:
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField } from '@/components/ui/form'
```

### Animations

Use Framer Motion for animations:
```typescript
import { motion } from 'framer-motion'
<motion.div animate={{ opacity: 1 }} />
```

## Building for Production

```bash
pnpm build
pnpm start
```

## Performance Optimizations

- Next.js Image Optimization
- React Query caching strategy
- Code splitting with dynamic imports
- Lazy loading components
- Production build with turbopack

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- [ ] Payment integration (JazzCash, Easypaisa)
- [ ] Video consultation feature
- [ ] Medical records management
- [ ] Prescription system
- [ ] Appointment reminders via SMS/Email
- [ ] Doctor dashboard for scheduling
- [ ] Admin panel for moderation
- [ ] Multi-language support

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

All rights reserved.

## Support

For issues or questions, please open an issue in the repository or contact support@phealthcare.com

## Deployment

### Vercel (Recommended)

```bash
vercel
```

### Other Platforms

Follow the Next.js deployment guide for your platform.

---

Built with ❤️ for better healthcare access.
