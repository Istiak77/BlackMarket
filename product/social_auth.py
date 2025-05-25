from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    client_class = OAuth2Client
    
    def post(self, request, *args, **kwargs):
        request.data.update({
            'access_token': request.data.get('access_token'),
            'id_token': request.data.get('access_token')
        })
        
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == status.HTTP_200_OK:
            user = self.user
            refresh = RefreshToken.for_user(user)
            
            # Get the social account info
            social_account = user.socialaccount_set.filter(provider='google').first()
            
            response.data.update({
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name
                },
                'provider': 'google',
                'picture': social_account.extra_data.get('picture') if social_account else None
            })
            
            # Add refresh token if using JWT
            response.data['refresh'] = str(refresh)
            response.data['access'] = str(refresh.access_token)
        
        return response