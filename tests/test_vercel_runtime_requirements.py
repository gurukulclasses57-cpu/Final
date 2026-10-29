import pytest


def test_vercel_requires_mongo_and_object_storage(monkeypatch):
    import backend.server as server

    monkeypatch.setenv('VERCEL', '1')
    monkeypatch.delenv('MONGO_URL', raising=False)
    monkeypatch.delenv('AWS_S3_BUCKET', raising=False)
    monkeypatch.delenv('S3_BUCKET', raising=False)
    monkeypatch.delenv('AWS_S3_PUBLIC_BASE_URL', raising=False)
    monkeypatch.delenv('S3_PUBLIC_BASE_URL', raising=False)

    with pytest.raises(RuntimeError, match='MONGO_URL|AWS_S3_BUCKET'):
        server.verify_runtime_requirements()
