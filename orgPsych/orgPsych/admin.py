from django.contrib import admin
from django.contrib.auth.models import User, Group

admin.site.unregister(User)
admin.site.unregister(Group)

admin.site.site_header = "Администрирование сайта"
admin.site.site_title = "Панель администратора"
admin.site.index_title = "Добро пожаловать в админ-панель"
