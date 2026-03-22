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



App name Blitz Analyzer ,

create admin dashbaord for blitz analyzer web app;
admin work fllows:
.(admin/dashboard/users) admin can browser all user and manage user status and delete user also with pagination view and local sort andd search ,

.(admin/dashboard/templates) there user view all resume templates;
.(admin/dashboard/templates/add) admin can add template from based ui based on this type under mention - must be match with types example full dynamic resume template builder never miss any feild or requrements 

export type FieldOperator =
  | "eq"
  | "neq"
  | "gt"
  | "lt"
  | "contains"
  | "notContains"
  | "empty"
  | "notEmpty";

export interface DynamicCondition {
  field: string;
  operator: FieldOperator;
  value: any;
}

export type DynamicFieldType =
  | "text"
  | "email"
  | "url"
  | "tel"
  | "number"
  | "textarea"
  | "richtext"
  | "date"
  | "checkbox"
  | "radio"
  | "select"
  | "multiselect"
  | "file"
  | "group"
  | "array";

export interface DynamicFieldValidation {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  message?: string;
}

export interface DynamicFieldUI {
  grid?: string;
  rows?: number;
  showCount?: boolean;
  options?: Array<string | { label: string; value: string }>;
  accept?: string;
  maxLength?: number;
}

export interface DynamicField {
  name: string;
  label: string;
  type: DynamicFieldType;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  multiple?: boolean;
  options?: Array<string | { label: string; value: string }>;
  validation?: DynamicFieldValidation;
  ui?: DynamicFieldUI;
  condition?: DynamicCondition;
  fields?: DynamicField[];
}

export interface DynamicSection {
  key: string;
  label: string;
  type: "object" | "array";
  order: number;
  required?: boolean;
  fields: DynamicField[];
  condition?: DynamicCondition;
  ui?: {
    columns?: number;
    description?: string;
  };
}

export interface ResumeTemplate {
  name: string;
  slug: string;
  isPremium: boolean;
  price?: number;
  htmlLayout?: string;
  sections?: DynamicSection[];
  resumeData?: Record<string, any>;
}


.admin profile

.admin can update or see pricing plans modal based ui for update and toast ui for success
export interface Pricing {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  credits: number;
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};
.admin can see all insight KPI REPORT IN OVERVIEW PAGE (TOALUSER,TOTAL REVINEW,TOTAL RESUME TEMPLATES, TOTAL USER CREATED RESUMES, AND GRAPH AND CHART ALSO AS WELL )
.addmin can see feedback request if admin click approve with modern ui;
.admin setting (chnage passsword, chnage photo,change info) logout,

--- layout ---


<div>
<!-- header -->
<header>
<div class=flex>
<sidebarleft>
<maincontent>right side</maincontent>
</div>
</div>

professonnal sass level dashboard ui left sidebar with nav links bottom user click to menu icon 
,right side maain content


. sidebar active links must be and modern professonal design


css colors 

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}

@layer base {
  :root {
    --background: 210 20% 98%;
    --foreground: 224 71% 4%;
    --card: 0 0% 100%;
    --card-foreground: 224 71% 4%;
    --popover: 0 0% 100%;
    --popover-foreground: 224 71% 4%;
    --primary: 221 83% 53%;
    --primary-foreground: 210 20% 98%;
    --secondary: 220 14% 96%;
    --secondary-foreground: 224 71% 4%;
    --muted: 220 14% 96%;
    --muted-foreground: 220 9% 46%;
    --accent: 220 14% 96%;
    --accent-foreground: 224 71% 4%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 98%;
    --border: 220 13% 91%;
    --input: 220 13% 91%;
    --ring: 221 83% 53%;
    --chart-1: 221 83% 53%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
    --radius: 0.625rem;
    --sidebar-background: 0 0% 100%;
    --sidebar-foreground: 224 71% 4%;
    --sidebar-primary: 221 83% 53%;
    --sidebar-primary-foreground: 210 20% 98%;
    --sidebar-accent: 220 14% 96%;
    --sidebar-accent-foreground: 221 83% 53%;
    --sidebar-border: 220 13% 91%;
    --sidebar-ring: 221 83% 53%;
  }
  .dark {
    --background: 224 71% 4%;
    --foreground: 210 20% 98%;
    --card: 223 47% 11%;
    --card-foreground: 210 20% 98%;
    --popover: 223 47% 11%;
    --popover-foreground: 210 20% 98%;
    --primary: 217 91% 60%;
    --primary-foreground: 224 71% 4%;
    --secondary: 223 47% 11%;
    --secondary-foreground: 210 20% 98%;
    --muted: 223 40% 18%;
    --muted-foreground: 218 11% 65%;
    --accent: 223 47% 11%;
    --accent-foreground: 210 20% 98%;
    --destructive: 0 63% 31%;
    --destructive-foreground: 0 0% 98%;
    --border: 223 40% 18%;
    --input: 223 40% 18%;
    --ring: 217 91% 60%;
    --chart-1: 217 91% 60%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
    --sidebar-background: 224 71% 4%;
    --sidebar-foreground: 210 20% 98%;
    --sidebar-primary: 217 91% 60%;
    --sidebar-primary-foreground: 224 71% 4%;
    --sidebar-accent: 223 47% 11%;
    --sidebar-accent-foreground: 217 91% 60%;
    --sidebar-border: 223 40% 18%;
    --sidebar-ring: 217 91% 60%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.3);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.5);
}



final output is 
.modern professonal sass product level tio notch ui alos responsive;
.full dynamic resume template builder form based ui must be modern and apply validation based on data have validation or not oky ,modern from ui ;
.both theme support ,
.use skelections  both theme support,
 again repait full sass level modern ui 
