# importing packages 
from pytubefix import YouTube 
import os 
import shutil
from flask import Flask, jsonify, request
from pocketbase import PocketBase  # Client also works the same
import base64
from dotenv import load_dotenv 
from waitress import serve
from flask_cors import CORS

load_dotenv()

app = Flask(__name__) 
client = PocketBase('https://otic.pockethost.io/')
CORS(app)  # This will enable CORS for all routes and methods

admin_data = client.admins.auth_with_password(os.getenv('ADMIN_MAIL'), os.getenv('ADMIN_PASSWORD'))

# Home Route
@app.route('/', methods=['GET'])
def home():
    return "Welcome To Otic"

# Download video from YouTube
@app.route('/download', methods=['POST'])
def save():
    url = request.args.get('url')
    response = jsonify({'url': url})
    response.headers.add('Access-Control-Allow-Origin', '*')
    if not url:
        return jsonify({'error': 'URL is required'}), 400
    
    try:
        
        # Download the video and save it to local
        yt = YouTube(url)
        video = yt.streams.filter(only_audio=True).first()
 
        channel_name = yt.channel_id
        destination = './' + channel_name 
    
        out_file = video.download(output_path=destination) 
        base, ext = os.path.splitext(out_file)
        new_file = base + '.mp3'

        if os.path.exists(new_file):
            os.remove(new_file)
        
        # Rename file to mp3
        os.rename(out_file, new_file)
        
        # Convert the mp3 to base64
        base64_output = ''
        
        with open(new_file, 'rb') as binary_file:
            binary_file_data = binary_file.read()
            base64_encoded_data = base64.b64encode(binary_file_data)
            base64_output = base64_encoded_data.decode('utf-8')
        
        # Save the data to the database
        result = client.collection("otic").create({
            "thumbnail_url": yt.thumbnail_url,
            "audio": base64_output,
            "title": yt.title,
            "duration": yt.length,
        })
        
        # Remove the file
        shutil.rmtree(destination)

    except Exception as e:
        if 'regex' in str(e):
            return jsonify({'error': 'Invalid URL'}), 400   
        return jsonify({'error': str(e)}), 400 
    return jsonify({'message': result.id}), 200

# Download video from database
@app.route('/download', methods=['GET'])
def get_audio():
    id = request.args.get('id')
    if not id:
        return jsonify({'error': 'ID is required'}), 400
    
    try:
        result = client.collection("otic").get_one(id)
        
        data = {
            'id': result.id,
            'thumbnail_url': result.thumbnail_url,
            'audio': result.audio,
            'title': result.title,
            'duration': result.duration
        }
        
        return jsonify(data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
if __name__ == '__main__': 
    serve(app, host='0.0.0.0', port=5000, )
