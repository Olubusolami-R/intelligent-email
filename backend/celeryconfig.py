from celery.schedules import crontab
# from tasks import print_hello

CELERY_IMPORTS = ('tasks')
CELERY_TASK_RESULT_EXPIRES = 30
CELERY_TIMEZONE = 'UTC'

CELERY_ACCEPT_CONTENT = ['json', 'msgpack', 'yaml']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'

CELERYBEAT_SCHEDULE = {
    'test-celery': {
        'task': 'tasks.poll_inbox',
        # Every minute
        'schedule': crontab(minute="*"),
    }
}