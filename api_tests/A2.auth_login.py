import sys
import os
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
import utils

def run():
    url = f"{utils.BASE_URL}/auth/login"
    
    payload = {
        "email": "admin@example.com",
        "password": "Password123"
    }
    
    response = utils.send_and_print(
        url=url,
        method="POST",
        body=payload,
        output_file=f"{os.path.splitext(os.path.basename(__file__))[0]}.json"
    )
    
    if response.status_code == 200:
        data = response.json()
        if data and "tokens" in data and "user" in data:
            utils.save_config("access_token", data["tokens"]["access"]["token"])
            utils.save_config("refresh_token", data["tokens"]["refresh"]["token"])
            utils.save_config("user_id", data["user"]["id"])
            print("\n[INFO] Tokens and User ID saved to secrets.json")

if __name__ == "__main__":
    run()