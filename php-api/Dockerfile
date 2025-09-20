FROM php:8.2-fpm-alpine

# 시스템 패키지 업데이트 및 필요한 패키지 설치
RUN apk update && apk add --no-cache \
    curl \
    git \
    unzip \
    libzip-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    oniguruma-dev \
    libxml2-dev \
    icu-dev

# PHP 확장 모듈 설치
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo \
        pdo_mysql \
        mbstring \
        zip \
        gd \
        xml \
        intl \
        opcache

# Composer 설치
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 작업 디렉토리 설정
WORKDIR /var/www/html

# Composer 의존성 설치
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts

# 애플리케이션 파일 복사
COPY . .

# Composer 스크립트 실행 (스크립트가 없는 경우 건너뛰기)
RUN composer run-script post-install-cmd --no-dev || true

# PEAR 패키지 경로 설정
ENV PEAR_PATH="/usr/local/lib/php"

# oops/KASI_Lunar 패키지 설치 (PEAR)
RUN pear channel-discover pear.oops.org && \
    pear install oops/KASI_Lunar oops/Lunar

# PHP-FPM 설정
RUN echo "pm.max_children = 50" >> /usr/local/etc/php-fpm.d/www.conf && \
    echo "pm.start_servers = 5" >> /usr/local/etc/php-fpm.d/www.conf && \
    echo "pm.min_spare_servers = 5" >> /usr/local/etc/php-fpm.d/www.conf && \
    echo "pm.max_spare_servers = 35" >> /usr/local/etc/php-fpm.d/www.conf

# PHP 설정
RUN echo "memory_limit = 256M" >> /usr/local/etc/php/conf.d/custom.ini && \
    echo "max_execution_time = 300" >> /usr/local/etc/php/conf.d/custom.ini && \
    echo "upload_max_filesize = 10M" >> /usr/local/etc/php/conf.d/custom.ini && \
    echo "post_max_size = 10M" >> /usr/local/etc/php/conf.d/custom.ini && \
    echo "date.timezone = Asia/Seoul" >> /usr/local/etc/php/conf.d/custom.ini

# OPcache 설정
RUN echo "opcache.enable=1" >> /usr/local/etc/php/conf.d/opcache.ini && \
    echo "opcache.memory_consumption=128" >> /usr/local/etc/php/conf.d/opcache.ini && \
    echo "opcache.interned_strings_buffer=8" >> /usr/local/etc/php/conf.d/opcache.ini && \
    echo "opcache.max_accelerated_files=4000" >> /usr/local/etc/php/conf.d/opcache.ini && \
    echo "opcache.revalidate_freq=2" >> /usr/local/etc/php/conf.d/opcache.ini && \
    echo "opcache.fast_shutdown=1" >> /usr/local/etc/php/conf.d/opcache.ini

# 권한 설정
RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html

# 포트 노출
EXPOSE 9000

# PHP-FPM 실행
CMD ["php-fpm"]
