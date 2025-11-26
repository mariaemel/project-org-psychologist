from __future__ import annotations
from typing import Callable, Dict
from django.core.exceptions import ImproperlyConfigured

from .leadership_styles import compute as compute_leadership_styles
from .career_anchors import compute as compute_career_anchors
from ...models import Attempt, Result

_REGISTRY: Dict[str, Callable[[Attempt], Result]] = {
    "leadership-styles": compute_leadership_styles,
    "career-anchors": compute_career_anchors,
}

def compute_result(attempt: Attempt) -> Result:
    slug = attempt.test.slug
    try:
        fn = _REGISTRY[slug]
    except KeyError:
        raise ImproperlyConfigured(f"No scoring registered for test slug '{slug}'")
    return fn(attempt)
