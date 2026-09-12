import httpx
import pytest
from pytest_httpx import HTTPXMock
from stellar_m2m.constants import HEADER_PAYMENT_AMOUNT, HEADER_PAYMENT_DESTINATION

def test_mock_merchant_402_response(httpx_mock: HTTPXMock):
    """
    Test that we can mock a merchant endpoint returning a 402 Payment Required
    with our custom Stellar payment headers.
    """
    mock_url = "https://api.mock-merchant.com/data"
    
    # Configure the mock to return 402 and the required headers
    httpx_mock.add_response(
        url=mock_url,
        status_code=402,
        headers={
            HEADER_PAYMENT_AMOUNT: "5.0",
            HEADER_PAYMENT_DESTINATION: "GBOQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQ"
        }
    )
    
    # Make a request using standard httpx client to the mocked endpoint
    with httpx.Client() as client:
        response = client.get(mock_url)
        
    assert response.status_code == 402
    assert response.headers[HEADER_PAYMENT_AMOUNT] == "5.0"
    assert response.headers[HEADER_PAYMENT_DESTINATION] == "GBOQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQ"
