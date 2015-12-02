from django.http import JsonResponse

def demo_wl(request):
    print "wl"
    return JsonResponse({'weilin': 'tsai'})

def getTopKRelevantPapersWithAuthorsByKeywords(request):
    print "call getTopKRelevantPapersWithAuthorsByKeywords()"
    return JsonResponse({'getTopKRelevantPapersWithAuthorsByKeywords': 'tsai'})
