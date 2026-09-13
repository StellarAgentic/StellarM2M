from stellar_m2m.interceptor import PaywallInterceptor
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


@pytest.mark.asyncio
async def test_interceptor_detects_402(httpx_mock: HTTPXMock, capsys, monkeypatch):
    """
    Test that PaywallInterceptor correctly yields the request, reads the 402 status code,
    and prints the debug message.
    """
    mock_url = "https://api.mock-merchant.com/data"
    
    from stellar_m2m.constants import HEADER_TX_HASH
    
    # Configure the mock to return 402 on the first request
    httpx_mock.add_response(
        url=mock_url,
        status_code=402,
        headers={
            HEADER_PAYMENT_AMOUNT: "5.0",
            HEADER_PAYMENT_DESTINATION: "GBOQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQ"
        }
    )
    
    # Configure the mock to return 200 on the second request (when retry happens with the hash)
    httpx_mock.add_response(
        url=mock_url,
        status_code=200,
        match_headers={HEADER_TX_HASH: "mock_tx_hash"}
    )
    
    class MockWallet:
        async def pay(self, amount, destination):
            return "mock_tx_hash"
            
    # Make a request using the client WITH the interceptor attached
    async with httpx.AsyncClient(auth=PaywallInterceptor(wallet=MockWallet())) as client:
        response = await client.get(mock_url)
        
    assert response.status_code == 200
    
    # Capture printed output to verify the interceptor caught it
    captured = capsys.readouterr()
    assert "402 Paywall detected!" in captured.out


@pytest.mark.asyncio
async def test_interceptor_handles_failed_payment(httpx_mock: HTTPXMock, capsys, monkeypatch):
    """
    Test that PaywallInterceptor catches payment exceptions and returns the 402 response.
    """
    mock_url = "https://api.mock-merchant.com/data"
    
    # Configure the mock to return 402
    httpx_mock.add_response(
        url=mock_url,
        status_code=402,
        headers={
            HEADER_PAYMENT_AMOUNT: "5.0",
            HEADER_PAYMENT_DESTINATION: "GBOQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQYQ"
        }
    )
    
    # Create a mock AgentWallet that raises an Exception on pay
    class MockWallet:
        async def pay(self, amount, destination):
            raise Exception("Insufficient funds")
            
    # Make a request using the client WITH the interceptor attached
    # httpx.AsyncClient is required for async_auth_flow
    async with httpx.AsyncClient(auth=PaywallInterceptor(wallet=MockWallet())) as client:
        response = await client.get(mock_url)
        
    assert response.status_code == 402
    
    # Capture printed output to verify the interceptor caught it
    captured = capsys.readouterr()
    assert "Warning: Payment failed: Insufficient funds" in captured.out
