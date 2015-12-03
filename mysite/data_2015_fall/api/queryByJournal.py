from django.http import JsonResponse
from data_2015_fall.models import *
import simplejson

# ===================================================
#	Classes 
# ===================================================


# ===================================================
#	Functions 
# ===================================================
'''
Given a journal name, generate a graph showcasing authors contributing
to each of its volume, taking volume as the base axis.
'''
def getAuthorContributionToAJournal(request, name):
    return JsonResponse({'getAuthorContributionToAJournal': name})
