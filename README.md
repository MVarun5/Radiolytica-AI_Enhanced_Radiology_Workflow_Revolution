# Radiolytica: AI Enhanced Radiology Workflow Revolution

Radiolytica is an AI-driven radiology assistant that processes chest X-rays to detect **Pneumonia**, **Tuberculosis (TB)**, and **Cardiomegaly**. It leverages deep learning (DenseNet201) and advanced computer vision techniques (lung segmentation + Grad-CAM + CTR) to assist radiologists by delivering real-time predictions, severity levels, and medical visualizations. It also logs results directly into an Excel sheet for workflow automation.
 
# 🚀 Features:

 🔍 **Automatic Detection** of Pneumonia, TB, and Cardiomegaly from chest X-ray images

 📊 **Confidence Scores** with disease severity levels (Mild/Moderate/Severe)

 📸 **Grad-CAM Visualizations** for infected lung regions

 ❤️ **CTR (Cardiothoracic Ratio)** calculation for Cardiomegaly

 📁 **Excel Report Generation** — logs patient info & predictions in real-time

 🧠 **AI Models**: **DenseNet201** for Pneumonia & TB; anatomical logic for Cardiomegaly

 🌐 Web-based interface built using **Flask + HTML/CSS/JS**


# 🛠️ Tech Stack

**Backend**: Flask (Python) <br>
**Frontend**: HTML5, CSS3, JavaScript (Vanilla) <br>
**AI Models**: DenseNet201 (.h5) for Pneumonia & TB <br>
**Visualization**: Grad-CAM (within Jupyter Notebooks) <br>
**Cardiomegaly**: CTR (Cardiothoracic Ratio) via width measurements <br>
**Excel Logging**: openpyxl <br>
**Notebook Execution**: nbconvert + ExecutePreprocessor


# 🖼 Sample Output

- ✅ Disease prediction (Normal / Pneumonia / TB / Cardiomegaly)
- 🔥 Grad-CAM overlay within segmented lung region
- 🧮 Cardiothoracic Ratio with threshold comparison
- 📊 Severity scoring based on intensity of infection


**📌 Notes**

-> Lung segmentation masks are applied before Grad-CAM to focus only on relevant areas.

-> The project uses mixed precision training and warm-up cosine decay learning rate schedules for optimized GPU training.

-> Predictions are stored in the backend for further analysis or audit trails.

**🧪 Evaluation Metrics Accuracy, Precision, Recall, F1-Score**

-> ROC-AUC

-> Specificity (for TB/Pneumonia)

-> CTR Threshold (≥ 0.50 → Cardiomegaly
