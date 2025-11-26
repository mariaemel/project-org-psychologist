from __future__ import annotations
from typing import Dict, List, Tuple
from dataclasses import dataclass
from statistics import mean
from django.db import transaction
from django.utils import timezone

from ...models import Attempt, Answer, Result, ResultDimension

ANCHOR_CODES = [
    "ПРОФКОМПЕТЕНТНОСТЬ",
    "МЕНЕДЖМЕНТ",
    "АВТОНОМИЯ",
    "СТАБИЛЬНОСТЬ_РАБОТЫ",
    "СТАБИЛЬНОСТЬ_МЕСТА",
    "СЛУЖЕНИЕ",
    "ВЫЗОВ",
    "ИНТЕГРАЦИЯ_ЖИЗНИ",
    "ПРЕДПРИНИМАТЕЛЬСТВО",
]
ANCHOR_TITLES = {
    "ПРОФКОМПЕТЕНТНОСТЬ": "Профессиональная компетентность",
    "МЕНЕДЖМЕНТ": "Менеджмент",
    "АВТОНОМИЯ": "Автономия (независимость)",
    "СТАБИЛЬНОСТЬ_РАБОТЫ": "Стабильность работы",
    "СТАБИЛЬНОСТЬ_МЕСТА": "Стабильность места жительства",
    "СЛУЖЕНИЕ": "Служение",
    "ВЫЗОВ": "Вызов",
    "ИНТЕГРАЦИЯ_ЖИЗНИ": "Интеграция стилей жизни",
    "ПРЕДПРИНИМАТЕЛЬСТВО": "Предпринимательство",
}

KEY: Dict[str, List[int]] = {
    "ПРОФКОМПЕТЕНТНОСТЬ": [1, 9, 17, 25, 33],
    "МЕНЕДЖМЕНТ": [2, 10, 18, 26, 34],
    "АВТОНОМИЯ": [3, 11, 19, 27, 35],
    "СТАБИЛЬНОСТЬ_РАБОТЫ": [4, 12, 36],
    "СТАБИЛЬНОСТЬ_МЕСТА": [20, 28, 41],
    "СЛУЖЕНИЕ": [5, 13, 21, 29, 37],
    "ВЫЗОВ": [6, 14, 22, 30, 38],
    "ИНТЕГРАЦИЯ_ЖИЗНИ": [7, 15, 23, 31, 39],
    "ПРЕДПРИНИМАТЕЛЬСТВО": [8, 16, 24, 32, 40],
}

def _grade(val) -> int:
    try:
        x = int(str(val).strip())
    except Exception:
        return 0
    return min(10, max(1, x))

def _level(avg: float) -> str:
    if avg >= 8:
        return "Высокий"
    if avg >= 6:
        return "Заметный"
    if avg >= 4:
        return "Умеренный"
    return "Низкий"

@transaction.atomic
def compute(attempt: Attempt) -> Result:
    answers = (
        Answer.objects
        .select_related("question")
        .filter(attempt=attempt)
        .only("text_value", "question__order_index")
    )

    by_idx: Dict[int, int] = {}
    for a in answers:
        idx = a.question.order_index
        by_idx[idx] = _grade(a.text_value)

    avgs: Dict[str, float] = {}
    for code, qnums in KEY.items():
        vals = [_grade(by_idx.get(n, 0)) for n in qnums]
        avgs[code] = (sum(vals) / len(qnums)) if qnums else 0.0

    sorted_items = sorted(avgs.items(), key=lambda x: x[1], reverse=True)
    top1_code, top1 = sorted_items[0]
    top2_code, top2 = sorted_items[1]

    summary_lines: List[str] = []
    edge_note = ""

    if all(v <= 5 for v in avgs.values()):
        edge_note = ("У вас не выделился ни один из карьерных якорей. "
                     "Это может означать, что сейчас карьера не является для вас важной целью.")
    else:
        max_val = sorted_items[0][1]
        same_max = [c for c, v in avgs.items() if abs(v - max_val) < 1e-9]
        if max_val > 5 and len(same_max) >= 2:
            edge_note = ("У вас нет ярко выраженных карьерных якорей. "
                         "Это может означать, что на данный момент ни одно профессиональное направление не доминирует.")

    if not edge_note:
        shown = []
        if top1 > 5:
            shown.append((top1_code, top1))
        if top2 > 5:
            shown.append((top2_code, top2))
        for code, val in shown[:2]:
            summary_lines.append(f"**{ANCHOR_TITLES[code]}** — {val:.1f} / 10 ({_level(val)}).")

    summary_md = "\n".join(summary_lines) if summary_lines else edge_note or "Недостаточно данных."

    result, _ = Result.objects.update_or_create(
        attempt=attempt,
        defaults={
            "summary_md": summary_md,
            "raw_json": {
                "avgs": avgs,
                "ordered": sorted_items,
                "edge_note": edge_note,
                "viz": {
                    "type": "radar",
                    "data": {
                        "labels": [ANCHOR_TITLES[c] for c in ANCHOR_CODES],
                        "values": [avgs[c] for c in ANCHOR_CODES],
                    }
                },
            },
            "computed_at": timezone.now(),
        }
    )

    result.dimensions.all().delete()
    for code in ANCHOR_CODES:
        val = avgs.get(code, 0.0)
        ResultDimension.objects.create(
            result=result,
            code=code,
            title=ANCHOR_TITLES[code],
            score=val,
            level=_level(val),
            explanation_md="",
        )
    return result
