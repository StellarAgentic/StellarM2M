from stellar_sdk import Keypair, Server

class AgentWallet:

    def __init__(self, keypair: Keypair, network_passphrase: str = "Test SDF Network ; September 2015"):

        self.keypair = keypair

        self.network_passphrase = network_passphrase

        # connect to the official Testnet Horizon server

        self.server = Server("https://horizon-testnet.stellar.org")
    
    @classmethod

    def from_secret(cls, secret_key: str):

        """Initialize the wallet from a Secret Key string (starts with 'S')."""

        keypair = Keypair.from_secret(secret_key)

        return cls(keypair=keypair)

    def get_balance(self) -> str:
        """Fetch the current XLM balance of the agent's wallet."""

        public_key = self.keypair.public_key

        try:

            #Ask the blockchain for all data about this public key

            account_data = self.server.accounts().account_id(public_key).call()

            #search through the balances for the XLM(asset_type =native)

            for balance in account_data['balances']:

                if balance['asset_type'] == 'native':

                    return balance['balance']
            
            return "0.00"

        except Exception as e:

            #If the account doesn't exist on the network yet
            if "404" in str(e):

                return "0.00 (Unfunded)"

            raise e

