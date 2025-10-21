from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Test, Question, Option, Attempt, Answer, Result, ShareLink
from .serializers import (TestCardSerializer, TestDetailSerializer, QuestionWithProgressSerializer,
                          AttemptStartSerializer, SaveAnswerSerializer, PublicResultSerializer)
from .services.scoring import compute_result

class TestListView(generics.ListAPIView):
    queryset = Test.objects.filter(is_published=True)
    serializer_class = TestCardSerializer

class TestDetailView(generics.RetrieveAPIView):
    lookup_field = "slug"
    queryset = Test.objects.filter(is_published=True)
    serializer_class = TestDetailSerializer

def _q_count(test: Test) -> int:
    return test.questions.count()

def _question_payload(test: Test, order_index: int):
    q = get_object_or_404(Question, test=test, order_index=order_index)
    data = QuestionWithProgressSerializer(q, context=None).data
    data["progress"] = {"index": order_index, "total": _q_count(test)}
    return data

class AttemptStartView(APIView):
    def post(self, request):
        s = AttemptStartSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        test = get_object_or_404(Test, slug=s.validated_data["test_slug"], is_published=True)
        attempt = Attempt.objects.create(test=test)
        first_q = _question_payload(test, 1)
        return Response({"attempt_id": attempt.id, "first_question": first_q})

class QuestionGetView(APIView):
    def get(self, request, attempt_id: int, idx: int):
        attempt = get_object_or_404(Attempt, pk=attempt_id)
        return Response({"question": _question_payload(attempt.test, idx)})

class AnswerAndNextView(APIView):
    def post(self, request, attempt_id: int):
        attempt = get_object_or_404(Attempt, pk=attempt_id)
        s = SaveAnswerSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        q = get_object_or_404(Question, pk=s.validated_data["question_id"], test=attempt.test)
        ans, _ = Answer.objects.get_or_create(attempt=attempt, question=q)
        if q.type == q.Types.SINGLE:
            opt = get_object_or_404(Option, pk=s.validated_data.get("option_id"), question=q)
            ans.option_single = opt
            ans.option_ids = []
            ans.text_value = ""
        elif q.type == q.Types.MULTIPLE:
            ans.option_single = None
            ans.option_ids = s.validated_data.get("option_ids", [])
            ans.text_value = ""
        else:
            ans.option_single = None
            ans.option_ids = []
            ans.text_value = s.validated_data.get("text_value","")
        ans.save()
        total = _q_count(attempt.test)
        next_idx = q.order_index + 1
        attempt.progress_index = q.order_index
        attempt.save(update_fields=["progress_index","updated_at"])

        if next_idx > total:
            return Response({"next": "finish"})
        return Response({"next_question": _question_payload(attempt.test, next_idx)})

class AttemptFinishView(APIView):
    def post(self, request, attempt_id: int):
        attempt = get_object_or_404(Attempt, pk=attempt_id)
        if attempt.status == attempt.Status.COMPLETED and hasattr(attempt, "result"):
            sl = attempt.share_link
            return Response({"result_id": attempt.result.id, "result_url": f"/results/{sl.uuid}"})
        result = compute_result(attempt)
        attempt.status = attempt.Status.COMPLETED
        attempt.save(update_fields=["status"])
        sl = ShareLink.objects.create(attempt=attempt)
        return Response({"result_id": result.id, "result_url": f"/results/{sl.uuid}"})

class PublicResultView(APIView):
    def get(self, request, uuid: str):
        sl = get_object_or_404(ShareLink, uuid=uuid, is_active=True)
        result = sl.attempt.result
        dims = result.dimensions.all()
        data = {
            "test": {"slug": sl.attempt.test.slug, "title": sl.attempt.test.title},
            "computed_at": result.computed_at,
            "dimensions": [{"code": d.code, "title": d.title, "score": d.score, "level": d.level, "explanation_md": d.explanation_md} for d in dims],
            "summary_md": result.summary_md,
            "viz": {"type":"radar","data":{"labels":[d.code for d in dims], "values":[d.score for d in dims]}},
            "actions": {"can_copy_link": True, "restart_url": f"/tests/{sl.attempt.test.slug}"}
        }
        return Response(data)
