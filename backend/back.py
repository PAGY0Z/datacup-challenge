from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI, APIConnectionError, RateLimitError, APIError, PermissionDeniedError
from dotenv import load_dotenv
import os
import time

load_dotenv()

app = Flask(__name__)
CORS(app)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

ASSISTANT_ID = os.getenv("ASSISTANT_ID")

if not ASSISTANT_ID:
    raise ValueError("ASSISTANT_ID not set in the environment variables.")

user_threads = {}
user_last_message = {}
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

        if user_id not in user_threads:
            thread = client.beta.threads.create()
            user_threads[user_id] = thread.id
            user_last_message[user_id] = None

        thread_id = user_threads[user_id]

        user_message_obj = client.beta.threads.messages.create(
            thread_id=thread_id,
            role="user",
            content=user_message
        )
        user_last_message[user_id] = user_message_obj.id

        run = client.beta.threads.runs.create(
            thread_id=thread_id,
            assistant_id=ASSISTANT_ID
        )

        while True:
            run_status = client.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run.id)
            if run_status.status == "completed":
                break
            elif run_status.status == "failed":
                print("Run failed:", run_status.last_error)
                return jsonify({'error': 'Run failed. Try again later.'}), 500
            time.sleep(2)

        messages = client.beta.threads.messages.list(thread_id=thread_id)

        bot_response = None
        for message in messages.data:
            if message.role == "assistant":
                for content in message.content:
                    if content.type == 'text':
                        bot_response = content.text.value
                        break
            if bot_response:
                break

        if not bot_response:
            return jsonify({'error': 'No response received from the assistant.'}), 500

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
