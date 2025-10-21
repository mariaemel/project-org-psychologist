from rest_framework import serializers

from orgPsych.tests.models import Test, Option, Question, ResultDimension


class TestCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = ("slug","title","short_description","est_minutes","hero_image_url")

class TestDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = ("slug","title","instructions_md","est_minutes","hero_image_url","seo_title","seo_description","og_image_url")

class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ("id","order_index","text","value")

class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True, read_only=True)
    class Meta:
        model = Question
        fields = ("id","order_index","text","type","required","options")

class ProgressSerializer(serializers.Serializer):
    index = serializers.IntegerField()
    total = serializers.IntegerField()

class QuestionWithProgressSerializer(QuestionSerializer):
    progress = ProgressSerializer()

class AttemptStartSerializer(serializers.Serializer):
    test_slug = serializers.SlugField()

class SaveAnswerSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    option_id = serializers.IntegerField(required=False)
    option_ids = serializers.ListField(child=serializers.IntegerField(), required=False)
    text_value = serializers.CharField(allow_blank=True, required=False)

class ResultDimensionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResultDimension
        fields = ("code","title","score","level","explanation_md")

class PublicResultSerializer(serializers.Serializer):
    test = serializers.DictField()
    computed_at = serializers.DateTimeField()
    dimensions = ResultDimensionSerializer(many=True)
    summary_md = serializers.CharField()
    viz = serializers.DictField()
    actions = serializers.DictField()
