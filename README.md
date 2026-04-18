# Passionfruit CRM - Admin Portal

A web-based CRM dashboard for Passionfruit Careers administrators to view analytics, manage users, jobs, and applications.

## Features

- 📊 **Dashboard Analytics** - Real-time metrics and growth charts
- 👥 **User Management** - Search, view, and manage all users
- 💼 **Jobs Management** - Monitor and manage all job postings
- 📈 **Analytics** - Detailed insights on applications, credits, and performance
- 🔒 **Admin-Only Access** - Secure authentication with admin role verification

## Setup

### 1. Install Dependencies

```bash
cd crm-portal
npm install
```

### 2. Environment Variables

Create a `.env` file in the `crm-portal` directory:

```env
VITE_API_URL=https://adequate-rejoicing-production-b4ba.up.railway.app
```

For local development:
```env
VITE_API_URL=http://localhost:3000
```

### 3. Make a User Admin

Before you can login, you need to promote a user to admin:

```bash
# From the backend directory
cd ../backend
npm run make-admin your-email@example.com
```

### 4. Run Development Server

```bash
npm run dev
```

The CRM will be available at `http://localhost:5173`

### 5. Login

- Navigate to `http://localhost:5173`
- Login with your admin credentials
- Access the full CRM dashboard

## Deployment

### Deploy to Railway (Subdomain)

1. **Build the CRM:**
```bash
npm run build
```

2. **Create a new Railway service:**
- Go to Railway dashboard
- Add new service → Static Site
- Connect to your GitHub repo
- Set root directory to `/crm-portal`
- Build command: `npm run build`
- Output directory: `dist`

3. **Add Custom Domain:**
- In Railway project settings → Domains
- Add custom domain: `crm.passionfruitcareers.com` (or your preferred subdomain)
- Update your DNS with the provided CNAME record

4. **Set Environment Variables in Railway:**
```
VITE_API_URL=https://adequate-rejoicing-production-b4ba.up.railway.app
```

## Project Structure

```
crm-portal/
├── src/
│   ├── components/
│   │   └── Layout.tsx          # Main layout with sidebar
│   ├── pages/
│   │   ├── Login.tsx           # Admin login
│   │   ├── Dashboard.tsx       # Main analytics dashboard
│   │   ├── Users.tsx           # User management
│   │   ├── Jobs.tsx            # Jobs management
│   │   └── Analytics.tsx       # Detailed analytics
│   ├── services/
│   │   └── api.ts              # API client
│   ├── styles/
│   │   ├── index.css           # Global styles
│   │   └── Login.css           # Login page styles
│   ├── App.tsx                 # Main app with routing
│   └── main.tsx                # Entry point
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```

## API Endpoints Used

All endpoints require `Authorization: Bearer <admin_token>` header:

- `GET /api/crm/analytics/dashboard` - Dashboard metrics
- `GET /api/crm/users` - List/search users
- `GET /api/crm/users/:id` - User details
- `GET /api/crm/jobs` - List/search jobs
- `GET /api/crm/analytics/applications` - Application analytics
- `GET /api/crm/analytics/credits` - Credits analytics
- `GET /api/crm/search` - Quick search

## Security

- Only users with `role='admin'` can access the CRM
- All API requests require authentication tokens
- Tokens are stored in localStorage and verified on each page load
- Automatic logout if admin status is revoked

## Support

For issues or questions, contact the development team.
