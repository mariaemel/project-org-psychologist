# Generated by Django 5.1.7 on 2025-04-23 13:18

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ClientRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('full_name', models.CharField(max_length=255, verbose_name='ФИО')),
                ('company', models.CharField(blank=True, max_length=255, null=True, verbose_name='Компания')),
                ('phone', models.CharField(max_length=20, verbose_name='Телефон')),
                ('email', models.EmailField(blank=True, max_length=254, null=True, verbose_name='Email')),
                ('request_text', models.TextField(verbose_name='Текст заявки')),
                ('client_type', models.CharField(choices=[('individual', 'Физическое лицо'), ('business', 'Бизнес'), ('organization', 'Организация')], max_length=50, verbose_name='Тип клиента')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Дата и время отправки')),
                ('status', models.CharField(choices=[('новая', 'Новая'), ('в работе', 'В работе'), ('обработана', 'Обработана'), ('отклонена', 'Отклонена')], default='новая', max_length=50, verbose_name='Статус')),
            ],
            options={
                'verbose_name': 'Заявка клиента',
                'verbose_name_plural': 'Заявки клиентов',
                'ordering': ['-created_at'],
            },
        ),
    ]
