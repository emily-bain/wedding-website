import uuid

from django.db import models

class Invitation(models.Model):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=255, db_index=True)

    def __str__(self):
        return self.name

    def toJSON(self):
        return {
            'name': self.name,
            'code': self.code,
            'guests': [guest.toJSON() for guest in self.guests.all()]
        }

class Meal(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

    def toJSON(self):
        return {
            'id': self.id,
            'name': self.name
        }

class Guest(models.Model):
    first_name = models.CharField(max_length=255, blank=True)
    last_name = models.CharField(max_length=255, blank=True)
    invitation = models.ForeignKey('rsvp.Invitation', related_name='guests')
    guest_of = models.ForeignKey('rsvp.Guest', related_name='guests', null=True, blank=True)
    meal = models.ForeignKey('rsvp.Meal', null=True, blank=True)
    notes = models.CharField(max_length=2048, blank=True)
    attending = models.NullBooleanField()
    uuid = models.UUIDField(default=uuid.uuid4, editable=False)

    def __str__(self):
        return "{}, {}".format(self.last_name, self.first_name)

    def toJSON(self):
        return {
            'id': self.uuid,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'meal': self.meal,
            'notes': self.notes,
            'attending': self.attending,
        }

    def update_from_reply(self, reply):
        """

        """
        errors = {}
        if not self.first_name:
            first_name = reply.get('first_name')
            if not first_name:
                errors['first_name'] = 'First Name is a required field'
            else:
                self.first_name = reply['first_name']

        if not self.last_name:
            last_name = reply.get('last_name')
            if not last_name:
                errors['last_name'] = 'Last Name is a required field'
            else:
                self.last_name = last_name

        attending = reply.get('attending')
        if attending is None:
            errors['attending'] = 'Attending is a required field'
        elif not isinstance(attending, bool):
            errors['attending'] = 'Attending must be a boolean value'
        else:
            self.attending = attending

        meal = reply.get('meal', None)
        if not attending and meal is not None:
            errors['meal'] = 'Non-attending guests may not select a meal'
        elif attending and not meal:
            errors['meal'] = 'Meal is required for guests who are attending'
        else:
            self.meal = meal

        self.notes = reply.get('notes', None)

    class QuerySet(object):
        def primary_guests(self):
            return self.filter(guest_of__isnull=True)
