# BlackMarket

E-commerce marketplace built with Django backend and Vue.js frontend.

![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D)
![Django REST](https://img.shields.io/badge/Django_REST-ff1709?style=for-the-badge&logo=django&logoColor=white)

## Features

- **User System**: Registration, authentication, and profiles
- **Product Management**: CRUD operations for products
- **Shopping Cart**: Persistent cart functionality
- **Order Processing**: Checkout and order history
- **Admin Panel**: Django admin for store management
- **RESTful API**: Django REST Framework backend

## Tech Stack

### Backend
- Django 4.x
- Django REST Framework
- SQLite (development)

### Frontend
- Vue.js 3
- Vuex/Pinia for state management
- Vue Router
- Axios for API calls
- Bulma CSS 

## Project Structure



## Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 16+

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your settings

# Run migrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

cd blackmarket_vue
npm install
npm run serve