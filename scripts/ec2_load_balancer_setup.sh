#!/bin/bash
set -e

echo "=========================================================="
echo " AWS LOAD BALANCER & EC2 APPLICATION DEPLOYMENT SCRIPT    "
echo "=========================================================="

APP_DIR="/home/ubuntu/myrepository"

# 1. Update Nginx configuration for AWS Load Balancer
echo "--> Configuring Nginx for AWS Load Balancer (ALB/NLB)..."

sudo tee /etc/nginx/conf.d/alb_forwarded_proto.conf > /dev/null << 'EOF'
# Detect forwarded protocol from AWS Load Balancer, fallback to local scheme
map $http_x_forwarded_proto $forwarded_proto {
    default $http_x_forwarded_proto;
    ''      $scheme;
}
EOF

sudo tee /etc/nginx/sites-available/roshspark > /dev/null << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    # Accept AWS Load Balancer DNS names, AWS domains, EC2 Public IP, and all hostnames
    server_name ~^.*\.elb\.amazonaws\.com$ 13.232.84.8 _;

    client_max_body_size 25M;

    # Restore real visitor IP addresses behind AWS ALB
    set_real_ip_from 172.31.0.0/16;
    set_real_ip_from 10.0.0.0/8;
    set_real_ip_from 192.168.0.0/16;
    real_ip_header X-Forwarded-For;
    real_ip_recursive on;

    # Dedicated AWS Load Balancer Health Check Endpoint
    location = /api/health {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $forwarded_proto;
        access_log off;
    }

    # Server-Sent Events (SSE) for Real-Time Match & Stadium Telemetry
    location /api/realtime {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Connection '';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $forwarded_proto;
        proxy_buffering off;
        proxy_cache off;
        chunked_transfer_encoding off;
        proxy_read_timeout 86400s;
    }

    # Main Application & API proxying
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $forwarded_proto;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Ensure site is enabled
sudo ln -sf /etc/nginx/sites-available/roshspark /etc/nginx/sites-enabled/roshspark

# Test Nginx syntax
sudo nginx -t
sudo systemctl reload nginx
echo "--> Nginx reloaded successfully!"

# 2. Build and restart Next.js application
cd "$APP_DIR"

echo "--> Building Next.js application for Load Balancer deployment..."
npm run build

echo "--> Restarting PM2 process..."
pm2 restart roshspark --update-env
pm2 save

echo "--> Verifying application endpoints..."
sleep 2

HEALTH_CHECK=$(curl -s http://127.0.0.1:3000/api/health)
echo "Local Health Check Response: $HEALTH_CHECK"

NGINX_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1/api/health)
echo "Nginx Port 80 Health Check HTTP Status: $NGINX_CHECK"

echo "=========================================================="
echo " DEPLOYMENT FOR LOAD BALANCER COMPLETED SUCCESSFULLY!     "
echo "=========================================================="
