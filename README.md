# JWT Login Project

A secure authentication system built with Node.js, Express, and JWT tokens featuring comprehensive security middleware and user management.

## 🚀 Features

### 🔐 Authentication & Security
- **JWT Token Authentication** with access and refresh tokens
- **Password Encryption** using bcrypt with configurable salt rounds
- **Token Blacklisting** for secure logout functionality
- **Rate Limiting** with different limits per endpoint
- **Input Sanitization** against XSS attacks
- **Schema Validation** using AJV for request data
- **Security Headers** via Helmet middleware
- **Password Strength Validation** with customizable rules

### 👥 User Management
- **User Registration** with validation
- **User Authentication** with secure password verification
- **User Repository Pattern** for data management
- **In-Memory User Storage** with JSON file initialization
- **Password Hashing** on user creation and file loading

### 🛡️ Security Middleware
- **Input Validation** against dangerous patterns
- **XSS Protection** with content sanitization
- **CORS Protection** with configurable origins
- **Request Size Limiting** to prevent abuse
- **Content Security Policy** headers

### 📱 Frontend
- **Responsive Login Page** with Bootstrap 5
- **Real-time User Display** after successful login
- **Error Handling** with detailed validation messages
- **AJAX Authentication** with token management

## 🛠️ Technologies Used

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **bcrypt** - Password hashing library
- **jsonwebtoken** - JWT token generation and verification
- **express-rate-limit** - Rate limiting middleware
- **helmet** - Security headers middleware
- **cors** - Cross-Origin Resource Sharing
- **ajv** - JSON Schema validation
- **xss** - XSS sanitization library
- **dotenv** - Environment variable management

### Frontend
- **Bootstrap 5** - CSS framework for responsive design
- **Vanilla JavaScript** - For AJAX requests and DOM manipulation
- **HTML5** - Semantic markup
- **CSS3** - Custom styling

### Architecture Patterns
- **Repository Pattern** - Data access abstraction
- **Service Layer Pattern** - Business logic separation
- **Middleware Pattern** - Request/response processing
- **MVC Pattern** - Model-View-Controller architecture

## 📁 Project Structure

```
jwt-login-project/
├── config/
│   └── index.js                 # Configuration management
├── controllers/
│   └── user.controller.js       # User request handlers
├── data/
│   └── users.json              # User data storage
├── HTML/
│   └── login.html              # Login page template
├── middleware/
│   ├── auth.js                 # Authentication middleware
│   ├── index.js                # Middleware exports
│   ├── rateLimiter.js          # Rate limiting configuration
│   ├── security.js             # Security middleware
│   └── validation.js           # Input validation schemas
├── repositories/
│   └── userRepository.js       # Data access layer
├── routes/
│   └── user.routes.js          # User route definitions
├── services/
│   ├── jwtService.js           # JWT token management
│   ├── passwordService.js      # Password operations
│   └── userService.js          # User business logic
├── utils/
│   └── passwordService.js      # Password utilities
├── .env.example                # Environment variables template
├── package.json                # Dependencies and scripts
├── routes.js                   # Route centralization
└── server.js                   # Application entry point
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jwt-login-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=3000
   JWT_SECRET=your-super-secret-jwt-key
   JWT_REFRESH_SECRET=your-refresh-secret-key
   BCRYPT_ROUNDS=12
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Login page: `http://localhost:3000/api/users/login`
   - API base: `http://localhost:3000/api`

## 📋 API Endpoints

### Authentication
- `GET /api/users/login` - Display login page
- `POST /api/users/login` - Authenticate user
- `POST /api/users/register` - Register new user
- `POST /api/users/logout` - Logout user (requires auth)

### User Management
- `GET /api/users/all` - Get all users (no auth required)
- `GET /api/users/` - Get all users (requires authentication)

## 🔧 Configuration

### Rate Limiting
- **General requests**: 100 requests per 15 minutes
- **Login attempts**: 5 attempts per 15 minutes
- **Strict endpoints**: 10 requests per minute

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%*?&)

### JWT Configuration
- **Access token expiry**: 15 minutes (configurable)
- **Refresh token expiry**: 7 days (configurable)
- **Token blacklisting**: Supported for secure logout

## 🧪 Testing

### Default Users
The system comes with pre-configured test users:

| Username | Password | Email |
|----------|----------|-------|
| admin123 | AdminPass123! | admin@company.com |
| john_doe | SecurePass456! | john.doe@email.com |
| jane_smith | StrongPass789! | jane.smith@email.com |
| demo_user | DemoPass123! | demo@example.com |
| test_admin | TestAdmin456! | test.admin@company.com |

### Manual Testing
1. Navigate to the login page
2. Use any of the test credentials above
3. Upon successful login, view the user list
4. Test rate limiting by making multiple rapid requests

## 🛡️ Security Features

### Input Validation
- **JSON Schema validation** for all requests
- **XSS protection** with input sanitization
- **SQL injection prevention** through parameterized queries
- **CSRF protection** via security headers

### Authentication Security
- **Password hashing** with bcrypt and salt
- **JWT token rotation** with refresh tokens
- **Token blacklisting** for secure logout
- **Rate limiting** to prevent brute force attacks

### Headers Security
- **Content Security Policy** (CSP)
- **X-Frame-Options** to prevent clickjacking
- **X-XSS-Protection** browser XSS filter
- **X-Content-Type-Options** MIME sniffing prevention

## 🔄 Development

### Available Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

### Environment Variables
```env
# Server Configuration
NODE_ENV=development|production
PORT=3000

# JWT Configuration
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Password Configuration
BCRYPT_ROUNDS=12

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

## 📈 Future Enhancements

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Email verification system
- [ ] Two-factor authentication (2FA)
- [ ] Role-based access control (RBAC)
- [ ] Password reset functionality
- [ ] Session management
- [ ] API documentation with Swagger
- [ ] Unit and integration tests
- [ ] Docker containerization
- [ ] CI/CD pipeline setup

