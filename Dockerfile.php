FROM php:8.2-fpm

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    libcurl4-openssl-dev \
    pkg-config \
    libssl-dev \
    libonig-dev \
    && docker-php-ext-install curl mbstring \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Configure PHP-FPM to listen on TCP
RUN echo '[www]' > /usr/local/etc/php-fpm.d/zz-docker.conf && \
    echo 'listen = 0.0.0.0:9000' >> /usr/local/etc/php-fpm.d/zz-docker.conf && \
    echo 'pm = dynamic' >> /usr/local/etc/php-fpm.d/zz-docker.conf && \
    echo 'pm.max_children = 5' >> /usr/local/etc/php-fpm.d/zz-docker.conf && \
    echo 'pm.start_servers = 2' >> /usr/local/etc/php-fpm.d/zz-docker.conf && \
    echo 'pm.min_spare_servers = 1' >> /usr/local/etc/php-fpm.d/zz-docker.conf && \
    echo 'pm.max_spare_servers = 3' >> /usr/local/etc/php-fpm.d/zz-docker.conf

WORKDIR /var/www/html

EXPOSE 9000

CMD ["php-fpm"]
