import sys
import os
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
import utils

def run():
    url = f"{utils.BASE_URL}/auth/refresh-tokens"
    
    refresh_token = utils.load_config("refresh_token")
    
    if not refresh_token:
        print("[ERROR] Refresh token not found in secrets.json. Please login first (A2).")
        return

    payload = {
        "refreshToken": refresh_token
    }
    
    response = utils.send_and_print(
        url=url,
        method="POST",
        body=payload,
        output_file=f"{os.path.splitext(os.path.basename(__file__))[0]}.json"
    )

    # Update token baru jika berhasil
    if response.status_code == 200:
        data = response.json()
        if data and "access" in data and "refresh" in data:
            utils.save_config("access_token", data["access"]["token"])
            utils.save_config("refresh_token", data["refresh"]["token"])
            print("\n[INFO] New tokens saved to secrets.json")

if __name__ == "__main__":
    run()