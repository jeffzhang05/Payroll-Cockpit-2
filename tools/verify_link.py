import urllib.request
import json
import sys

def verify_connection():
    url = "http://localhost:3000/api/connection-status"
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            if data.get('connected'):
                print(f"[SUCCESS] Link established to '{data.get('system')}' via {url}")
                sys.exit(0)
            else:
                print(f"[FAIL] Connected but received unexpected payload: {data}")
                sys.exit(1)
    except Exception as e:
        print(f"[FAIL] Could not connect to {url}. Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    verify_connection()
