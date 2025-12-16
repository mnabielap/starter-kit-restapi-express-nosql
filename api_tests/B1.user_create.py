import sys
import os
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
import utils

def run():
    url = f"{utils.BASE_URL}/users"
    
    access_token = utils.load_config("access_token")
    headers = {"Authorization": f"Bearer {access_token}"} if access_token else {}
    
    payload = {
        "name": "Admin Created User",
        "email": "admin_created@example.com",
        "password": "Password123",
        "role": "user"
    }
    
    utils.send_and_print(
        url=url,
        method="POST",
        headers=headers,
        body=payload,
        output_file=f"{os.path.splitext(os.path.basename(__file__))[0]}.json"
    )

if __name__ == "__main__":
    run()