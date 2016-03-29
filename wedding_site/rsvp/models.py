from django.db import models

class Invitation(models.Model):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=255, db_index=True)

    def __str__(self):
        return self.name

class Meal(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Guest(models.Model):
    first_name = models.CharField(max_length=255, blank=True)
    last_name = models.CharField(max_length=255, blank=True)
    invitation = models.ForeignKey('rsvp.Invitation')
    meal = models.ForeignKey('rsvp.Meal', null=True, blank=True)
    notes = models.CharField(max_length=2048, blank=True)
    attending = models.NullBooleanField()

    def __str__(self):
        return "{}, {}".format(self.last_name, self.first_name)
