import httpx
from stellar_m2m.constants import HEADER_PAYMENT_AMOUNT

def extract_payment_amount(response: httpx.Response) -> float:
    """Extract the required payment amount from a 402 Payment Required response."""
    amount_str = response.headers.get(HEADER_PAYMENT_AMOUNT)
    if amount_str is None:
        raise ValueError(f"Missing required header: {HEADER_PAYMENT_AMOUNT}")
    return float(amount_str)
