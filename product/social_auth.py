from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from rest_framework import status
from rest_framework.response import Response

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    client_class = OAuth2Client
    
    def post(self, request, *args, **kwargs):
        request.data.update({
            'access_token': request.data.get('access_token'),
            'id_token': request.data.get('access_token')  # Some implementations need this
        })
        return super().post(request, *args, **kwargs)