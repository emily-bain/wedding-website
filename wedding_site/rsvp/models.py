import uuid

from django.core.exceptions import ValidationError
from django.db import models

class ReplyError(Exception):
    def __init__(self, errors_dict):
        self.errors_dict = errors_dict

    @property
    def errors(self):
        return self.errors_dict

class Invitation(models.Model):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=255, db_index=True)

    def __str__(self):
        return self.name

    def handle_reply(self, guests):
        meals_by_id = dict((meal.id, meal) for meal in Meal.objects.all())
        errors = {}
        valid_guests = []
        for guest_data in guests:
            guest_id = guest_data.get('id')

            try:
                guest = self.guests.get(uuid=uuid.UUID(guest_id))
            except ValidationError:
                errors[guest_id] = {'__all__': 'No guest with that guest id'}
                continue

            guest.first_name = guest_data.get('first_name', None)
            guest.last_name = guest_data.get('last_name', None)
            guest.attending = guest_data.get('attending', None)
            guest.notes = guest_data.get('notes', '')
            meal_id = guest_data.get('meal', None)
            guest.meal = meals_by_id.get(meal_id, None)

            try:
                guest.validate()
            except ValidationError as e:
                errors[guest_id] = dict(e)
            else:
                valid_guests.append(guest)

        if errors:
            raise ReplyError(errors)
        else:
            for guest in valid_guests:
                guest.save()


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
        return "{}, {} {}".format(
            self.last_name,
            self.first_name,
            "(Guest of {})".format(str(self.guest_of)) if self.guest_of else ''
        )

    def toJSON(self):
        return {
            'id': str(self.uuid),
            'first_name': self.first_name,
            'last_name': self.last_name,
            'meal': self.meal_id,
            'notes': self.notes,
            'attending': self.attending,
            'guest_of': str(self.guest_of.uuid) if self.guest_of else None
        }

    def validate(self):
        fields = ['first_name', 'last_name', 'attending', 'meal', 'notes']
        errors = {}
        for field in fields:
            validator = getattr(self, 'clean_{}'.format(field), lambda: None)
            try:
                validator()
            except ValidationError as e:
                errors[field] = e

        if errors:
            raise ValidationError(errors)

    def clean_first_name(self):
        if self.attending and not self.first_name:
            raise ValidationError('First name is a required field')

    def clean_last_name(self):
        if self.attending and not self.last_name:
            raise ValidationError('Last name is a required field')

    def clean_attending(self):
        if not isinstance(self.attending, bool):
            raise ValidationError('You must choose Yes or No')

    def clean_meal(self):
        if self.attending and not self.meal:
            raise ValidationError('You must choose a meal if you are attending')

    class QuerySet(object):
        def primary_guests(self):
            return self.filter(guest_of__isnull=True)
