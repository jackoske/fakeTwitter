# Docker Setup Guide - Twitter Mock

## 🚀 **Quick Start**

### **1. Copy Environment File**
```bash
cp env.example .env
```

### **2. Edit Environment Variables**
```bash
# Edit .env file with your settings
nano .env
```

**Required changes:**
- Set `API_KEY` to a strong secret key
- Update `ALLOWED_ORIGINS` with your domain (for production)

### **3. Build and Run**
```bash
# Build and start all services
docker-compose up --build

# Or just Twitter services
docker-compose up --build twitter-api twitter-frontend
```

## 🌐 **Service URLs**

After starting the services:

- **Twitter Frontend**: http://localhost:3002
- **Twitter API**: http://localhost:8000
- **API Health Check**: http://localhost:8000/health
- **API Documentation**: http://localhost:8000/docs

## 🔧 **Environment Variables Explained**

### **Core Variables:**
- `API_KEY`: Secret key for API authentication
- `REACT_APP_API_URL`: URL where frontend can reach the API
- `ALLOWED_ORIGINS`: CORS allowed origins (comma-separated)
- `ENVIRONMENT`: Set to 'production' for live deployment

### **Docker Compose Variables:**
These are automatically set from the core variables:
- `TWITTER_API_KEY` = `${API_KEY}`
- `TWITTER_API_URL` = `${REACT_APP_API_URL}`
- `TWITTER_ALLOWED_ORIGINS` = `${ALLOWED_ORIGINS}`

## 🐳 **Docker Commands**

### **Build Services:**
```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build twitter-api
docker-compose build twitter-frontend
```

### **Run Services:**
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Start specific services
docker-compose up twitter-api twitter-frontend
```

### **View Logs:**
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs twitter-api
docker-compose logs twitter-frontend

# Follow logs
docker-compose logs -f twitter-frontend
```

### **Stop Services:**
```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## 🔍 **Troubleshooting**

### **Port Conflicts:**
If you get port conflicts, check:
- Port 3002 (Twitter Frontend)
- Port 8000 (Twitter API)

**Solution:** Update ports in docker-compose.yml or stop conflicting services.

### **Build Issues:**
```bash
# Clean build (no cache)
docker-compose build --no-cache

# Remove old images
docker system prune -a
```

### **Health Check Failures:**
```bash
# Check service status
docker-compose ps

# Check health status
docker-compose ps --format "table {{.Name}}\t{{.Status}}"
```

## 🛡️ **Security Notes**

### **For Development:**
- API key can be empty or simple
- CORS allows localhost
- No additional security needed

### **For Production:**
- Use strong, random API key
- Update CORS origins to your domain
- Consider using HTTPS
- Set `ENVIRONMENT=production`

## 📊 **Monitoring**

### **Health Checks:**
- API: http://localhost:8000/health
- Frontend: http://localhost:3002/health

### **Expected Health Response:**
```json
{
  "status": "healthy",
  "service": "Twitter API Mock",
  "data_loaded": true,
  "environment": "production"
}
```

## 🎯 **Production Deployment**

### **1. Update Environment:**
```bash
# Edit .env file
ENVIRONMENT=production
API_KEY=your-super-secret-key
ALLOWED_ORIGINS=https://yourdomain.com
REACT_APP_API_URL=https://your-api-domain.com
```

### **2. Deploy:**
```bash
# Build and deploy
docker-compose up --build -d

# Verify deployment
docker-compose ps
curl http://localhost:8000/health
```

### **3. Monitor:**
```bash
# Check logs
docker-compose logs -f

# Monitor resources
docker stats
```

## 📁 **File Structure**

```
/
├── docker-compose.yml          # Main compose file
├── .env                        # Environment variables (create from env.example)
├── env.example                 # Environment template
├── DOCKER_SETUP.md            # This guide
├── twitterapi/                 # API service
│   ├── Dockerfile
│   ├── main.py
│   └── ...
└── frontend/                   # Frontend service
    ├── Dockerfile
    ├── nginx.conf
    └── ...
```

## 🚀 **Ready to Deploy!**

Your Twitter mock is now ready for Docker deployment! The nginx-based frontend will serve your React app efficiently, and the FastAPI backend will handle all the Twitter API requests.

**Next steps:**
1. Copy `env.example` to `.env`
2. Set your API key
3. Run `docker-compose up --build`
4. Visit http://localhost:3002

Happy deploying! 🐳✨ 