import paramiko
import json
from rest_framework.response import Response
from django.http import HttpResponse
from rest_framework.renderers import JSONRenderer
import requests
from django.http import JsonResponse

class AuthMiddleware(object):
    def __init__(self, get_response):
        """
        One-time configuration and initialisation.
        """
        self.get_response = get_response

    def __call__(self, request):
        try:
            r = requests.get('https://ethisim1.cs.umass.edu:1000/api_tokens.txt')
            obj = r.json()

            print(obj)
            username = request.headers['api-username']
            token = request.headers['api-token']

            userFound = False
            for record in obj:
                if record['user'] == username and record['token'] == token:
                    userFound = True
                    break
            
            if not userFound:
                raise

        except:
             return JsonResponse({"msg" : "Invalid API Token", "status": False}, status=401)

        response = self.get_response(request)
        return response
