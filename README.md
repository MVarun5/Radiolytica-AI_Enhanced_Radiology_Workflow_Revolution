# Radiolytica: AI Enhanced Radiology Workflow Revolution

Radiolytica is an AI-driven radiology assistant that processes chest X-rays to detect **Pneumonia**, **Tuberculosis (TB)**, and **Cardiomegaly**. It leverages deep learning (DenseNet201) and advanced computer vision techniques (lung segmentation + Grad-CAM + CTR) to assist radiologists by delivering real-time predictions, severity levels, and medical visualizations. It also logs results directly into an Excel sheet for workflow automation.

---
 
<h2> 🚀 Features: </h2>

 🔍 **Automatic Detection** of Pneumonia, TB, and Cardiomegaly from chest X-ray images

 📊 **Confidence Scores** with disease severity levels (Mild/Moderate/Severe)

 📸 **Grad-CAM Visualizations** for infected lung regions

 ❤️ **CTR (Cardiothoracic Ratio)** calculation for Cardiomegaly

 📁 **Excel Report Generation** — logs patient info & predictions in real-time

 🧠 **AI Models**: **DenseNet201** for Pneumonia & TB; anatomical logic for Cardiomegaly

 🌐 Web-based interface built using **Flask + HTML/CSS/JS**

---

<h2> 🛠️ Tech Stack </h2>

<div align="center">

| Task | Technology / Model |
|:-------------:|:--------------:|
| **Backend**    | Flask (Python) |
| **Frontend** | HTML5, CSS3, JavaScript (Vanilla) |
| **AI Models** | DenseNet201 (.h5) for Pneumonia & TB |
| **Visualization** | Grad-CAM (within Jupyter Notebooks) |
| **Cardiomegaly** | CTR (Cardiothoracic Ratio) via width measurements |
| **Excel Logging** | openpyxl |
| **Notebook Execution** | nbconvert + ExecutePreprocessor |

</div>

---

<h2> 🖼 Sample Output </h2>

<div align="center">
<table>
<tr>
<td width="50%">

✅ **Disease prediction** - The model accurately classifies X-ray images into four categories: Normal, Pneumonia, Tuberculosis (TB), and Cardiomegaly, providing reliable diagnostic assistance.

🔥 **Grad-CAM overlay** - Visual explanation of model predictions with Grad-CAM heatmaps overlaid within the segmented lung region, highlighting the areas the AI focused on for its decision.

🧮 **Cardiothoracic Ratio** - Automated measurement of heart width relative to chest width with threshold comparison to detect cardiomegaly, providing quantitative analysis alongside qualitative predictions.

📊 **Severity scoring** - Intelligent severity assessment based on the intensity and distribution of infection patterns, helping clinicians prioritize cases and understand disease progression.

</td>
<td width="50%">
<img src="https://github.com/user-attachments/assets/efcb875e-df41-4732-88e8-bde61493e470" height="500" width="500" alt="Sample Output">
</td>
</tr>
</table>
</div>

---

<h2> ⚙️ How It Works </h2>

1. User uploads a chest X-ray via the web interface.

2. Flask receives and saves the image.

3. The image is passed to 3 Jupyter notebooks:

   - Pneumonia → DenseNet + Segmentation + Grad-CAM

   - TB → DenseNet + Segmentation + Grad-CAM

   - Cardiomegaly → CTR calculation

4. Predictions + severity labels + images are returned to JavaScript.

5. Dashboard displays results and visualizations.

6. All results (including patient info) are saved to an Excel sheet.

---

<h2> 📌 Notes </h2>

-> Lung segmentation masks are applied before Grad-CAM to focus only on relevant areas. You can download the trained model from [here](https://www.kaggle.com/models/lokesh0929/unet_segmentation).

-> The project uses mixed precision training and warm-up cosine decay learning rate schedules for optimized GPU training.

-> Predictions are stored in the backend for further analysis or audit trails.

**🧪 Evaluation Metrics Accuracy, Precision, Recall, F1-Score**

-> ROC-AUC

-> Specificity (for TB/Pneumonia)

-> CTR Threshold (≥ 0.50 → Cardiomegaly)
