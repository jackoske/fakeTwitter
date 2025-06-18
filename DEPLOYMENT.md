# Deployment Guide - Twitter Mock API & Frontend

## 🚀 **Recommended Deployment Strategy**

### **Option 1: Cloudflare Tunnels (Recommended)**
This is the **safest and easiest** approach for your use case.

#### **Benefits:**
- ✅ **No server exposure** - Your API runs behind Cloudflare
- ✅ **Built-in DDoS protection**
- ✅ **SSL/TLS termination**
- ✅ **Rate limiting**
- ✅ **Bot protection**
- ✅ **Free tier available**

#### **Setup:**
1. Install Cloudflare Tunnel
2. Create tunnel to your local API
3. Deploy frontend to static hosting (Vercel, Netlify, etc.)
4. Configure CORS for your frontend domain

### **Option 2: Traditional VPS/Cloud**
If you need more control or have specific requirements.

## 🔒 **Security Configuration**

### **1. Environment Variables**

#### **API Server (.env file):**
```bash
# Production
ENVIRONMENT=production
API_KEY=your-super-secret-api-key-here
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Development
ENVIRONMENT=development
API_KEY=
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

#### **Frontend (.env file):**
```bash
# Production
REACT_APP_API_URL=https://your-api-domain.com
REACT_APP_API_KEY=your-super-secret-api-key-here

# Development
REACT_APP_API_URL=http://localhost:8000
REACT_APP_API_KEY=
```

### **2. CORS Configuration**

#### **Development (Current):**
```python
allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"]
allow_methods=["*"]
allow_headers=["*"]
```

#### **Production:**
```python
allow_origins=["https://yourdomain.com"]
allow_methods=["GET", "POST", "OPTIONS"]
allow_headers=["Authorization", "Content-Type"]
```

## 🌐 **Deployment Steps**

### **Step 1: API Server**

#### **With Cloudflare Tunnel:**
```bash
# Install cloudflared
# Create tunnel
cloudflared tunnel create twitter-mock-api

# Configure tunnel
# Run tunnel
cloudflared tunnel run twitter-mock-api
```

#### **With Traditional Hosting:**
```bash
# Set environment variables
export ENVIRONMENT=production
export API_KEY=your-secret-key
export ALLOWED_ORIGINS=https://yourdomain.com

# Run with gunicorn
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### **Step 2: Frontend**

#### **Build for Production:**
```bash
cd frontend
npm run build
```

#### **Deploy to Static Hosting:**
- **Vercel**: `vercel --prod`
- **Netlify**: `netlify deploy --prod`
- **GitHub Pages**: Push to gh-pages branch

## 🛡️ **Security Best Practices**

### **1. API Key Management**
- ✅ Use strong, random API keys
- ✅ Store keys in environment variables
- ✅ Never commit keys to version control
- ✅ Rotate keys regularly

### **2. CORS Policy**
- ✅ Only allow your frontend domain
- ✅ Limit HTTP methods to what you need
- ✅ Restrict headers to necessary ones

### **3. Rate Limiting**
- ✅ Implement rate limiting (Cloudflare provides this)
- ✅ Monitor for abuse
- ✅ Set reasonable limits

### **4. Input Validation**
- ✅ Validate all inputs
- ✅ Sanitize data
- ✅ Use proper error handling

## 📊 **Monitoring & Logging**

### **Health Checks:**
```bash
# Check API health
curl https://your-api-domain.com/health

# Expected response:
{
  "status": "healthy",
  "service": "Twitter API Mock",
  "data_loaded": true,
  "environment": "production"
}
```

### **Logging:**
- Monitor API access logs
- Set up error alerting
- Track performance metrics

## 🔧 **Troubleshooting**

### **Common Issues:**

#### **CORS Errors:**
- Check `ALLOWED_ORIGINS` configuration
- Verify frontend domain is included
- Test with browser dev tools

#### **API Key Issues:**
- Verify key is set in environment
- Check Authorization header format
- Test with curl: `curl -H "Authorization: Bearer YOUR_KEY" https://api.com/health`

#### **Cloudflare Tunnel Issues:**
- Check tunnel status: `cloudflared tunnel list`
- Verify tunnel is running
- Check Cloudflare dashboard

## 🎯 **Production Checklist**

- [ ] Environment variables configured
- [ ] API key set and tested
- [ ] CORS configured for production domain
- [ ] Frontend built and deployed
- [ ] SSL/TLS enabled
- [ ] Health checks passing
- [ ] Monitoring set up
- [ ] Error handling tested
- [ ] Rate limiting configured
- [ ] Backup strategy in place

## 💡 **Additional Recommendations**

### **For Development:**
- Keep current CORS settings
- No API key required
- Use localhost URLs

### **For Production:**
- Enable API key protection
- Restrict CORS to your domain
- Use HTTPS everywhere
- Set up monitoring
- Consider CDN for static assets

This setup gives you a secure, scalable deployment that's easy to maintain! 🚀 