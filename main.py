import base64
import binascii

import rsa
from flask import Flask, request, jsonify
from flask_cors import CORS
from rsa.key import PublicKey, PrivateKey
from pyzbar.pyzbar import decode
from PIL import Image
import io

app = Flask(__name__)
CORS(app)


@app.route('/keygen', methods=['GET'])
def keygen():
    (public_key, private_key) = rsa.newkeys(2048)

    # Save the keys in PEM format
    public_key_pem = public_key.save_pkcs1().decode('utf-8')
    private_key_pem = private_key.save_pkcs1().decode('utf-8')

    return jsonify(publicKey=public_key_pem, privateKey=private_key_pem), 200


@app.route('/encrypt', methods=['POST'])
def encrypt():
    public_key_pem = request.json.get('publicKey')
    message = request.json.get('message')

    if not public_key_pem or not message:
        return jsonify(error="publicKey and message fields are required"), 400

    try:
        # Load the public key
        public_key = PublicKey.load_pkcs1(public_key_pem.encode())
    except Exception as e:
        return jsonify(error="Invalid public key format. " + str(e)), 400

    ciphertext = rsa.encrypt(message.encode('utf-8'), public_key)
    ciphertext_hex = ciphertext.hex()

    return jsonify(ciphertext=ciphertext_hex), 200


@app.route('/decrypt', methods=['POST'])

def decrypt():
    private_key_pem = request.json.get('privateKey')
    ciphertext_hex = request.json.get('ciphertext')

    if not private_key_pem or not ciphertext_hex:
        return jsonify(error="privateKey and ciphertext fields are required"), 400

    try:
        # Load the private key
        private_key = PrivateKey.load_pkcs1(private_key_pem.encode())
    except Exception as e:
        return jsonify(error="Invalid private key format. " + str(e)), 400

    try:
        ciphertext = binascii.unhexlify(ciphertext_hex)
        message = rsa.decrypt(ciphertext, private_key).decode('utf-8')
    except Exception as e:
        return jsonify(error="Decryption error: " + str(e)), 400

    return jsonify(message=message), 200


@app.route('/decodeAztec', methods=['POST'])
def aztec_decode():
    image_data = request.get_json()['image']

    # Remove the prefix
    base64_image = image_data.split(",")[1]

    try:
        # Convert the image data from base64
        image_bytes = base64.b64decode(base64_image)

        # Open the image with PIL
        image = Image.open(io.BytesIO(image_bytes))

        # TEMPORARY: Save the image to the disk
        with open('temp_image.png', 'wb') as temp_file:
            temp_file.write(image_bytes)

        # Decode the Aztec code
        decoded_objects = decode(image)
        for obj in decoded_objects:
            if obj.type == 'AZTEC':
                return jsonify({'result': obj.data.decode()}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

    return jsonify({'error': "No Aztec code found in image"}), 400

if __name__ == '__main__':
    app.run(debug=True)