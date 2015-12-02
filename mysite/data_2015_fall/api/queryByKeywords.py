from django.http import JsonResponse

def demo_wl(request):
    print "wl"
    return JsonResponse({'weilin': 'tsai'})

def getTopKRelevantPapersWithAuthorsByKeywords(request, keywords, k):
    print "call getTopKRelevantPapersWithAuthorsByKeywords()"
    return JsonResponse({keywords: 'k'})
