from django.http import JsonResponse
from data_2015_fall.models import *

def demo_wl(request):
    print "wl"
    return JsonResponse({'weilin': 'tsai'})

def getTopKRelevantPapersWithAuthorsByKeywords(request, keywords, k):
    print "call getTopKRelevantPapersWithAuthorsByKeywords()"
    cnt = 0
    for tmp in Article.nodes:
    	print tmp.title
    	#print tmp.name
    	cnt += 1
    	if (cnt > 10):
    		break
    print cnt	

    return JsonResponse({keywords: 'k'})