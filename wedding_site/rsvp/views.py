import json

from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic import TemplateView, View

from rsvp.models import Invitation, Guest, Meal, ReplyError

class RSVPView(TemplateView):
    template_name='rsvp/rsvp_page.html'

    def get_context_data(self):
        context = super().get_context_data()
        context['meal_choices'] = json.dumps([meal.toJSON() for meal in
                                              Meal.objects.all()])
        return context


class InvitationView(View):

    @method_decorator(ensure_csrf_cookie)
    def get(self, request, invite_code):
        invite = get_object_or_404(Invitation, code=invite_code)
        data = invite.toJSON()
        return HttpResponse(json.dumps(data),
                            content_type='application/json')

    @method_decorator(ensure_csrf_cookie)
    def post(self, request, invite_code):
        invite = get_object_or_404(Invitation, code=invite_code)
        body_unicode = request.body.decode('utf-8')
        data = json.loads(body_unicode)

        try:
            invite.handle_reply(data)
        except ReplyError as e:
            data = json.dumps(e.errors)
            return HttpResponse(data,
                                status=400,
                                content_type='application/json')
        else:
            return HttpResponse()
