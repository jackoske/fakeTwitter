# Twitter Mock - Deployment Guide

## Overview
This guide covers deploying the Twitter Mock application with both API backend and frontend services.

## Architecture
- **API Backend**: FastAPI service running on port 8000
- **Frontend**: React app served by nginx on port 3002
- **External API**: `https://xapi.jackskehan.tech`
- **Frontend Domain**: `https://fake-twitter.jackskehan.tech`

## Prerequisites
- Docker and Docker Compose installed
- Domain names configured and pointing to your server
- SSL certificates configured (recommended for production)

## Configuration

### 1. Environment Setup
Copy the example environment file and configure it:

```bash
cp env.example .env
```

Edit `.env` with your actual values:

```env
# API Configuration
ENVIRONMENT=production
API_KEY=your-actual-api-key-here

# Frontend Configuration  
REACT_APP_API_URL=https://xapi.jackskehan.tech
REACT_APP_API_KEY=your-actual-api-key-here

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3002,http://127.0.0.1:3002,https://fake-twitter.jackskehan.tech
```

### 2. Domain Configuration
Ensure your domains are properly configured:

- `xapi.jackskehan.tech` → Points to your API server (port 8000)
- `fake-twitter.jackskehan.tech` → Points to your frontend server (port 3002)

### 3. SSL/HTTPS Setup
For production, configure SSL certificates for both domains:

```bash
# Using Let's Encrypt with certbot
sudo certbot --nginx -d xapi.jackskehan.tech
sudo certbot --nginx -d fake-twitter.jackskehan.tech
```

## Deployment Options

### Option 1: Docker Compose (Recommended)
Deploy both services using Docker Compose:

```bash
# Build and start services
docker-compose up --build -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### Option 2: Separate Deployments
Deploy API and frontend on different servers:

#### API Deployment
```bash
cd twitterapi
docker build -t twitter-api .
docker run -d -p 8000:8000 \
  -e ENVIRONMENT=production \
  -e API_KEY=your-api-key \
  -e ALLOWED_ORIGINS=https://fake-twitter.jackskehan.tech \
  --name twitter-api twitter-api
```

#### Frontend Deployment
```bash
cd frontend
docker build -t twitter-frontend .
docker run -d -p 3002:3000 \
  -e REACT_APP_API_URL=https://xapi.jackskehan.tech \
  -e REACT_APP_API_KEY=your-api-key \
  --name twitter-frontend twitter-frontend
```

## Reverse Proxy Configuration

### Nginx Configuration for API
Create `/etc/nginx/sites-available/xapi.jackskehan.tech`:

```nginx
server {
    listen 80;
    server_name xapi.jackskehan.tech;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name xapi.jackskehan.tech;
    
    ssl_certificate /etc/letsencrypt/live/xapi.jackskehan.tech/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/xapi.jackskehan.tech/privkey.pem;
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Nginx Configuration for Frontend
Create `/etc/nginx/sites-available/fake-twitter.jackskehan.tech`:

```nginx
server {
    listen 80;
    server_name fake-twitter.jackskehan.tech;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name fake-twitter.jackskehan.tech;
    
    ssl_certificate /etc/letsencrypt/live/fake-twitter.jackskehan.tech/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/fake-twitter.jackskehan.tech/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the sites:
```bash
sudo ln -s /etc/nginx/sites-available/xapi.jackskehan.tech /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/fake-twitter.jackskehan.tech /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Health Checks

### API Health Check
```bash
curl https://xapi.jackskehan.tech/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "Twitter API Mock",
  "data_loaded": true,
  "environment": "production"
}
```

### Frontend Health Check
```bash
curl https://fake-twitter.jackskehan.tech/health
```

Expected response:
```
healthy
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `ALLOWED_ORIGINS` includes your frontend domain
2. **API Connection Failed**: Check if the API URL is correct in frontend environment
3. **SSL Certificate Issues**: Verify certificates are properly installed and nginx is configured
4. **Port Conflicts**: Ensure ports 8000 and 3002 are not used by other services

### Debug Commands

```bash
# Check Docker containers
docker-compose ps
docker-compose logs twitter-api
docker-compose logs twitter-frontend

# Check nginx status
sudo systemctl status nginx
sudo nginx -t

# Check SSL certificates
sudo certbot certificates

# Test API endpoints
curl -H "Authorization: Bearer your-api-key" https://xapi.jackskehan.tech/2/tweet/1203021031201234032
```

## Monitoring

### Log Monitoring
```bash
# Follow API logs
docker-compose logs -f twitter-api

# Follow frontend logs
docker-compose logs -f twitter-frontend

# Check nginx access logs
sudo tail -f /var/log/nginx/access.log
```

### Performance Monitoring
- Monitor container resource usage: `docker stats`
- Check nginx performance: `nginx -V`
- Monitor SSL certificate expiration: `certbot certificates`

## Security Considerations

1. **API Key**: Use strong, unique API keys in production
2. **CORS**: Restrict allowed origins to your actual domains
3. **SSL**: Always use HTTPS in production
4. **Firewall**: Configure firewall to only allow necessary ports
5. **Updates**: Regularly update Docker images and dependencies

## Backup and Recovery

### Backup Configuration
```bash
# Backup environment files
cp .env .env.backup

# Backup nginx configurations
sudo cp /etc/nginx/sites-available/xapi.jackskehan.tech /etc/nginx/sites-available/xapi.jackskehan.tech.backup
sudo cp /etc/nginx/sites-available/fake-twitter.jackskehan.tech /etc/nginx/sites-available/fake-twitter.jackskehan.tech.backup
```

### Recovery
```bash
# Restore from backup
cp .env.backup .env
docker-compose down
docker-compose up --build -d
``` 