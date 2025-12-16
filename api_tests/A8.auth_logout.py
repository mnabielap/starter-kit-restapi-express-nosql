import sys
import os
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
import utils

def run():
    url = f"{utils.BASE_URL}/auth/logout"
    
    refresh_token = utils.load_config("refresh_token")
    if not refresh_token:
        print("[ERROR] Refresh token not found.")
        return

    payload = {
        "refreshToken": refresh_token
    }
    
    utils.send_and_print(
        url=url,
        method="POST",
        body=payload,
        output_file=f"{os.path.splitext(os.path.basename(__file__))[0]}.json"
    )

if __name__ == "__main__":
    run()