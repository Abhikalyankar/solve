
"""
Remote Authentication Backend for kepler-backend
Validates tokens by calling kepler-auth service
"""
import requests
from django.contrib.auth.backends import BaseBackend
from django.conf import settings
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed
import logging

logger = logging.getLogger(__name__)

class RemoteUser:
    """
    Represents a user authenticated through kepler-auth service
    """
    def __init__(self, user_data):
        self.first_name = user_data.get('first_name')
        self.last_name = user_data.get('last_name')
        self.phone_number = user_data.get('phone_number')
        self.email = user_data.get('email')
        self.role = user_data.get('role')
        self.address = user_data.get('address')
        # self.name = user_data.get('name', '')
        # self.is_active = user_data.get('is_active', True)
        # self.is_staff = user_data.get('is_staff', False)
        # self.is_superuser = user_data.get('is_superuser', False)
        # self.phone_number = user_data
        
        # Permission handling
       
        
        # For Django compatibility, we also store a flat list of permissions
        
        
    def is_authenticated(self):
        return True
    
    # def has_perm(self, perm):
    #     """Check if user has a specific permission"""
    #     if self.is_superuser:
    #         return True
    #     return perm in self._permissions_cache
    
    # def has_perms(self, perms):
    #     """Check if user has all specified permissions"""
    #     if self.is_superuser:
    #         return True
    #     return all(self.has_perm(perm) for perm in perms)
    
    # def has_module_perms(self, app_label):
    #     """Check if user has any permissions for the given app"""
    #     if self.is_superuser:
    #         return True
    #     return any(perm.startswith(f"{app_label}.") for perm in self._permissions_cache)
    
    # def get_user_permissions(self):
    #     """Get user's direct permissions (for Django compatibility)"""
    #     return set(self.user_permissions)
    
    # def get_group_permissions(self):
    #     """Get permissions from user's groups (for Django compatibility)"""
    #     return set(self.group_permissions)
    
    # def get_all_permissions(self):
    #     """Get all permissions (for Django compatibility)"""
    #     return self._permissions_cache
    
    def __str__(self):
        return self.email


class RemoteAuthBackend(BaseBackend):
    """
    Authentication backend that validates users through kepler-auth service
    """
    
    def authenticate(self, request, phone_number=None, otp=None, **kwargs):
        """
        Authenticate user through kepler-auth service
        """
        try:
            auth_service_url = getattr(settings, 'http://127.0.0.1:8300')
            
            response = requests.post(
                # f"{auth_service_url}/get-token/",
                f"{auth_service_url}/api/users/Signin2/verify/",
                json={'phone_number': phone_number, 'otp': otp},
                timeout=5
            )
            
            if response.status_code == 200:
                data = response.json()
                token = data.get('token')
                
                if token:
                    # Get user data using the token
                    user_data = self.get_user_data_from_token(token)
                    if user_data:
                        return RemoteUser(user_data)
            
            return None
            
        except Exception as e:
            logger.error(f"Remote authentication failed: {e}")
            return None
    
    def get_user_data_from_token(self, token):
        """
        Get user data from kepler-auth using token
        """
        try:
            auth_service_url = getattr(settings, 'AUTH_SERVICE_URL', 'http://localhost:8300')
            
            # Use the user detail endpoint that accepts token authentication
            response = requests.get(
                f"{auth_service_url}/auth/accounts/me/",
                headers={'Authorization': f'Token {token}'},
                timeout=5
            )
            
            if response.status_code == 200:
                return response.json()
            
            return None
            
        except Exception as e:
            logger.error(f"Failed to get user data: {e}")
            return None

    def get_user(self, user_id):
        """
        Get user by ID - required by Django auth system
        """
        # For now, return None as we don't store users locally
        # This method is called by Django's auth system for session-based auth
        return None


class RemoteTokenAuthentication(TokenAuthentication):
    """
    Token authentication that validates tokens through kepler-auth service
    """
    
    def authenticate(self, request):
        """
        Override authenticate method to add logging
        """
        print("🔍 RemoteTokenAuthentication.authenticate() called")
        
        # Get the token from the Authorization header
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        print("auth_header:", auth_header)
        if not auth_header:
            print("❌ No Authorization header found")
            return None
            
        if not auth_header.startswith('Bearer '):
            print("❌ Authorization header doesn't start with 'Token '")
            return None
            
        token = auth_header.split(' ')[1]
        # print("toknen:", token)
        print("###################################")
        print(f"🔑 Found token: {token[:10]}...")
        
        try:
            return self.authenticate_credentials(token)
        except AuthenticationFailed as e:
            logger.error(f"❌ Authentication failed: {e}")
            raise
        except Exception as e:
            logger.error(f"❌ Unexpected error in authentication: {e}")
            raise AuthenticationFailed('Authentication error')
    
    def authenticate_credentials(self, key):
        """
        Validate token through kepler-auth service
        """
        print(f"🔍 RemoteTokenAuthentication.authenticate_credentials() called with token: {key[:10]}...")
        
        try:
            auth_service_url = getattr(settings, 'AUTH_SERVICE_URL', 'http://127.0.0.1:8300')
            print(f"🌐 Calling kepler-auth at: {auth_service_url}")
            
            # Test the token by trying to get user info
            response = requests.get(
                f"{auth_service_url}/api/users/profile/",
                headers={'Authorization': f'Bearer {key}'},
                timeout=5
            )
            print("response is ",response)
            
            print(f"📡 kepler-auth response status: {response.status_code}")
            
            if response.status_code == 200:
                user_data = response.json()
                print("user_data is ",user_data)
                # print(f"✅ Got user data: {user_data.get('results.phone_number')}")
                print("✅ Got user data:", user_data["results"][0]["phone_number"])
                
                # Create a minimal user object for the token
                if not user_data.get('id'):
                    # If no id is returned, use email as a fallback identifier
                    user_data['id'] = hash(user_data["results"][0]["email"]) % 1000000
                    print("user data is",user_data['id'])
                
                print("user dataaa",user_data['results'])
                # kk=user_data['results']
                # print("phone nuber is ",kk.phone_number)
                # phone_number = user_data.get('results', [{}])[0].get('email')
                phone_number = user_data.get('results')
                print("Phone number:", phone_number)
                print("@@@@@@@@@@@@@@")

                single_user = user_data.get('results', [{}])[0]
                print(single_user)
                user = RemoteUser(single_user)
                # print(f"✅ Created RemoteUser: {user}")
                return (user, key)
                # return (key)
            elif response.status_code == 401:
                logger.error("❌ kepler-auth returned 401 - invalid token")
                raise AuthenticationFailed('Invalid token')
            else:
                logger.error(f"❌ kepler-auth returned {response.status_code}: {response.text}")
                raise AuthenticationFailed('Authentication service error')
                
        except requests.exceptions.RequestException as e:
            logger.error(f"❌ Network error calling kepler-auth: {e}")
            raise AuthenticationFailed('Authentication service unavailable')
        except Exception as e:
            logger.error(f"❌ Unexpected error in token authentication: {e}")
            raise AuthenticationFailed('Invalid token') 
