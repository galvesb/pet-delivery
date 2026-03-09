import logging
import re


class SensitiveDataFilter(logging.Filter):
    """Remove dados sensíveis dos logs (senhas, tokens)."""

    PATTERNS = [
        r'"password"\s*:\s*"[^"]*"',
        r'"hashed_password"\s*:\s*"[^"]*"',
        r'"token"\s*:\s*"[^"]*"',
        r'Bearer\s+[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+',
        r'"refresh_token"\s*:\s*"[^"]*"',
    ]

    def filter(self, record: logging.LogRecord) -> bool:
        msg = str(record.getMessage())
        for pattern in self.PATTERNS:
            msg = re.sub(pattern, "[REDACTED]", msg)
        record.msg = msg
        record.args = ()
        return True


def setup_logging() -> None:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    )
    sensitive_filter = SensitiveDataFilter()
    for handler in logging.root.handlers:
        handler.addFilter(sensitive_filter)
