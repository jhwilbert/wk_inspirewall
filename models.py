#!/usr/bin/env python
from google.appengine.ext import db

class ImageData(db.Model):
  url           = db.LinkProperty()
  dateTime      = db.DateTimeProperty()
  recent        = db.BooleanProperty(required=True, default=True)