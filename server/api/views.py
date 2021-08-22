from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse_lazy
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import ContractSerializer, CampanySeriaizer
from .models import Campany

from analizer import new_plan


def index(request):
    return render(request, 'index.html')


class NewContractView(APIView):
    def get(self, request):
        return render(request, 'newContract.html')

    def post(self, request):
        contract = request.data
        print('contract', contract)
        serializer = ContractSerializer(data=contract)
        if serializer.is_valid(raise_exception=True):
            contract_saved = serializer.save()
        new_plan(serializer.data)
        return Response({"data": 'saved'})


class CampanyView(APIView):
    def post(self, request):
        players = Campany.objects.all()
        serializer = CampanySeriaizer(data=players, many=True)
        serializer.is_valid()
        print(serializer)
        return Response({"data": serializer.data})

