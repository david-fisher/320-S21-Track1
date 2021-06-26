import json
from rest_framework.response import Response
from django.http import HttpResponse
from rest_framework.renderers import JSONRenderer
from django.http import JsonResponse
from django.core import serializers
import sys
import traceback

from tables.models import APITokens
from tables.serializer import APITokenSerializer

class AuthMiddleware(object):
    def __init__(self, get_response):
        """
        One-time configuration and initialisation.
        """
        self.get_response = get_response

    def __call__(self, request):
        try:
            if 'API-User' not in request.headers or 'API-Token' not in request.headers:
                raise AuthError()

            user = request.headers['API-User']
            token = request.headers['API-Token']
            query=APITokens.objects.all().filter(token=token, user=user)
            result = list(APITokenSerializer(query, many=True).data)
            userFound = len(result) == 1

            if not userFound:
                raise AuthError()

        except:
            
            print(traceback.print_exc())
            if sys.exc_info()[0].__name__ == 'AuthError':
                return JsonResponse({"msg" : "Invalid API Token " + sys.exc_info()[0].__name__, "status": False}, status=401)

            return JsonResponse({"msg" : "Internal Service Error " + sys.exc_info()[0].__name__, "status": False}, status=500)

        response = self.get_response(request)
        return response

class AuthError(Exception):
    pass

