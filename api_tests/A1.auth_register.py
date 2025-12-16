import sys
import os
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
import utils

def run():
    url = f"{utils.BASE_URL}/auth/register"
    
    payload = {
        "name": "Test User Python",
        "email": "python_test@example.com",
        "password": "Password123"
    }
    
    response = utils.send_and_print(
        url=url,
        method="POST",
        body=payload,
        output_file=f"{os.path.splitext(os.path.basename(__file__))[0]}.json"
    )

if __name__ == "__main__":
    run()