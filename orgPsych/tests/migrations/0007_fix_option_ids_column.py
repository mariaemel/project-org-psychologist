from django.db import migrations, models

def add_option_ids_if_missing(apps, schema_editor):
    connection = schema_editor.connection
    cursor = connection.cursor()
    table_name = 'tests_answer'

    columns = {col.name for col in connection.introspection.get_table_description(cursor, table_name)}
    if 'option_ids' in columns:
        return

    Answer = apps.get_model('tests', 'Answer')
    field = models.JSONField(
        default=list,
        blank=True,
        help_text='Список ID выбранных вариантов для multiple choice вопросов',
    )
    field.set_attributes_from_name('option_ids')
    schema_editor.add_field(Answer, field)

def noop(apps, schema_editor):
    pass

class Migration(migrations.Migration):

    dependencies = [
        ('tests', '0006_merge_0003_answer_option_ids_0005_answer_option_ids'),
    ]

    operations = [
        migrations.RunPython(add_option_ids_if_missing, reverse_code=noop),
    ]
