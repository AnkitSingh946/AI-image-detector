AI Image Authenticity Detector
An AI-based web application that detects whether an uploaded image is REAL or FAKE using a trained deep learning model and a Flask web interface.
Features
Upload images from browser
Detect REAL / FAKE images
Display confidence score
Responsive UI
Flask backend with PyTorch inference
Tech Stack
HTML, CSS, JavaScript
Flask
Python
PyTorch
TorchVision
ResNet18
Installation
```bash
pip install flask torch torchvision pillow
```
Run
```bash
python app.py
```
Open:
```
http://localhost:5000
```
Project Structure
```
Mini Project/
├── app.py
├── generate\\\_images.py
├── model/
│   ├── model.py
│   └── ai\\\_detector.pth
├── templates/
├── static/
└── uploads/
```
How It Works
Upload image
Backend processes image
Model predicts result
UI shows output
Future Improvements
Better dataset
Higher image resolution
Deployment
Explainable AI
