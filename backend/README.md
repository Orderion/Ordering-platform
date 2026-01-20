# Backend API

Express.js backend for the Website Ordering Platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in your values

3. Set up database:
```bash
npx prisma migrate dev
npx prisma generate
```

4. Start development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `GET /auth/github` - Initiate GitHub OAuth
- `GET /auth/github/callback` - GitHub OAuth callback
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout

### Orders
- `POST /orders` - Create order (guest or authenticated)
- `GET /orders/me` - Get user's orders (authenticated)
- `GET /orders/:id` - Get single order (authenticated)

### Payments
- `POST /payments/paystack` - Initialize Paystack payment
- `POST /payments/stripe` - Initialize Stripe payment
- `POST /payments/webhooks/paystack` - Paystack webhook
- `POST /payments/webhooks/stripe` - Stripe webhook

### Admin
- `GET /admin/users` - Get all users
- `GET /admin/orders` - Get all orders
- `GET /admin/stats` - Get dashboard stats
- `PUT /admin/orders/:id/status` - Update order status

## Database

Uses Prisma ORM with PostgreSQL. Run migrations with:
```bash
npx prisma migrate dev
```

View database with Prisma Studio:
```bash
npx prisma studio
```
