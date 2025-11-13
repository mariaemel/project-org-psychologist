from __future__ import annotations
from dataclasses import dataclass
from statistics import mean
from typing import Dict, List, Tuple

from django.db import transaction
from django.utils import timezone

from ..models import Answer, Attempt, Result, ResultDimension


STYLE_CODES = ("ИНФОРМИРОВАНИЕ", "ОБУЧЕНИЕ", "ПОДДЕРЖКА", "ДЕЛЕГИРОВАНИЕ")

STYLE_TITLES = {
    "ИНФОРМИРОВАНИЕ": "Информирование (директивный/инструктирующий)",
    "ОБУЧЕНИЕ": "Обучение (коучинговый)",
    "ПОДДЕРЖКА": "Поддержка (совместный)",
    "ДЕЛЕГИРОВАНИЕ": "Делегирование (доверительный)",
}

def level_for(score: int) -> str:
    if score <= 20:
        return "Стиль не выражен"
    if score <= 30:
        return "Слабо выражен"
    if score <= 70:
        return "Выражен"
    return "Ярко выражен"


@dataclass
class QuestionAggregate:
    question_id: int
    order_index: int
    grades: List[int]
    dim_codes: List[str]
    avg: float
    flat: bool
    inconsistent: bool


def _parse_grade(val) -> int:
    try:
        g = int(str(val).strip())
    except Exception:
        return 0
    return g if 1 <= g <= 9 else 0


def _check_inconsistency(grades: List[int]) -> bool:
    if len(grades) < 2:
        return False
    return max(grades) - min(grades) > 5


def _aggregate_by_question(answers: List[Answer]) -> List[QuestionAggregate]:
    by_q: Dict[int, Dict] = {}

    for a in answers:
        qid = a.question_id
        item = by_q.setdefault(qid, {
            "order_index": a.question.order_index,
            "grades": [],
            "dim_codes": [],
        })
        item["grades"].append(_parse_grade(a.text_value))

        dimension_code = ""
        if a.option_single and hasattr(a.option_single, 'dimension_code') and a.option_single.dimension_code:
            dimension_code = a.option_single.dimension_code.strip()
        else:
            dimension_code = f"Q{a.question.order_index}_OPT{getattr(a.option_single, 'id', '0')}"

        item["dim_codes"].append(dimension_code)

    result: List[QuestionAggregate] = []
    for qid, data in by_q.items():
        grades = data["grades"][:4]
        if len(grades) < 4:
            grades = grades + [0] * (4 - len(grades))

        dim_codes = data["dim_codes"][:4]
        if len(dim_codes) < 4:
            dim_codes = dim_codes + [""] * (4 - len(dim_codes))

        avg = mean(grades) if grades else 0.0
        flat = len(set(grades)) == 1
        inconsistent = _check_inconsistency(grades)

        result.append(QuestionAggregate(
            question_id=qid,
            order_index=data["order_index"],
            grades=grades,
            dim_codes=dim_codes,
            avg=avg,
            flat=flat,
            inconsistent=inconsistent
        ))

    result.sort(key=lambda x: x.order_index)
    return result


def _sum_scores(per_q: List[QuestionAggregate]) -> Dict[str, int]:
    scores = {code: 0 for code in STYLE_CODES}
    for q in per_q:
        for grade, code in zip(q.grades, q.dim_codes):
            if code in scores:
                scores[code] += int(grade)
    return scores


def _detect_asymmetry(per_q: List[QuestionAggregate]) -> bool:
    avgs = [q.avg for q in per_q]
    if not avgs:
        return False
    high = sum(1 for a in avgs if a >= 7.0)
    low = sum(1 for a in avgs if a <= 2.0)
    return (2 <= high <= 3) and (low >= (len(avgs) - high - 1))


def _too_many_strongs(scores: Dict[str, int]) -> bool:
    sorted_scores = sorted(scores.values(), reverse=True)
    if len(sorted_scores) < 3:
        return False
    top2, top3 = sorted_scores[1], sorted_scores[2]
    return top3 * 2 > top2


def _all_close(scores: Dict[str, int]) -> bool:
    return (max(scores.values()) - min(scores.values())) < 10


def _build_summary(scores: Dict[str, int],
                   per_q: List[QuestionAggregate],
                   duration_sec: float) -> Tuple[str, Dict]:
    levels = {code: level_for(v) for code, v in scores.items()}
    sorted_items = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    main_code, main_score = sorted_items[0]
    second_code, second_score = sorted_items[1]

    flat_questions = [q.order_index for q in per_q if q.flat]
    inconsistent_questions = [q.order_index for q in per_q if q.inconsistent]
    asymmetry = _detect_asymmetry(per_q)
    many_strongs = _too_many_strongs(scores)
    close_all = _all_close(scores)
    fast_attempt = duration_sec < 120

    flags = {
        "flat_questions": flat_questions,
        "inconsistent_questions": inconsistent_questions,
        "asymmetry": asymmetry,
        "too_many_strongs": many_strongs,
        "all_close": close_all,
        "fast_attempt": fast_attempt,
        "duration_sec": duration_sec,
    }

    lines = []
    lines.append(f"Ваш ведущий стиль: **{STYLE_TITLES.get(main_code, main_code)}** ({main_score} баллов).")
    lines.append(f"Уровень выраженности: {levels[main_code]}.")

    if second_score > 0:
        lines.append(f"Также заметен стиль: **{STYLE_TITLES.get(second_code, second_code)}** ({second_score} баллов).")

    warn = []
    if flat_questions:
        warn.append(f"Однотипные оценки в ситуациях: {flat_questions}.")
    if inconsistent_questions:
        warn.append(f"Неконсистентные распределения в ситуациях: {inconsistent_questions}.")
    if asymmetry:
        warn.append("Высокие оценки сосредоточены лишь в нескольких ситуациях — профиль может быть ситуационным.")
    if close_all:
        warn.append("Все стили набрали почти одинаковые баллы (<10 разницы) — профиль неустойчив.")
    if many_strongs:
        warn.append("Слишком много выраженных стилей одновременно — требуется уточнение.")
    if fast_attempt:
        warn.append("Прохождение было очень быстрым (<2 минут) — ответы могут быть невнимательными.")

    if warn:
        lines.append("")
        lines.append("Замечания по достоверности:")
        lines += [f"- {w}" for w in warn]

    summary_md = "\n".join(lines)
    raw = {
        "scores": scores,
        "levels": levels,
        "per_question": [
            {
                "question_id": q.question_id,
                "order_index": q.order_index,
                "grades": q.grades,
                "flat": q.flat,
                "inconsistent": q.inconsistent,
                "avg": q.avg,
            }
            for q in per_q
        ],
        "flags": flags,
    }
    return summary_md, raw


@transaction.atomic
def compute_leadership_result(attempt_id: int) -> Result:
    attempt = Attempt.objects.select_related("test").get(pk=attempt_id)
    answers = (
        Answer.objects
        .select_related("question", "option_single")
        .filter(attempt=attempt)
    )

    per_q = _aggregate_by_question(list(answers))
    scores = _sum_scores(per_q)

    delta = (attempt.updated_at - attempt.started_at) if attempt.updated_at else (timezone.now() - attempt.started_at)
    duration_sec = delta.total_seconds()
    summary_md, raw = _build_summary(scores, per_q, duration_sec)

    viz_data = {
        "type": "pie",
        "data": {
            "labels": [STYLE_TITLES[c] for c in STYLE_CODES],
            "values": [scores[c] for c in STYLE_CODES],
        }
    }
    raw["viz"] = viz_data

    result, _ = Result.objects.update_or_create(
        attempt=attempt,
        defaults={
            "summary_md": summary_md,
            "raw_json": raw,
            "computed_at": timezone.now(),
        }
    )

    result.dimensions.all().delete()
    for code in STYLE_CODES:
        ResultDimension.objects.create(
            result=result,
            code=code,
            title=STYLE_TITLES.get(code, code),
            score=scores.get(code, 0),
            level=level_for(scores.get(code, 0)),
            explanation_md="",
        )

    return result

def compute_result(attempt) -> Result:
    slug = attempt.test.slug
    if slug == "leadership-styles":
        return compute_leadership_result(attempt.id)
    raise NotImplementedError(f"Scoring not implemented for test: {slug}")
