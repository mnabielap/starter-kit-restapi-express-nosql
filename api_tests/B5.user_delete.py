import sys
import os
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
import utils

def run():
    user_id = utils.load_config("user_id")
    if not user_id:
        user_id = "000000000000000000000000"
    
    url = f"{utils.BASE_URL}/users/{user_id}"
    
    access_token = utils.load_config("access_token")
    headers = {"Authorization": f"Bearer {access_token}"} if access_token else {}
    
    utils.send_and_print(
        url=url,
        method="DELETE",
        headers=headers,
        output_file=f"{os.path.splitext(os.path.basename(__file__))[0]}.json"
    )

if __name__ == "__main__":
    run()