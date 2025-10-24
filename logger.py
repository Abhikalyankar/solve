import logging, json
from datetime import datetime

class JsonFormatter(logging.Formatter):
    def format(self, record):
        base = {
            "ts": datetime.utcnow().isoformat() + "Z",
            "level": record.levelname,
            "msg": record.getMessage(),
            "file": record.pathname,
            "line": record.lineno,
        }
        return json.dumps(base)

def init_logging():
    handler = logging.FileHandler("server.log")
    handler.setFormatter(JsonFormatter())
    logger = logging.getLogger()
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)
    return logger
