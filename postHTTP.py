import requests
import json
import os

# The URL you want to send the POST request to
# url = "http://localhost:3000/chat/47a4a51e-4430-42f3-a777-71d5b07e68af"
url = "http://localhost:3000/api/chats/generate"


# url = "http://localhost:3000/api/chats/f6242c02-6449-4055-a556-8806f0d4e12d/messages"
# url = "http://localhost:3000/api/chats/07911ce5-99c1-4377-bb69-cdb281d4254b/messages"
# url = "http://localhost:3000/api/chats/d85e2d87-ab96-40b9-b22c-7952568b19e7/messages"



'''
api/chats -- ok
api/chats/{chat_id} --ok
api/chats/{chat_id}/messages -- Failed with status code: 422
    Response: {"detail":[{"type":"missing","loc":["body","content"],"msg":"Field required","input":{"messages":[{"role":"system","content":"Hello, how can I assist you today?"},{"role":"user","content":"I have an issue with my order."},{"role":"system","content":"Hello again"},{"role":"user","content":"Bye."}]}}]}
    Response: <Response [422]>
'''

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
}'''
with open('output_messages.json', 'r') as file:
    data_list = json.load(file)

'''
# Here each time one same conversation is posted to http

# Choose the first conversation (this can be dynamically adjusted or random if needed)
conversation = data_list[0]  # Here we are selecting the first conversation, you can change this logic

# Prepare the data with the entire conversation
conversation_data = {"messages": conversation["messages"]}

# Send the POST request with the entire conversation as one message
response = requests.post(url, json=conversation_data)

# Check if the request was successful
if response.status_code == 200:
    print(f"Conversation uploaded successfully!")
    print("Response:", response.json())  # Print the response in JSON format
else:
    print(f"Failed to upload conversation. Status code: {response.status_code}")
    print("Response:", response.text)'''


# continues upload/post different conversations when using and re-using the api

# Check if there's a file that stores the last uploaded conversation index
index_file = "last_uploaded_index.txt"

# Initialize the index for the first time
if not os.path.exists(index_file):
    with open(index_file, 'w') as f:
        f.write("0")  # Start with the first conversation

# Read the last uploaded conversation index
with open(index_file, 'r') as f:
    last_uploaded_index = int(f.read().strip())

# Ensure the index is within bounds
if last_uploaded_index < len(data_list):
    # Get the next conversation to upload
    conversation = data_list[last_uploaded_index]

    # Prepare the data with the entire conversation
    conversation_data = {"messages": conversation["messages"]}

    # Send the POST request with the entire conversation as one message
    response = requests.get(url, json=conversation_data)

    # Check if the request was successful
    if response.status_code == 200:
        print(f"Conversation {last_uploaded_index + 1} uploaded successfully!")
        # Update the index for the next conversation
        next_index = last_uploaded_index + 1
        with open(index_file, 'w') as f:
            f.write(str(next_index))  # Save the updated index
        print("Response:", response.json())  # Print the response in JSON format
    else:
        print(f"Failed to upload conversation. Status code: {response.status_code}")
        print("Response:", response.text)
else:
    print("All conversations have been uploaded.")
