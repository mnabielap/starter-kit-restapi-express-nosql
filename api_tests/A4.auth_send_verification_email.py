import sys
import os
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
import utils

def run():
    url = f"{utils.BASE_URL}/auth/send-verification-email"
    
    access_token = utils.load_config("access_token")
    if not access_token:
        print("[ERROR] Access token not found. Please login first.")
        return

    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    
    utils.send_and_print(
        url=url,
        method="POST",
        headers=headers,
        output_file=f"{os.path.splitext(os.path.basename(__file__))[0]}.json"
    )

if __name__ == "__main__":
    run()