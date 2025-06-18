# Security & Abuse Protection Guide

## Overview
This guide explains the multiple layers of protection implemented to prevent API abuse and ensure secure operation.

## Protection Layers

### 1. API-Level Protection (FastAPI)

#### Rate Limiting
- **Individual Tweet Endpoint**: 30 requests per minute per IP
- **Tweets List Endpoint**: 60 requests per minute per IP
- **Health Endpoint**: No rate limiting (for monitoring)

#### Abuse Detection
- **Request Pattern Analysis**: Detects rapid repeated requests
- **IP Blocking**: Automatically blocks abusive IPs
- **Request Counting**: Tracks requests per IP in 1-minute windows

#### Limits
- **Maximum Requests**: 100 requests per minute per IP
- **Endpoint-Specific**: 30 requests per minute to same endpoint
- **Automatic Blocking**: IPs exceeding limits are blocked

### 2. Frontend Protection (React)

#### Request Throttling
- **Minimum Delay**: 1 second between API requests
- **Automatic Queuing**: Requests are queued if sent too quickly

#### Caching
- **Cache Duration**: 5 minutes for API responses
- **Automatic Cache**: Reduces redundant API calls
- **Cache Clearing**: Manual cache clearing available

#### Error Handling
- **Rate Limit Detection**: Shows warnings for 429 errors
- **Graceful Degradation**: Continues working with cached data

### 3. Web Server Protection (Nginx)

#### Rate Limiting Zones
```nginx
# API endpoints: 10 requests per second
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

# Health endpoint: 30 requests per second
limit_req_zone $binary_remote_addr zone=health:10m rate=30r/s;
```

#### Burst Handling
- **API Endpoints**: 20 requests burst allowed
- **Health Endpoint**: 50 requests burst allowed
- **No Delay**: Burst requests are processed immediately

#### Security Headers
- **Origin Validation**: Only allows requests from authorized domains
- **User Agent Blocking**: Blocks known bots and scrapers
- **CORS Protection**: Proper CORS headers for authorized origins

## Configuration

### Environment Variables
```env
# API Configuration
ENVIRONMENT=production
API_KEY=your-secret-api-key

# CORS Configuration
ALLOWED_ORIGINS=https://fake-twitter.jackskehan.tech,http://localhost:3002
```

### Rate Limiting Settings
```python
# API Rate Limits
TWEET_ENDPOINT_LIMIT = "30/minute"
TWEETS_LIST_LIMIT = "60/minute"
MAX_REQUESTS_PER_MINUTE = 100
MAX_REQUESTS_PER_ENDPOINT = 30

# Frontend Throttling
REQUEST_DELAY = 1000  # 1 second
CACHE_DURATION = 5 * 60 * 1000  # 5 minutes
```

## Monitoring & Debugging

### API Debug Endpoint
```bash
# Check current configuration
curl https://xapi.jackskehan.tech/debug
```

### Health Monitoring
```bash
# Check API health
curl https://xapi.jackskehan.tech/health
```

### Rate Limit Testing
```bash
# Test rate limiting (will get 429 after limits)
for i in {1..35}; do
  curl -H "Authorization: Bearer your-api-key" \
       https://xapi.jackskehan.tech/2/tweet/1203021031201234032
  sleep 0.1
done
```

## Security Best Practices

### 1. API Key Management
- ✅ Use strong, unique API keys
- ✅ Rotate keys regularly
- ✅ Never expose keys in client-side code
- ✅ Use environment variables

### 2. CORS Configuration
- ✅ Only allow specific origins
- ✅ Use HTTPS in production
- ✅ Validate Origin headers

### 3. Rate Limiting
- ✅ Implement multiple layers
- ✅ Use appropriate limits for endpoints
- ✅ Monitor and adjust based on usage

### 4. Monitoring
- ✅ Log all requests
- ✅ Monitor for abuse patterns
- ✅ Set up alerts for unusual activity

## Troubleshooting

### Common Issues

#### Rate Limit Exceeded (429)
```bash
# Check current limits
curl -I https://xapi.jackskehan.tech/tweets

# Wait and retry
sleep 60
curl https://xapi.jackskehan.tech/tweets
```

#### CORS Errors
```bash
# Check CORS configuration
curl -H "Origin: https://fake-twitter.jackskehan.tech" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     https://xapi.jackskehan.tech/tweets
```

#### IP Blocked
```bash
# Check if IP is blocked (will return 429)
curl https://xapi.jackskehan.tech/debug

# Wait for block to expire (usually 1 hour)
# Or contact administrator to unblock
```

### Debug Commands

#### Check API Status
```bash
# Health check
curl https://xapi.jackskehan.tech/health

# Debug info
curl https://xapi.jackskehan.tech/debug

# Test with API key
curl -H "Authorization: Bearer your-api-key" \
     https://xapi.jackskehan.tech/tweets
```

#### Check Nginx Status
```bash
# Test nginx configuration
sudo nginx -t

# Check nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

#### Check Docker Services
```bash
# Service status
docker-compose ps

# Service logs
docker-compose logs twitter-api
docker-compose logs twitter-frontend
```

## Advanced Configuration

### Redis for Rate Limiting (Production)
For production environments, consider using Redis for rate limiting:

```python
# Install redis
pip install redis

# Configure Redis
import redis
redis_client = redis.Redis(host='localhost', port=6379, db=0)

# Use Redis for rate limiting
limiter = Limiter(key_func=get_remote_address, storage_uri="redis://localhost:6379")
```

### Cloudflare Protection
For additional protection, consider using Cloudflare:

1. **DDoS Protection**: Built-in DDoS mitigation
2. **Rate Limiting**: Additional rate limiting rules
3. **Bot Protection**: Advanced bot detection
4. **WAF**: Web Application Firewall

### Monitoring Setup
```bash
# Set up monitoring with Prometheus/Grafana
# Monitor request rates, error rates, and response times
# Set up alerts for unusual patterns
```

## Emergency Procedures

### If Under Attack
1. **Immediate Actions**:
   - Check logs for attack patterns
   - Temporarily block suspicious IPs
   - Increase rate limiting temporarily

2. **Investigation**:
   - Analyze request patterns
   - Identify attack source
   - Document incident

3. **Recovery**:
   - Implement additional protections
   - Monitor for continued attacks
   - Update security measures

### Contact Information
- **Emergency**: [Your contact info]
- **Monitoring**: [Monitoring system URL]
- **Documentation**: [Security docs URL]

## Compliance

### GDPR Considerations
- ✅ Log only necessary data
- ✅ Implement data retention policies
- ✅ Provide data deletion capabilities

### Security Standards
- ✅ Follow OWASP guidelines
- ✅ Implement proper authentication
- ✅ Use HTTPS everywhere
- ✅ Regular security audits

This multi-layered approach ensures your API is protected against abuse while maintaining good performance for legitimate users. 