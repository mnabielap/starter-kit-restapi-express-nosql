import sys
import os
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
import utils

def run():
    verify_token_placeholder = "COPY_TOKEN_FROM_CONSOLE_HERE"
    
    url = f"{utils.BASE_URL}/auth/verify-email?token={verify_token_placeholder}"
    
    utils.send_and_print(
        url=url,
        method="POST",
        output_file=f"{os.path.splitext(os.path.basename(__file__))[0]}.json"
    )

if __name__ == "__main__":
    run()