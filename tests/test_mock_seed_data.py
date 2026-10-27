import asyncio

import mongomock_motor

from backend.seed_data import seed_db


async def _seed_counts():
    client = mongomock_motor.AsyncMongoMockClient('mongodb://localhost:27017')
    db = client['test_seed']
    result = await seed_db(db)
    return result


def test_seed_db_includes_admin_content_collections():
    result = asyncio.run(_seed_counts())

    assert result['seeded'] is True
    assert 'counts' in result
    for key in [
        'courses',
        'faculty',
        'toppers',
        'results',
        'testimonials',
        'blogs',
        'news',
        'gallery',
        'banners',
        'counters',
        'faqs',
        'programs-strip',
        'why-us',
        'centres',
    ]:
        assert key in result['counts'], f'missing seed data for {key}'
        assert result['counts'][key] > 0, f'no seed entries for {key}'
