from django.contrib import admin
from rsvp.models import Guest, Invitation

class GuestAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'attending']

admin.site.register(Guest, GuestAdmin)
admin.site.register(Invitation)
