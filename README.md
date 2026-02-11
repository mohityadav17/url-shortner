# URL Shortener

A full-stack URL shortener built using Node.js, Express, MongoDB, and a simple frontend.

## Features
- Convert long URLs into short links
- Redirect to original URL
- Track click analytics
- REST API backend
- Deployed online

## Tech Stack
- Node.js
- Express
- MongoDB Atlas
- HTML, CSS, JavaScript
- Render (deployment)

## Live Project
https://url-shortner-i43k.onrender.com

## API Endpoints

Create short URL:
POST /shorten

Analytics:
GET /stats/:code

Redirect:
GET /:code
