from django.db import models

class SpecialistInfo(models.Model):
    name = models.CharField("Имя", max_length=200)
    content = models.TextField("Содержимое")

    created_at = models.DateTimeField("Создано", auto_now_add=True)
    updated_at = models.DateTimeField("Обновлено", auto_now=True)

    class Meta:
        verbose_name = "Запись"
        verbose_name_plural = "Записи"
        ordering = ["created_at"]

    def __str__(self):
        return self.name


def image_upload_path(instance, filename: str) -> str:
    obj_id = instance.id or "unknown"
    return f"images/{obj_id}/{filename}"

class ImageAsset(models.Model):
    name = models.CharField("Имя", max_length=200)
    image = models.ImageField("Изображение", upload_to=image_upload_path)

    created_at = models.DateTimeField("Загружено", auto_now_add=True)

    class Meta:
        verbose_name = "Изображение"
        verbose_name_plural = "Изображения"
        ordering = ["-created_at"]

    def __str__(self):
        return self.name
