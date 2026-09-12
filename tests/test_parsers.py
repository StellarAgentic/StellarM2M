import httpx
import pytest
from stellar_m2m.constants import HEADER_PAYMENT_AMOUNT
from stellar_m2m.parsers import extract_payment_amount

def test_extract_payment_amount_success():
    response = httpx.Response(
        status_code=402,
        headers={HEADER_PAYMENT_AMOUNT: "15.5"}
    )
    
    amount = extract_payment_amount(response)
    assert amount == 15.5
    assert isinstance(amount, float)

def test_extract_payment_amount_missing_header():
    response = httpx.Response(
        status_code=402,
        headers={}
    )
    
    with pytest.raises(ValueError):
        extract_payment_amount(response)
