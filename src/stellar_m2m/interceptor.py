import httpx
import typing 
from stellar_m2m.wallet import AgentWallet

class PaywallInterceptor(httpx.Auth):
    """
    Middleware to intercept outgoing HTTP requests made by our AI Agent.

    Future Purpose :
    This class will detect '402 Payment Required' responses from merchants, extract the required payment amount and 
    destination, trigger the AgentWallet to make an on-chain stellar payment, and then automatically retry the request.
    """

    def __init__(self, wallet: AgentWallet):
        self.wallet = wallet

    async def async_auth_flow(self, request: httpx.Request) -> typing.AsyncGenerator[httpx.Request, httpx.Response]:
        response = yield request
        
        if response.status_code == 402:
            print("402 Paywall detected!")
            from stellar_m2m.parsers import (
                extract_payment_amount,
                extract_payment_destination,
                validate_merchant_headers
            )
            validate_merchant_headers(response.headers)
            amount = extract_payment_amount(response.headers)
            destination = extract_payment_destination(response.headers)
            
            tx_hash = await self.wallet.pay(amount, destination)
