from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse


@api_view(['GET'])
def landing_page(request):
    return JsonResponse({"message": "This is landing page view!"})
