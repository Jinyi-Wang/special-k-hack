import requests
import json

# The URL you want to send the POST request to
# url = "http://localhost:3000/chat/47a4a51e-4430-42f3-a777-71d5b07e68af"
# url = "http://localhost:3000/api/chats/generate"
# url = "http://localhost:3000/api/chats/083cc250-6b5a-4e2f-a5b6-c67d1a27e26b/messages"
url = "http://localhost:3000/api/chats/a68af801-b967-437b-9070-66c0face2e28/messages"


'''
api/chats -- ok
api/chats/{chat_id} --ok
api/chats/{chat_id}/messages -- Failed with status code: 422
    Response: {"detail":[{"type":"missing","loc":["body","content"],"msg":"Field required","input":{"messages":[{"role":"system","content":"Hello, how can I assist you today?"},{"role":"user","content":"I have an issue with my order."},{"role":"system","content":"Hello again"},{"role":"user","content":"Bye."}]}}]}
    Response: <Response [422]>
'''

# Data you want to send in the request (example data)
data = {
    "messages": [
        {
            "role": "system",
            "content": "Hello, how can I assist you today?"
        },
        {
            "role": "user",
            "content": "I have an issue with my order."
        },
                {
            "role": "system",
            "content": "Hello again"
        },
        {
            "role": "user",
            "content": "Bye."
        }
    ]
}




# Sending a POST request with the JSON data
# response = requests.get(url, json=data)
response = requests.post(url, json=data)

# Checking the response
if response.status_code == 200:
    print("Request was successful!")
    print("Response:", response.json())  # If response is JSON
else:
    print(f"Failed with status code: {response.status_code}")
    print("Response:", response.text)
    print("Response:", response)
