FROM php:8.4-apache

# --------------------------------------------------
# Extensions PHP nécessaires à Laravel + PostgreSQL
# --------------------------------------------------

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    libzip-dev \
    libicu-dev \
    libonig-dev \
    libxml2-dev \
    && docker-php-ext-install \
        pdo_pgsql \
        mbstring \
        bcmath \
        intl \
        zip \
        opcache \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*


# --------------------------------------------------
# Apache
# --------------------------------------------------

RUN a2enmod rewrite

# Laravel doit utiliser /public comme DocumentRoot
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

RUN sed -ri \
    -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' \
    /etc/apache2/sites-available/*.conf \
    /etc/apache2/apache2.conf \
    /etc/apache2/conf-available/*.conf


# --------------------------------------------------
# Composer
# --------------------------------------------------

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer


# --------------------------------------------------
# Application Laravel
# --------------------------------------------------

WORKDIR /var/www/html

# On copie d'abord les fichiers de dépendances
COPY composer.json composer.lock ./

# Ajout de --no-scripts pour éviter que Laravel ne cherche le fichier 'artisan' qui n'est pas encore là
RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader \
    --no-scripts

# Maintenant on copie le reste du projet (y compris le fichier artisan)
COPY . .

# On lance les scripts post-installation puisque tous les fichiers sont présents
RUN php artisan package:discover --ansi


# --------------------------------------------------
# Permissions Laravel
# --------------------------------------------------

RUN mkdir -p \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache

RUN chown -R www-data:www-data \
    storage \
    bootstrap/cache

RUN chmod -R 775 \
    storage \
    bootstrap/cache


# --------------------------------------------------
# Configuration PHP production
# --------------------------------------------------

RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"


# --------------------------------------------------
# Port Render
# --------------------------------------------------

EXPOSE 10000

# Apache écoute sur le port 10000
RUN sed -i 's/Listen 80/Listen 10000/' /etc/apache2/ports.conf \
    && sed -i 's/:80>/:10000>/g' /etc/apache2/sites-available/000-default.conf


# --------------------------------------------------
# Démarrage
# --------------------------------------------------

CMD ["apache2-foreground"]
