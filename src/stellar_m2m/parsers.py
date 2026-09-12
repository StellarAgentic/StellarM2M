import httpx
from stellar_m2m.constants import HEADER_PAYMENT_AMOUNT, HEADER_PAYMENT_DESTINATION

def extract_payment_amount(response: httpx.Response) -> float:
    """Extract the required payment amount from a 402 Payment Required response."""
    amount_str = response.headers.get(HEADER_PAYMENT_AMOUNT)
    if amount_str is None:
        raise ValueError(f"Missing required header: {HEADER_PAYMENT_AMOUNT}")
    return float(amount_str)


def extract_payment_destination(response: httpx.Response) -> str:
    """Extract the merchant's Stellar address from a 402 Payment Required response."""
    destination = response.headers.get(HEADER_PAYMENT_DESTINATION)
    if not destination:
        raise ValueError(f"Missing required header: {HEADER_PAYMENT_DESTINATION}")
    return destination
