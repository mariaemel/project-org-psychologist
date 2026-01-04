from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple

from django.db import transaction
from django.utils import timezone

from ...models import Answer, Attempt, Result, ResultDimension

DIM_CODES = ("D", "I", "S", "C")
DIM_TITLES = {
    "D": "Dominance (D)",
    "I": "Influence (I)",
    "S": "Steadiness (S)",
    "C": "Conscientiousness (C)",
}

WEIGHTS_1_4 = {1: 2, 2: 1, 3: -1, 4: -2}
WEIGHTS_0_3 = {0: 2, 1: 1, 2: -1, 3: -2}


def _parse_rank(val) -> Optional[int]:
    if val is None:
        return None
    try:
        return int(str(val).strip())
    except Exception:
        return None


def _percent_from_raw(raw: int) -> int:
    return int(round((raw + 40) / 80 * 100))


def _level_from_percent(p: int) -> str:
    if p <= 33:
        return "низкий"
    if p <= 66:
        return "средний"
    return "высокий"


@dataclass
class ProfileResult:
    type_code: str
    raw: Dict[str, int]
    percent: Dict[str, int]
    balanced: bool


def _compute_type(raw: Dict[str, int]) -> Tuple[str, bool]:
    sorted_dims = sorted(DIM_CODES, key=lambda c: raw.get(c, 0), reverse=True)
    top1, top2 = sorted_dims[0], sorted_dims[1]
    top1_v, top2_v = raw.get(top1, 0), raw.get(top2, 0)

    mixed = (top1_v - top2_v) < 4
    balanced = (max(raw.values()) - min(raw.values())) < 6

    if mixed:
        return f"{top1}{top2}", balanced
    return top1, balanced


def _build_summary_md(work: ProfileResult, stress: ProfileResult, flags: Dict) -> str:
    def fmt_profile(title: str, pr: ProfileResult) -> str:
        raw_s = ", ".join([f"{k}={pr.raw[k]}" for k in DIM_CODES])
        perc_s = ", ".join([f"{k}={pr.percent[k]}%" for k in DIM_CODES])
        line = f"**{title}**: тип **{pr.type_code}**  \\nСырые баллы: {raw_s}  \\nВыраженность: {perc_s}"
        if pr.balanced:
            line += "  \\n_Профиль выглядит сбалансированным._"
        return line

    lines: List[str] = []
    lines.append(fmt_profile("Профиль «В работе»", work))
    lines.append("")
    lines.append(fmt_profile("Профиль «В стрессе»", stress))

    warn: List[str] = []
    if flags.get("missing_questions"):
        warn.append(f"Не по всем вопросам есть ответы: {flags['missing_questions']}.")
    if flags.get("missing_options_questions"):
        warn.append(f"В некоторых вопросах не заполнены все 4 ранга: {flags['missing_options_questions']}.")
    if flags.get("duplicate_ranks_questions"):
        warn.append(f"В некоторых вопросах повторяются ранги: {flags['duplicate_ranks_questions']}.")
    if flags.get("invalid_rank_questions"):
        warn.append(f"В некоторых вопросах встречаются неверные значения ранга: {flags['invalid_rank_questions']} (ожидалось 1–4).")
    if flags.get("fast_attempt"):
        warn.append("Прохождение было очень быстрым — ответы могут быть менее точными.")

    if warn:
        lines.append("")
        lines.append("Замечания по достоверности:")
        for w in warn:
            lines.append(f"- {w}")

    return "\n".join(lines)


@transaction.atomic
def compute(attempt: Attempt) -> Result:
    answers = (
        Answer.objects
        .select_related("question", "option_single")
        .filter(attempt=attempt)
    )

    # question_order -> dim -> rank
    per_q: Dict[int, Dict[str, Optional[int]]] = {}
    for a in answers:
        if not a.option_single:
            continue
        dim = (a.option_single.dimension_code or "").strip()
        if dim not in DIM_CODES:
            continue
        qidx = int(a.question.order_index)
        per_q.setdefault(qidx, {})[dim] = _parse_rank(a.text_value)

    flags: Dict = {
        "missing_questions": [],
        "missing_options_questions": [],
        "duplicate_ranks_questions": [],
        "invalid_rank_questions": [],
        "duration_sec": None,
        "fast_attempt": False,
    }

    work_raw = {d: 0 for d in DIM_CODES}
    stress_raw = {d: 0 for d in DIM_CODES}

    for qidx in range(1, 41):
        dims = per_q.get(qidx)
        if not dims:
            flags["missing_questions"].append(qidx)
            continue

        ranks: List[int] = []
        invalid_rank = False
        for d in DIM_CODES:
            r = dims.get(d)
            if r is None:
                invalid_rank = True
                continue
            if r not in WEIGHTS_1_4 and r not in WEIGHTS_0_3:
                invalid_rank = True
            else:
                ranks.append(r)

        if len(ranks) < 4:
            flags["missing_options_questions"].append(qidx)

        if len(set(ranks)) < len(ranks):
            flags["duplicate_ranks_questions"].append(qidx)

        if invalid_rank:
            flags["invalid_rank_questions"].append(qidx)

        use_03 = all((r in WEIGHTS_0_3) for r in ranks) and not any((r in WEIGHTS_1_4) for r in ranks)
        weight_map = WEIGHTS_0_3 if use_03 else WEIGHTS_1_4

        target = work_raw if qidx <= 20 else stress_raw
        for d in DIM_CODES:
            r = dims.get(d)
            if r is None:
                continue
            w = weight_map.get(r)
            if w is None:
                continue
            target[d] += int(w)

    work_percent = {d: _percent_from_raw(work_raw[d]) for d in DIM_CODES}
    stress_percent = {d: _percent_from_raw(stress_raw[d]) for d in DIM_CODES}

    work_type, work_balanced = _compute_type(work_raw)
    stress_type, stress_balanced = _compute_type(stress_raw)

    work = ProfileResult(type_code=work_type, raw=work_raw, percent=work_percent, balanced=work_balanced)
    stress = ProfileResult(type_code=stress_type, raw=stress_raw, percent=stress_percent, balanced=stress_balanced)

    delta = (attempt.updated_at - attempt.started_at) if attempt.updated_at else (timezone.now() - attempt.started_at)
    duration_sec = float(delta.total_seconds())
    flags["duration_sec"] = duration_sec
    flags["fast_attempt"] = duration_sec < 150

    summary_md = _build_summary_md(work, stress, flags)

    raw_json = {
        "work": {
            "type": work.type_code,
            "raw": work.raw,
            "percent": work.percent,
            "balanced": work.balanced,
        },
        "stress": {
            "type": stress.type_code,
            "raw": stress.raw,
            "percent": stress.percent,
            "balanced": stress.balanced,
        },
        "flags": flags,
        "viz": {
            "type": "disc",
            "data": {
                "labels": list(DIM_CODES),
                "work": {
                    "raw": [work.raw[d] for d in DIM_CODES],
                    "values": [work.percent[d] for d in DIM_CODES],
                },
                "stress": {
                    "raw": [stress.raw[d] for d in DIM_CODES],
                    "values": [stress.percent[d] for d in DIM_CODES],
                },
            }
        }
    }

    result, _ = Result.objects.update_or_create(
        attempt=attempt,
        defaults={
            "summary_md": summary_md,
            "raw_json": raw_json,
            "computed_at": timezone.now(),
        }
    )

    result.dimensions.all().delete()
    for d in DIM_CODES:
        ResultDimension.objects.create(
            result=result,
            code=f"WORK_{d}",
            title=f"В работе — {DIM_TITLES[d]}",
            score=work_percent[d],
            level=_level_from_percent(work_percent[d]),
            explanation_md="",
        )
    for d in DIM_CODES:
        ResultDimension.objects.create(
            result=result,
            code=f"STRESS_{d}",
            title=f"В стрессе — {DIM_TITLES[d]}",
            score=stress_percent[d],
            level=_level_from_percent(stress_percent[d]),
            explanation_md="",
        )

    return result
