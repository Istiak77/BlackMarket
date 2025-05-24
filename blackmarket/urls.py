from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

# Import the GoogleLogin view
from product.social_auth import GoogleLogin

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/v1/', include('djoser.urls')),
    path('api/v1/', include('djoser.urls.authtoken')),

    path('api/v1/auth/', include('dj_rest_auth.urls')),
    path('api/v1/auth/registration/', include('dj_rest_auth.registration.urls')),
    
    # Google OAuth endpoint
    path('api/v1/auth/google/', GoogleLogin.as_view(), name='google_login'),

    path('api/v1/', include('product.urls')),
    path('api/v1/payment/', include('payment.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)