import os
import cv2
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify, send_file
from werkzeug.utils import secure_filename
from flask_cors import CORS
import concurrent.futures
import nbformat
from nbconvert.preprocessors import ExecutePreprocessor
import json
import base64
from io import BytesIO
import tempfile
import time
import re

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # Suppress TensorFlow warnings

# Set upload folder
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Output folder for notebook results
OUTPUT_FOLDER = "outputs"
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Load trained models
models = {
    "pneumonia": tf.keras.models.load_model(r"D:\varun\Major project\Major Project\DenseNet201_Pneumonia_1_copy_1.h5"),
    "tb": tf.keras.models.load_model(r"D:\varun\Major project\Major Project\DenseNet201_TB_2.h5")
}

def preprocess_image(image_path, target_size):
    """Load and preprocess image for model prediction."""
    image = cv2.imread(image_path)
    image = cv2.resize(image, target_size)  # Resize to model input size
    image = np.array(image) / 255.0  # Normalize pixel values
    image = np.expand_dims(image, axis=0)  # Add batch dimension
    return image

def execute_notebook(notebook_path, parameters=None):
    """Execute a Jupyter notebook with optional parameters."""
    with open(notebook_path) as f:
        nb = nbformat.read(f, as_version=4)
    
    # If parameters are provided, inject them into the notebook
    if parameters:
        # Add a cell at the beginning to set parameters
        param_cell = nbformat.v4.new_code_cell(
            source="\n".join([f"{key} = {repr(value)}" for key, value in parameters.items()])
        )
        nb.cells.insert(0, param_cell)
    
    # Execute the notebook
    ep = ExecutePreprocessor(timeout=1800, kernel_name='python3')
    try:
        ep.preprocess(nb, {'metadata': {'path': os.path.dirname(notebook_path)}})
        
        # Extract results
        results = {}
        visualizations = {}
        
        for cell in nb.cells:
            if cell.cell_type == 'code' and hasattr(cell, 'outputs'):
                for output in cell.outputs:
                    # Extract score variables
                    # if output.output_type == 'execute_result' and 'text/plain' in output.data:
                    #     if 'score' in output.data['text/plain'].lower():
                    #         results['score'] = float(output.data['text/plain'].split('=')[-1].strip())
                    text_output = ""
                    if output.output_type == 'execute_result' and 'text/plain' in output.data:
                        text_output = output.data['text/plain']
                    elif output.output_type == 'stream' and output.name == 'stdout':
                        text_output = output.text

                    if text_output:
                        matches = re.findall(r'(\w[\w\s]*):\s*([\d.]+)', text_output.replace('%', ''))
                        for key, value in matches:
                            key = key.strip().lower().replace(" ", "_")
                            results[key] = float(value)

                    
                    # Extract visualization images
                    if output.output_type == 'display_data' and 'image/png' in output.data:
                        img_data = output.data['image/png']
                        visualizations['image'] = img_data
        
        return {
            'results': results,
            'visualizations': visualizations,
            'success': True
        }
    
    except Exception as e:
        return {
            'error': str(e),
            'success': False
        }

# Home route
@app.route("/")
def home():
    return "Flask Server is Running! Use /upload to send images."

@app.route("/upload", methods=["POST"])
def upload_file():
    # Clear previous outputs
    for file in os.listdir(OUTPUT_FOLDER):
        file_path = os.path.join(OUTPUT_FOLDER, file)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
        except Exception as e:
            print(f"Error deleting {file_path}: {e}")
    
    # Add cache buster to prevent browser caching
    timestamp = int(time.time())
    
    file = request.files.get("file")
    print(f" Received file upload request: {file.filename if file else 'None'}")

    if not file:
        return jsonify({"error": "Invalid input. Please upload an X-ray image."}), 400

    # Save uploaded file with timestamp to prevent caching
    filename = f"{timestamp}_{secure_filename(file.filename)}"
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(filepath)
    print(f" File saved: {filepath}")
    
    # Define parameters to pass to notebooks
    parameters = {
        'image_path': filepath,
        'output_dir': OUTPUT_FOLDER
    }
    
    # Create list of notebooks to run
    notebooks = [
        {'name': 'pneumonia', 'path': 'DenseNet201_Pneumonia_1_grad.ipynb'},
        {'name': 'tb', 'path': 'DenseNet201_TB_1_grad.ipynb'},
        {'name': 'cardiomegaly', 'path': 'CTR_1.ipynb'}
    ]
    
    # # Run notebooks concurrently
    # results = {}
    # with concurrent.futures.ThreadPoolExecutor() as executor:
    #     # Create a dictionary mapping futures to notebook names
    #     future_to_notebook = {
    #         executor.submit(execute_notebook, notebook['path'], parameters): notebook['name']
    #         for notebook in notebooks
    #     }
        
    #     # Process as they complete
    #     for future in concurrent.futures.as_completed(future_to_notebook):
    #         notebook_name = future_to_notebook[future]
    #         try:
    #             notebook_result = future.result()
    #             results[notebook_name] = notebook_result
    #         except Exception as exc:
    #             print(f'{notebook_name} generated an exception: {exc}')
    #             results[notebook_name] = {'error': str(exc), 'success': False}
    
    # Run notebooks one by one
    results = {}
    for notebook in notebooks:
        try:
            notebook_result = execute_notebook(notebook['path'], parameters)
            results[notebook['name']] = notebook_result
        except Exception as exc:
            print(f'{notebook["name"]} generated an exception: {exc}')
            results[notebook['name']] = {'error': str(exc), 'success': False}
    
    # Process results for dashboard
    dashboard_data = {
        'scores': {},
        'images': {}
    }
    
    for notebook_name, result in results.items():
        if result['success']:
            # Extract scores
            # if 'results' in result and 'score' in result['results']:
            #     dashboard_data['scores'][notebook_name] = result['results']['score']
            # else:
            #     dashboard_data['scores'][notebook_name] = None
            dashboard_data['scores'][notebook_name] = result.get('results', {})
            
            # Extract images
            if 'visualizations' in result and 'image' in result['visualizations']:
                # Convert base64 image data to URL format for frontend
                img_data = result['visualizations']['image']
                dashboard_data['images'][notebook_name] = f"data:image/png;base64,{img_data}"
            else:
                dashboard_data['images'][notebook_name] = None
        else:
            dashboard_data['scores'][notebook_name] = None
            dashboard_data['images'][notebook_name] = None
            print(f"Error processing {notebook_name}: {result.get('error', 'Unknown error')}")
    
    # Save visualization outputs to files that can be served
    for notebook_name, result in results.items():
        if result['success'] and 'visualizations' in result and 'image' in result['visualizations']:
            img_data = result['visualizations']['image']
            img_bytes = base64.b64decode(img_data)
            
            # Save the image file
            img_filename = f"{notebook_name}_visualization.png"
            img_path = os.path.join(OUTPUT_FOLDER, img_filename)
            
            with open(img_path, 'wb') as f:
                f.write(img_bytes)
            
            # Update the dashboard data with file paths instead of base64
            dashboard_data['images'][notebook_name] = f"/get_image/{notebook_name}"

    # Update image URLs with timestamp
    for notebook_name in dashboard_data['images']:
        if dashboard_data['images'][notebook_name]:
            dashboard_data['images'][notebook_name] = f"/get_image/{notebook_name}?t={timestamp}"
    
    return jsonify(dashboard_data)

@app.route("/get_image/<notebook_name>", methods=["GET"])
def get_image(notebook_name):
    """Serve visualization images."""
    img_path = os.path.join(OUTPUT_FOLDER, f"{notebook_name}_visualization.png")
    if os.path.exists(img_path):
        response = send_file(img_path, mimetype='image/png')
        # Add cache control headers manually
        response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
        return response
    else:
        return jsonify({"error": f"Image for {notebook_name} not found"}), 404
    
# Original prediction endpoint (keeping for backward compatibility)
@app.route("/predict", methods=["POST"])
def predict():
    """Predict using the loaded models directly."""
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    # Save the uploaded file
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(filepath)
    
    # Process with each model
    results = {}
    for name, model in models.items():
        # Determine appropriate target size for each model
        if name == "pneumonia":
            target_size = (224, 224)
        elif name == "tb":
            target_size = (224, 224)
        else:  # cardiomegaly
            target_size = (224, 224)
        
        # Preprocess and predict
        image = preprocess_image(filepath, target_size)
        prediction = model.predict(image)
        
        # Format result based on model output shape
        if prediction.shape[-1] == 1:  # Binary classification
            prob = float(prediction[0][0])
            results[name] = {"probability": prob, "prediction": "Positive" if prob > 0.5 else "Negative"}
        else:  # Multi-class
            class_index = np.argmax(prediction[0])
            prob = float(prediction[0][class_index])
            results[name] = {"probability": prob, "class_index": int(class_index)}
    
    return jsonify(results)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)