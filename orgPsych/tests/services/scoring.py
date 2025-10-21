from ..models import Attempt, Answer, Result, ResultDimension, ScoringRule, Question

def compute_result(attempt: Attempt) -> Result:
    test = attempt.test
    rule = test.scoring_rules.first()
    answers = Answer.objects.filter(attempt=attempt).select_related("question","option_single")
    scores = {}
    max_scores = {}
    if rule and rule.rule_type == "linear_weights":
        payload = rule.rule_payload_json or {}
        scale = payload.get("scale","MAIN")
        for ans in answers:
            if ans.question.type == Question.Types.SINGLE and ans.option_single:
                w = (ans.option_single.weights_json or {}).get(scale, {})
                for dim, val in w.items():
                    scores[dim] = scores.get(dim, 0) + float(val)
                    max_scores[dim] = max(max_scores.get(dim, 0), scores[dim])
            elif ans.question.type == Question.Types.MULTIPLE:
                pass
        total_max = max(scores.values() or [1])
        norm = {k: round(v * 100.0 / total_max, 2) for k, v in scores.items()}

        res = Result.objects.create(
            attempt=attempt,
            raw_json={"scores_raw": scores, "scores_norm": norm, "rule_payload": payload}
        )
        levels = payload.get("levels", [])
        titles = payload.get("dimension_titles", {})
        for code, val in norm.items():
            level = _level_for(val, levels)
            ResultDimension.objects.create(
                result=res, code=code, title=titles.get(code, code), score=val, level=level
            )
        return res
    return Result.objects.create(attempt=attempt, raw_json={"note": "no rules"})

def _level_for(value, levels):
    for lvl in levels:
        lo, hi = lvl["range"]
        if lo <= value <= hi:
            return lvl["code"]
    return "unknown"
