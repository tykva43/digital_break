from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse_lazy


def index(request):
        return render(request, 'index.html')

def new_contract(request):
        return render(request, 'newContract.html')
