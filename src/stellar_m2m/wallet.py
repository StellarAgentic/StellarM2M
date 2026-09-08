from stellar_sdk import Keypair, Server

#create the blueprint for the agent wallet

class AgentWallet:
    def __init__(self, keypair: Keypair, network_passphrase: str = "Test SDF Network ; September 2015"):

        self.keypair = keypair
        self.network_passphrase = network_passphrase
        self.server= Server("https://horizon-testnet.stellar.org")

    #automaically create the wallet for the agent using only secret key 

    @classmethod 
    def from_secret(cls, secret_key: str):

        keypair = Keypair.from_secret(secret_key)
        return cls(keypair=keypair)

    #get the balance of the agent's wallet

    def get_balance(self) -> str :

        public_key = self.keypair.public_key

        try:
            account_data = self.server.accounts().account_id(public_key).call()


            for balance in account_data['balances']:
                if balance['asset_type']== 'native':
                    return balance['balance']

            return "0.0"
        
        except Exception as e:
            if "404" in str(e):
                return "0.0(unfunded)"
            raise e 

if __name__ == "__main__":
    from stellar_sdk import Keypair
    random_secret = Keypair.random().secret
    print(f"Testing with secret key: {random_secret}")
    my_wallet = AgentWallet.from_secret(random_secret)
    balance = my_wallet.get_balance()
    print(f"Balance for wallet with public key {my_wallet.keypair.public_key}: {balance}")

    