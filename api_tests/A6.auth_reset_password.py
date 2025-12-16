import sys
import os
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
import utils

def run():
    reset_token_placeholder = "COPY_TOKEN_FROM_CONSOLE_HERE" 
    
    url = f"{utils.BASE_URL}/auth/reset-password?token={reset_token_placeholder}"
    
    payload = {
        "password": "NewPassword123"
    }
    
    utils.send_and_print(
        url=url,
        method="POST",
        body=payload,
        output_file=f"{os.path.splitext(os.path.basename(__file__))[0]}.json"
    )

if __name__ == "__main__":
    run()