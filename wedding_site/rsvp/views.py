import json
from collections import defaultdict

from django.http import HttpResponse
from django.shortcuts import get_object_or_404, render
from django.views.generic.base import TemplateView

from rsvp.models import Invitation, Guest

class RSVPView(TemplateView):
    template_name='rsvp/rsvp_page.html'


class JSONError(Exception):
    status_code = 400
    errors = None

    def __init__(self, errors=None):
        if errors is not None:
            self.errors = errors
        else:
            self.errors = defaultdict(list)

    @property
    def http_response(self):
        return HttpResponse(json.dumps(self.errors),
                            status_code=self.status_code,
                            content_type='application/json')


def json_view(fn):
    """
    Decorator to make JSON views out of function-based views.
    Just return the dictionary and it'll serialize the data
    """
    def inner(*args, **kwargs):
        try:
            data = fn(*args, **kwargs)
        except JSONError as e:
            return e.http_response
        else:
            return HttpResponse(json.dumps(data),
                                content_type='application/json')
    return inner

@json_view
def get_invitation(request, invite_code):
    invite = get_object_or_404(Invitation, code=invite_code)
    return invite.toJSON()

@json_view
def reply(request):
    replies = json.loads(request.body)
    if not isinstance(replies, dict):
        raise JSONError({'__all__': "Expected a dictionary of guests by guest ids"})
    errors = {}
    for guest_id, reply in replies.items():
        try:
            guest = Guest.objects.get(uuid=guest_id)
        except Guest.DoesNotExist:
            errors[guest_id].append('Guest matching ID does not exist')

        try:
            guest.update_from_reply(reply)
        except ValidationError as e:
            errors[guest_id].append(e.message)

    if errors:
        raise JSONErrors(errors)

    return {}


