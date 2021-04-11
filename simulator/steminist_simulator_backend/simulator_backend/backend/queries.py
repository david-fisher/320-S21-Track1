# temp file to store query functions
# might be deprecated in future
import backend.models as md
from django.db import transaction
from django.db.models import Prefetch, Q

INITIAL_REFLECTION = 3 # page number 3


def getReflectionPage(scenarioID, position):
    try:
        aps = md.ActionPage.objects.prefetch_related('page_id')
        pages = md.Page.objects.filter(page_title=position, scenario_id=scenarioID, page_type='ACTION')

        body = pages.values()[0]['body']
        #print(body)
        responses = []

        for page in pages:

            responses.append([{'prompt_id':a['ap_id'], 'response':a['choices']} for a in aps.filter(page_id=page.page_id).values()])

    except Exception as e:
        responses = None
        print('ERROR: %s' %str(e))

    return body,responses

'''def addReflectionResponse(studentID, inputData, promptNum, scenarioID, timestamp, page_order):

    try:
        pageSelection = md.Page.objects.filter(scenario_id=scenarioID, order=page_order)
        if len(pageSelection) == 0:
            raise Exception("Empty SQL selection")
        pageID = pageSelection[0].id # TODO recheck if pageSelection subscriptable

        submissionSelection = md.Submissions.objects.filter(scenario_id=scenarioID, student_id=studentID) # TODO no Submissions class in models.py yet
        if len(submissionSelection) == 0:
            raise Exception("Empty SQL selection")
        submissionID = submissionSelection[0].id # TODO recheck if submissionSelection subscriptable

        # insertion step
        # TODO please recheck this, I'm not used to transaction.atomic()
        with transaction.atomic():
            responseCreation = md.Response(submission_id=submissionID, page_id=pageID, time=timestamp) # TODO no Response class in models.py yet
            responseCreation.save()
            responseID = responseCreation[0].id
            promptResponseCreation = md.Prompt_response(id=responseID, prompt_num=promptNum, response=inputData) # TODO no Prompt_message class in models.py yet
            promptResponseCreation.save()

    except Exception as e:
        if hasattr(e, 'message'):
            if e.message == "Empty SQL selection":
                return False
        else:
            raise e

    else:
        return True


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

