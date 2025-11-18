from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tests', '0004_alter_answer_options_alter_answer_unique_together_and_more'),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            state_operations=[
                migrations.AddField(
                    model_name='answer',
                    name='option_ids',
                    field=models.JSONField(
                        blank=True,
                        default=list,
                        help_text='Список ID выбранных вариантов для multiple choice вопросов',
                    ),
                ),
            ],
            database_operations=[],
        ),
    ]
