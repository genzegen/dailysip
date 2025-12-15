from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.authentication import SessionAuthentication

from .serializers import *
from django.contrib.auth import login, logout
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.conf import settings

class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        # Disable CSRF checks for these API views (we rely on session auth only)
        return

class RegisterView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []  # no session/token auth; no CSRF enforcement

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []  # allow React login without CSRF/session

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            login(request, user)
            user_data = UserSerializer(user).data
            return Response({
                'message': 'Login successful',
                'user': user_data,
                'username': user_data['username'],
                }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AdminLoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = AdminLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            
            if not user.is_staff:
                return Response({
                    'error': 'Access denied. Admin privileges required.'
                }, status=status.HTTP_403_FORBIDDEN)
                
            login(request, user)
            user_data = UserSerializer(user).data
            return Response({
                'message': 'Admin login successful',
                'user': user_data,
                'username': user_data['username'],
                'is_staff': True,
                }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AdminOnlyView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        return Response({
            'message': 'Welcome to the admin dashboard!',
            'user': {
                'username': request.user.username,
                'email': request.user.email,
                'is_staff': request.user.is_staff,
            }
            
        })

class ChangePasswordView(APIView):
    """Allow an authenticated admin user to change their own password."""

    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request):
        user = request.user

        old_password = request.data.get("old_password")
        new_password1 = request.data.get("new_password1")
        new_password2 = request.data.get("new_password2")

        if not old_password or not new_password1 or not new_password2:
            return Response(
                {"detail": "All fields are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not user.check_password(old_password):
            return Response(
                {"detail": "Current password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if new_password1 != new_password2:
            return Response(
                {"detail": "New passwords do not match."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            validate_password(new_password1, user=user)
        except ValidationError as exc:
            return Response(
                {"detail": " ".join(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password1)
        user.save()

        return Response({"detail": "Password updated successfully."}, status=status.HTTP_200_OK)

class LogoutView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [AllowAny]

    def post(self, request):
        logout(request)
        response = Response({"message": "Logout successful"}, status=status.HTTP_200_OK)

        response.delete_cookie(getattr(settings, 'SESSION_COOKIE_NAME', 'sessionid'))
        response.delete_cookie(getattr(settings, 'CSRF_COOKIE_NAME', 'csrftoken'))
        return response