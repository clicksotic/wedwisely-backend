# WedWisely - Wedding Planning Backend API

A robust Node.js/Express backend API built for the WedWisely wedding planning platform, providing comprehensive wedding management services and APIs.

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git**

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd wedwisely_backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **For development with auto-restart:**
   ```bash
   npm run dev
   ```

## 📋 Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm test` - Run test suite
- `npm run lint` - Run ESLint for code quality
- `npm run build` - Build the application for production

## 🏗️ Project Structure

```
wedwisely_backend/
├── server.js              # Main server entry point
├── package.json           # Dependencies and scripts
├── package-lock.json      # Locked dependency versions
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore patterns
├── README.md             # This file
├── src/                  # Source code directory
│   ├── routes/           # API route definitions
│   ├── controllers/      # Business logic controllers
│   ├── models/           # Data models
│   ├── middleware/       # Custom middleware
│   └── utils/            # Utility functions
├── config/               # Configuration files
├── tests/                # Test files
└── docs/                 # API documentation
```

## 🛠️ Technology Stack

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **CORS** - Cross-origin resource sharing
- **Path** - File path utilities
- **Nodemon** - Development server with auto-restart

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:3000
```

### Server Configuration
The server is configured through:
- `server.js` - Main server setup and middleware
- Environment variables for configuration
- CORS settings for cross-origin requests

## 📱 API Endpoints

### Base URL: `http://localhost:3000`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Welcome message and server status |
| `/health` | GET | Health check endpoint |
| `/api/weddings` | GET | Get all weddings |
| `/api/weddings` | POST | Create new wedding |
| `/api/weddings/:id` | GET | Get wedding by ID |
| `/api/weddings/:id` | PUT | Update wedding |
| `/api/weddings/:id` | DELETE | Delete wedding |

## 🚀 Features

- **RESTful API** - Clean and intuitive API design
- **CORS Support** - Cross-origin request handling
- **Health Monitoring** - Built-in health check endpoints
- **Static File Serving** - Serve static assets
- **JSON Response** - Consistent JSON API responses
- **Error Handling** - Comprehensive error management
- **Logging** - Detailed server logging

## 🔒 Security Features

- CORS configuration for cross-origin requests
- Input validation and sanitization
- Rate limiting (planned)
- JWT authentication (planned)
- Request logging and monitoring

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📦 Building for Production

```bash
# Install production dependencies
npm ci --only=production

# Start production server
npm start

# Using PM2 for process management
pm2 start server.js --name "wedwisely-backend"
```

## 🐳 Docker Support

```bash
# Build Docker image
docker build -t wedwisely-backend .

# Run Docker container
docker run -p 3000:3000 wedwisely-backend
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and API docs
- **Issues**: Open an issue in the repository
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact the development team

## 🔗 Links

- **Frontend Repository**: [WedWisely Frontend](link-to-frontend)
- **API Documentation**: [API Docs](link-to-api-docs)
- **Project Website**: [WedWisely](link-to-website)
- **Issue Tracker**: [GitHub Issues](link-to-issues)

---

<div align="center">
  <p>Made with ❤️ by the WedWisely Team</p>
  <p>Building the future of wedding planning, one API at a time</p>
</div> 