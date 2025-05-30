from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

from product.social_auth import GoogleLogin
from product import views

urlpatterns = [
    path('admin/', admin.site.urls),

    # Djoser & dj-rest-auth
    path('api/v1/', include('djoser.urls')),
    path('api/v1/', include('djoser.urls.authtoken')),
    path('api/v1/auth/', include('dj_rest_auth.urls')),
    path('api/v1/auth/registration/', include('dj_rest_auth.registration.urls')),

    # Google OAuth endpoint
    path('api/v1/auth/google/', GoogleLogin.as_view(), name='google_login'),

    # App-specific endpoints
    path('api/v1/orders/', views.OrderList.as_view(), name='order-list'),
    path('api/v1/users/me/', views.UserDetail.as_view(), name='user-detail'),

    # Product + Payment APIs
    path('api/v1/', include('product.urls')),
    path('api/v1/payment/', include('payment.urls')),
]

# Serve media files during development
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
