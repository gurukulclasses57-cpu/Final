from datetime import datetime

from zoneinfo import ZoneInfo

from backend.server import compute_exam_status


def _india_now(iso_value: str):
    return datetime.fromisoformat(iso_value).replace(tzinfo=ZoneInfo('Asia/Kolkata'))


def test_same_day_live_window_is_not_completed_before_end_time():
    exam = {
        'status': 'Scheduled',
        'exam_date': '2025-01-15',
        'start_time': '09:00 AM',
        'end_time': '10:00 PM',
        'timezone': 'Asia/Kolkata',
    }

    assert compute_exam_status(exam, now_override=_india_now('2025-01-15T18:00:00+05:30')) == 'Live'


def test_future_exam_before_start_is_scheduled():
    exam = {
        'status': 'Scheduled',
        'exam_date': '2025-01-16',
        'start_time': '09:00 AM',
        'end_time': '10:00 PM',
        'registration_deadline': '2025-01-15T23:59:00+05:30',
        'timezone': 'Asia/Kolkata',
    }

    assert compute_exam_status(exam, now_override=_india_now('2025-01-15T12:00:00+05:30')) == 'Registration Open'


def test_exam_after_end_time_is_completed():
    exam = {
        'status': 'Scheduled',
        'exam_date': '2025-01-15',
        'start_time': '09:00 AM',
        'end_time': '10:00 PM',
        'timezone': 'Asia/Kolkata',
    }

    assert compute_exam_status(exam, now_override=_india_now('2025-01-16T08:00:00+05:30')) == 'Completed'


def test_cancelled_exam_stays_cancelled():
    exam = {
        'status': 'Cancelled',
        'exam_date': '2025-01-15',
        'start_time': '09:00 AM',
        'end_time': '10:00 PM',
        'timezone': 'Asia/Kolkata',
    }

    assert compute_exam_status(exam, now_override=_india_now('2025-01-15T18:00:00+05:30')) == 'Cancelled'
