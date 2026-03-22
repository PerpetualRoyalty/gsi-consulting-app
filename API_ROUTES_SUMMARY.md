# Next.js Consulting Platform API Routes

All API routes have been created using Next.js App Router with proper authentication, authorization, and error handling.

## Created Routes (15 total)

### Authentication
1. **POST /api/auth/register**
   - Register new users with email, password, name, company
   - Hashes password with bcryptjs
   - Creates user with CLIENT role
   - Returns: User data with success message

### Admin
2. **GET /api/admin/stats** (Admin only)
   - Fetch dashboard statistics
   - Returns: totalRevenue, activeClients, pendingAgreements, unreadMessages, recentPayments, recentActivity

### Clients
3. **GET /api/clients** (Admin only)
   - List all CLIENT users
   - Returns: Array of clients with email, name, company, dates

4. **POST /api/clients** (Admin only)
   - Create new client without password
   - Returns: Created client with ID

### Agreements
5. **GET /api/agreements**
   - Admins: View all agreements
   - Clients: View only their own agreements
   - Returns: Agreements with client details

6. **POST /api/agreements** (Admin only)
   - Create new agreement for a client
   - Required: clientId, title, content, amount
   - Optional: description, startDate, endDate, type
   - Returns: Created agreement with client details

7. **GET /api/agreements/[id]**
   - Get single agreement
   - Admins: Any agreement
   - Clients: Only their own agreements
   - Returns: Agreement with client details

8. **PUT /api/agreements/[id]**
   - Update agreement fields
   - Can update: title, description, content, status, amount, dates
   - Returns: Updated agreement with client details

9. **POST /api/agreements/[id]/sign**
   - Sign agreement with base64 signature
   - Updates status to SIGNED
   - Sets signedAt timestamp
   - Returns: Signed agreement

### Payments
10. **GET /api/payments**
    - Admins: View all payments
    - Clients: View payments for their agreements only
    - Returns: Payments with agreement and client details

11. **POST /api/payments** (Admin only)
    - Create payment record
    - Required: agreementId, amount
    - Optional: paymentMethod, status, stripePaymentIntentId
    - Returns: Created payment record

12. **POST /api/payments/create-checkout**
    - Create Stripe checkout session
    - Required: agreementId, amount
    - Returns: sessionId and checkout URL

13. **POST /api/payments/create-subscription**
    - Create Stripe subscription for recurring retainers
    - Required: agreementId, priceId
    - Creates/retrieves Stripe customer
    - Returns: subscriptionId and clientSecret

### Webhooks
14. **POST /api/webhooks/stripe**
    - Stripe webhook handler (force-dynamic)
    - Handles: checkout.session.completed, payment_intent.succeeded, invoice.paid
    - Verifies signature, updates payment records
    - Returns: { success: true, received: true }

### Messages
15. **GET /api/messages**
    - Get messages between current user and others
    - Optional query param: userId (get conversation with specific user)
    - Marks retrieved messages as read
    - Returns: Array of messages with sender/recipient details

16. **POST /api/messages**
    - Send message to another user
    - Required: recipientId, content
    - Returns: Created message with sender/recipient details

17. **GET /api/messages/unread**
    - Get count of unread messages for current user
    - Returns: { success: true, unreadCount: number }

### Documents
18. **GET /api/documents**
    - Admins: View all documents
    - Clients: View only their own documents
    - Returns: Array of documents with metadata

19. **POST /api/documents**
    - Upload document with multipart form data
    - Required fields: file, title
    - Optional: agreementId
    - Saves to public/uploads/documents/
    - Returns: Document record with metadata

20. **GET /api/documents/[id]**
    - Download document file
    - Admins: Any document
    - Clients: Only their own documents
    - Returns: File with appropriate headers

21. **DELETE /api/documents/[id]**
    - Delete document and file
    - Admins: Any document
    - Clients: Only their own documents
    - Deletes from filesystem and database
    - Returns: Success message

### Profile
22. **GET /api/profile**
    - Get current authenticated user profile
    - Returns: User data (without password)

23. **PUT /api/profile**
    - Update user profile
    - Can update: name, company, phone
    - Can change password with currentPassword verification
    - Returns: Updated user data

## Security Features

- NextAuth session verification on all routes
- Role-based access control (ADMIN vs CLIENT)
- Authorization checks for resource ownership
- Password hashing with bcryptjs
- Stripe webhook signature verification
- Environment variables for sensitive data
- Try-catch error handling on all routes
- Appropriate HTTP status codes (400, 401, 403, 404, 409, 500)

## Required Environment Variables

```
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_URL
```

## Database Models Expected

The routes assume these Prisma models exist:
- User (id, email, password, name, role, company, phone, stripeCustomerId)
- Agreement (id, clientId, title, description, content, amount, status, signedAt, signatureData, startDate, endDate, type)
- Payment (id, agreementId, amount, paymentMethod, status, stripePaymentIntentId)
- Message (id, senderId, recipientId, content, isRead, createdAt)
- Document (id, userId, title, filename, filesize, mimetype, agreementId)

## Usage Notes

1. All routes use NextResponse.json() for consistent JSON responses
2. Authentication is checked first on all routes
3. Authorization checks role before allowing access
4. File uploads are saved to public/uploads/documents/
5. Timestamps use new Date() for consistency
6. Stripe operations require valid Stripe API keys
7. Passwords are never returned in API responses
