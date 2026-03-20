FROM php:8.2-fpm

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    libcurl4-openssl-dev \
    pkg-config \
    libssl-dev \
    libonig-dev \
    procps \
    && docker-php-ext-install mbstring \
    && docker-php-ext-enable mbstring \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create log directory for PHP
RUN mkdir -p /var/log/php && chmod 777 /var/log/php

# Copy custom PHP configuration
COPY php.ini /usr/local/etc/php/conf.d/custom.ini

# Configure PHP-FPM to listen on TCP and set process manager
RUN sed -i 's/listen = .*/listen = 0.0.0.0:9000/' /usr/local/etc/php-fpm.d/www.conf && \
    sed -i 's/;listen.owner = .*/listen.owner = www-data/' /usr/local/etc/php-fpm.d/www.conf && \
    sed -i 's/;listen.group = .*/listen.group = www-data/' /usr/local/etc/php-fpm.d/www.conf && \
    sed -i 's/pm.max_children = .*/pm.max_children = 10/' /usr/local/etc/php-fpm.d/www.conf && \
    sed -i 's/pm.start_servers = .*/pm.start_servers = 3/' /usr/local/etc/php-fpm.d/www.conf && \
    sed -i 's/pm.min_spare_servers = .*/pm.min_spare_servers = 2/' /usr/local/etc/php-fpm.d/www.conf && \
    sed -i 's/pm.max_spare_servers = .*/pm.max_spare_servers = 5/' /usr/local/etc/php-fpm.d/www.conf && \
    sed -i 's/;pm.max_requests = .*/pm.max_requests = 500/' /usr/local/etc/php-fpm.d/www.conf && \
    sed -i 's/;request_terminate_timeout = .*/request_terminate_timeout = 300/' /usr/local/etc/php-fpm.d/www.conf && \
    php-fpm -t

WORKDIR /var/www/html

EXPOSE 9000

# Health check - verify PHP-FPM is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD pgrep php-fpm || exit 1

CMD ["php-fpm", "-F"]
