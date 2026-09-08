import httpx
import typing 

class PaywallInterceptor(httpx.Auth):
    """"""
    Middleware to intercept outgoing HTTP requests made by our AI Agent.

    Future Purpose :
    This class will detect '402 Payment Required' responses from merchants, extract the required payment amount and 
    destination, trigger the AgentWallet to make an on-chain stellar payment, and then automatically retry the request.
    """"""

    def auth_flow(self, httpx.Request) -> typing.Generator[httpx.Request, httpx.Response, None]:
        #For now we do nothing except pass the request through. 

        yield request
    