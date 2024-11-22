from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI, APIConnectionError, RateLimitError, APIError, PermissionDeniedError
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

try:
    with open('prompt.txt', 'r') as file:
        prompt_text = file.read()
except FileNotFoundError:
    print("Error: 'prompt.txt' file not found.")
    prompt_text = "You are a helpful assistant."

user_sessions = {}
next_user_id = 0

@app.route('/api/chat', methods=['POST'])
def chat():
    global next_user_id

    try:
        data = request.json
        user_id = data.get('user_id', '')
        user_message = data.get('response', '')
        
        if user_id == -1: 
            user_id = next_user_id
            next_user_id += 1
        if not user_message:
            return jsonify({'error': 'Message is empty'}), 400

        if user_id not in user_sessions:
            user_sessions[user_id] = [{"role": "system", "content": prompt_text}]

        user_sessions[user_id].append({"role": "user", "content": user_message})

        print(f"Conversation for user {user_id}: {user_sessions[user_id]}")

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=user_sessions[user_id], 
            temperature=0.7
        )

        bot_response = response.choices[0].message.content

        user_sessions[user_id].append({"role": "assistant", "content": bot_response})
        
        return jsonify({'user_id': user_id, 'response': bot_response})

    except PermissionDeniedError as e:
        print(f"Permission Denied Error: {e}")
        return jsonify({'error': 'Permission denied. Check model access permissions.'}), 403
    except APIConnectionError as e:
        print(f"Connection Error: {e}")
        return jsonify({'error': 'Failed to connect to OpenAI API.'}), 500
    except RateLimitError as e:
        print(f"Rate Limit Error: {e}")
        return jsonify({'error': 'Rate limit exceeded. Please try again later.'}), 429
    except APIError as e:
        print(f"API Error: {e}")
        return jsonify({'error': 'An error occurred with the OpenAI API.'}), 500
    except Exception as e:
        print(f"Server Error: {e}")
        return jsonify({'error': 'An internal server error occurred.'}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=3001)
