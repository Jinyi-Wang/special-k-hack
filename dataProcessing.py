import pandas as pd
import json

# Step 1: Read the Parquet file
df = pd.read_parquet("hf://datasets/NebulaByte/E-Commerce_Customer_Support_Conversations/data/train-00000-of-00001-a5a7c6e4bb30b016.parquet")

# Step 2: Assuming 'conversation' is the column containing the full conversation
# Modify the column name if necessary
output = []

for index, row in df.iterrows():
    conversation = row['conversation']  # Change 'conversation' to the actual column name in your dataset
    
    # Split the conversation into individual lines
    lines = conversation.split("\n")
    
    messages = []
    for line in lines:
        # Determine the role and content based on line start
        if line.startswith("Agent:"):
            role = "system"
            content = line[len("Agent:"):].strip()  # Remove "Agent:" and strip any extra spaces
        elif line.startswith("Customer:"):
            role = "user"
            content = line[len("Customer:"):].strip()  # Remove "Customer:" and strip any extra spaces
        else:
            continue  # Skip lines that don't start with "Agent:" or "Customer:"
        
        # Create the message dictionary
        message = {
            "role": role,
            "content": content
        }
        
        # Append the message to the messages list
        messages.append(message)
    
    # Create the final JSON object for this conversation and add it to the output list
    output.append({
        "messages": messages
    })

# Step 3: Convert to JSON and print or save it
json_output = json.dumps(output, indent=4)

# Optionally: Save the output as a JSON file
with open("output_messages.json", "w") as f:
    f.write(json_output)

# Print the output if needed
# print(json_output)
