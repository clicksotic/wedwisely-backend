# WedWisely Backend

A Node.js REST API backend for the WedWisely wedding planning application, built with Express.js and MongoDB.

## 🚀 Features

- **Express.js** - Fast, unopinionated web framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **Environment-based Configuration** - Separate configs for local, development, and production
- **Docker Support** - Easy containerized development environment
- **CORS Configuration** - Cross-origin resource sharing support
- **Health Checks** - Database and API health monitoring
- **Graceful Shutdown** - Proper cleanup on application termination

## 📁 Project Structure

```
├── config/                 # Configuration files
│   ├── database.js        # Database connection and management
│   ├── index.js           # Main configuration loader
│   └── environments/      # Environment-specific configs
│       ├── local.js       # Local development settings
│       ├── development.js # Development environment
│       └── production.js  # Production environment
├── mongo-init/            # MongoDB initialization scripts
│   └── init.js           # Database setup script
├── scripts/               # Utility scripts
│   └── db-status.js      # Database status checker
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── docker-compose.yml     # Docker services configuration
├── env.example            # Environment variables template
└── README.md              # This file
```

## 🛠️ Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Docker** and **Docker Compose** (for containerized development)
- **MongoDB** (optional - can use Docker instead)

## 📦 Installation Guide

### Installing Docker and Docker Compose

#### Windows
1. **Download Docker Desktop:**
   - Go to [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
   - Download the installer for Windows
   - Run the installer and follow the setup wizard

2. **System Requirements:**
   - Windows 10/11 Pro, Enterprise, or Education (64-bit)
   - WSL 2 enabled (Windows Subsystem for Linux 2)
   - Virtualization enabled in BIOS

3. **Enable WSL 2 (if not already enabled):**
   ```powershell
   # Run as Administrator
   dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
   dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
   ```
   
   Set WSL 2 as default:
   ```powershell
   wsl --set-default-version 2
   ```

   Download and install [WSL 2 Linux kernel update](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi)
   
   

4. **Install Docker Desktop:**
   - Run the Docker Desktop installer
   - Restart your computer when prompted
   - Docker Compose comes included with Docker Desktop

#### macOS
1. **Download Docker Desktop:**
   - Go to [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)
   - Download for Intel chip or Apple Silicon
   - Run the installer and drag Docker to Applications

2. **System Requirements:**
   - macOS 10.15 or newer
   - At least 4GB of RAM

3. **Installation:**
   - Open Docker.dmg and drag Docker to Applications
   - Start Docker Desktop from Applications
   - Docker Compose comes included

#### Linux (Ubuntu/Debian)
1. **Install Docker Engine:**
   ```bash
   # Update package index
   sudo apt-get update
   
   # Install prerequisites
   sudo apt-get install ca-certificates curl gnupg lsb-release
   
   # Add Docker's official GPG key
   sudo mkdir -p /etc/apt/keyrings
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
   
   # Set up repository
   echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
   
   # Install Docker Engine
   sudo apt-get update
   sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
   ```

2. **Install Docker Compose:**
   ```bash
   # Docker Compose is included with Docker Engine on Linux
   # Verify installation
   docker compose version
   ```

3. **Add user to docker group (optional but recommended):**
   ```bash
   sudo usermod -aG docker $USER
   # Log out and back in for changes to take effect
   ```

4. **Start Docker service:**
   ```bash
   sudo systemctl start docker
   sudo systemctl enable docker
   ```

### Installing MongoDB Locally (Alternative to Docker)

#### Windows
1. **Download MongoDB Community Server:**
   - Go to [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Select "Windows" and download the MSI installer
   - Run the installer and follow the setup wizard

2. **Install MongoDB Compass (GUI):**
   - Download from [MongoDB Compass](https://www.mongodb.com/try/download/compass)
   - Install and connect to `mongodb://localhost:27017`

3. **Add MongoDB to PATH:**
   - MongoDB is typically installed to `C:\Program Files\MongoDB\Server\[version]\bin`
   - Add this path to your system's PATH environment variable

#### macOS
1. **Using Homebrew (recommended):**
   ```bash
   # Install Homebrew if you don't have it
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   
   # Install MongoDB
   brew tap mongodb/brew
   brew install mongodb-community
   
   # Start MongoDB service
   brew services start mongodb/brew/mongodb-community
   ```

2. **Manual Installation:**
   - Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Extract and move to `/usr/local/mongodb`
   - Add to PATH in `~/.zshrc` or `~/.bash_profile`

#### Linux (Ubuntu/Debian)
1. **Install MongoDB:**
   ```bash
   # Import MongoDB public GPG key
   wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
   
   # Create list file for MongoDB
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
   
   # Update package database
   sudo apt-get update
   
   # Install MongoDB
   sudo apt-get install -y mongodb-org
   
   # Start MongoDB service
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

### Verifying Installation

#### Docker and Docker Compose
```bash
# Check Docker version
docker --version

# Check Docker Compose version
docker compose version

# Test Docker installation
docker run hello-world
```

#### MongoDB (if installed locally)
```bash
# Check MongoDB version
mongod --version

# Connect to MongoDB shell
mongosh

# Or connect to specific database
mongosh "mongodb://admin:wedding123@localhost:27017/wedwisely-db?authSource=admin"
```

### Troubleshooting Installation

#### Docker Issues
- **Windows**: Ensure WSL 2 is enabled and virtualization is on in BIOS
- **macOS**: Check if Docker Desktop is running in Applications
- **Linux**: Ensure Docker service is running with `sudo systemctl status docker`

#### MongoDB Issues
- **Port conflicts**: Check if port 27017 is available with `netstat -an | grep 27017`
- **Permission errors**: Ensure proper file permissions for data directory
- **Service not starting**: Check logs with `sudo journalctl -u mongod`

## 🚀 Getting Started

### Option 1: Using Docker (Recommended for Development)

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd wedwisely-backend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your configuration if needed
   ```

4. **Start the application with Docker:**
   ```bash
   # Start MongoDB and mongo-express
   docker-compose up -d
   
   # Start the Node.js application
   npm run dev
   ```

5. **Access your services:**
   - **API Server**: http://localhost:3000
   - **MongoDB**: localhost:27017
   - **Mongo Express (DB UI)**: http://localhost:8081
     - Username: `admin`
     - Password: `wedding123`

### Option 2: Local MongoDB Installation

1. **Install MongoDB locally** and start the service

2. **Create database and user:**
   ```bash
   # Connect to MongoDB
   mongosh
   
   # Create database
   use wedwisely-db
   
   # Create admin user
   db.createUser({
     user: "admin",
     pwd: "wedding123",
     roles: ["readWrite", "dbAdmin"]
   })
   ```

3. **Start the application:**
   ```bash
   npm run dev
   ```

## 🔧 Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm run db:status` - Check database connection status

## 🌐 API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check (includes database status)
- `GET /api` - API information

## 🗄️ Database Configuration

### Default Database Settings
- **Database Name**: `wedwisely-db`
- **Username**: `admin`
- **Password**: `wedding123`
- **Port**: `27017`
- **Authentication Database**: `admin`

### Environment Variables
The application uses environment variables for configuration:

```bash
# Local Development
MONGODB_LOCAL_URI=mongodb://admin:wedding123@localhost:27017/wedwisely-db?authSource=admin

# Development Environment
MONGODB_DEV_URI=<your-dev-mongodb-uri>

# Production Environment
MONGODB_PROD_URI=<your-prod-mongodb-uri>
```

## 🔄 Resetting and Troubleshooting

### When Making Database Schema Changes

1. **Stop the application:**
   ```bash
   # If using Docker
   docker-compose down
   
   # Stop Node.js app (Ctrl+C)
   ```

2. **Reset MongoDB data:**
   ```bash
   # Remove Docker volumes (this will delete all data)
   docker-compose down -v
   
   # Start fresh
   docker-compose up -d
   ```

3. **Restart the application:**
   ```bash
   npm run dev
   ```

### When Making Configuration Changes

1. **Update configuration files** in `config/environments/`
2. **Restart the application** for changes to take effect
3. **Check database connection** using the health endpoint

### Database Connection Issues

1. **Check if MongoDB is running:**
   ```bash
   # If using Docker
   docker-compose ps
   
   # Check MongoDB logs
   docker-compose logs mongodb
   ```

2. **Verify connection string** in your environment configuration

3. **Test database connection:**
   ```bash
   npm run db:status
   ```

4. **Reset database connection:**
   ```bash
   # Stop the app and restart
   npm run dev
   ```

### Common Issues and Solutions

#### Issue: "MongoDB connection failed"
- **Solution**: Ensure MongoDB is running and credentials are correct
- **Check**: Verify username, password, and database name in config files

#### Issue: "Port already in use"
- **Solution**: Change the port in your environment configuration
- **Alternative**: Kill the process using the port
  ```bash
  # Find process using port 3000
  netstat -ano | findstr :3000
  # Kill the process (replace PID with actual process ID)
  taskkill /PID <PID> /F
  ```

#### Issue: "Authentication failed"
- **Solution**: Reset MongoDB and recreate user
  ```bash
  docker-compose down -v
  docker-compose up -d
  ```

## 🐳 Docker Commands Reference

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Stop and remove volumes (WARNING: deletes all data)
docker-compose down -v

# View logs
docker-compose logs -f mongodb
docker-compose logs -f mongo-express

# Restart specific service
docker-compose restart mongodb

# View running containers
docker-compose ps
```

## 🔍 Monitoring and Debugging

### Health Check
Monitor your application health:
```bash
curl http://localhost:3000/health
```

### Database Status
Check database connection status:
```bash
npm run db:status
```

### Logs
- **Application logs**: Check your terminal where `npm run dev` is running
- **MongoDB logs**: `docker-compose logs mongodb`
- **Mongo Express logs**: `docker-compose logs mongo-express`

## 🚀 Deployment

### Production Environment
1. Set `NODE_ENV=production`
2. Configure `MONGODB_PROD_URI` with your production MongoDB connection string
3. Use `npm start` instead of `npm run dev`
4. Ensure proper SSL/TLS configuration for production

### Environment Variables
Create a `.env` file with your production settings:
```bash
NODE_ENV=production
MONGODB_PROD_URI=mongodb://username:password@host:port/database
PROD_HOST=0.0.0.0
PROD_PORT=3000
```

## 📝 Development Workflow

1. **Make changes** to your code or configuration
2. **Test locally** using Docker environment
3. **Reset database** if schema changes are made
4. **Commit changes** to version control
5. **Deploy** to your target environment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the **MIT License**.

---

Happy coding! 🎉 

For support or questions, please check the issues section or create a new one. 