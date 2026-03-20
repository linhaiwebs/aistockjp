FROM php:8.2-fpm

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    libcurl4-openssl-dev \
    pkg-config \
    libssl-dev \
    libonig-dev \
    procps \
    && docker-php-ext-install mbstring \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create log directory for PHP
RUN mkdir -p /var/log/php && chmod 777 /var/log/php

# Copy custom PHP configuration
COPY php.ini /usr/local/etc/php/conf.d/custom.ini

# Configure PHP-FPM to listen on TCP
RUN echo '[www]' > /usr/local/etc/php-fpm.d/zz-docker.conf && \
    echo 'listen = 0.0.0.0:9000' >> /usr/local/etc/php-fpm.d/zz-docker.conf && \
    echo 'pm = dynamic' >> /usr/local/etc/php-fpm.d/zz-docker.conf && \
    echo 'pm.max_children = 10' >> /usr/local/etc/php-fpm.d/zz-docker.conf && \
    echo 'pm.start_servers = 3' >> /usr/local/etc/php-fpm.d/zz-docker.conf && \
    echo 'pm.min_spare_servers = 2' >> /usr/local/etc/php-fpm.d/zz-docker.conf && \
    echo 'pm.max_spare_servers = 5' >> /usr/local/etc/php-fpm.d/zz-docker.conf && \
    echo 'pm.max_requests = 500' >> /usr/local/etc/php-fpm.d/zz-docker.conf && \
    echo 'request_terminate_timeout = 300' >> /usr/local/etc/php-fpm.d/zz-docker.conf

WORKDIR /var/www/html

EXPOSE 9000

# Health check - verify PHP-FPM is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD pgrep php-fpm || exit 1

CMD ["php-fpm"]
