# temp file to store query functions
# might be deprecated in future
import backend.models as md
from django.db import transaction
from django.db.models import Prefetch, Q

INITIAL_REFLECTION = 3 # page number 3


def getReflectionPage(scenarioID, position):
    try:
        aps = md.ActionPage.objects.prefetch_related('page_id') # prefetch?
        pages = md.Page.objects.filter(page_title=position, scenario_id=scenarioID, page_type='ACTION')

        body = pages.values()[0]['body']
        responses = []

        for page in pages:
            responses.append([{'prompt_id':a['ap_id'], 'response':a['choices']} for a in aps.filter(page_id=page.page_id).values()])

    except Exception as e:
        responses = None
        print('ERROR: %s' %str(e))

    return body,responses


def addReflectionResponse(studentID, inputData, promptNum, scenarioID, timestamp, page_order):

    try:


    except Exception as e:
        if hasattr(e, 'message'):
            if e.message == "Empty SQL selection":
                return False
        else:
            raise e

    else:
        return True

'''
def addInitReflectResponse(studentID, inputData, promptNum, scenarioID, timestamp):

    # I don't know why we have to go such length but I respect the legacy code
    # Maybe because of the asynchronous nature of the original node function that django has somehow already accounted for it
    try:
        result = addReflectionResponse(studentID, inputData, promptNum, scenarioID, timestamp, INITIAL_REFLECTION)
    except Exception as e:
        print(e)
        return False
    else:
        return result'''

