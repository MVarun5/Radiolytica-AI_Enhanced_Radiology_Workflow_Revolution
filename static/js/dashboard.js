// document.addEventListener("DOMContentLoaded", function () {
//     // Example patient data (this should be fetched dynamically from the backend)
//     let patientData = [
//         { date: "2025-03-08", name: "John Doe", age: 45, gender: "Male", pneumonia: "Moderate (60%)", tuberculosis: "Low (20%)", cardiomegaly: "High (85%)" },
//         { date: "2025-03-07", name: "Jane Smith", age: 50, gender: "Female", pneumonia: "Severe (90%)", tuberculosis: "Moderate (50%)", cardiomegaly: "Low (30%)" }
//     ];

//     // Populate table with patient data
//     let tableBody = document.querySelector("#data-table tbody");
//     patientData.forEach(patient => {
//         let row = `<tr>
//             <td>${patient.date}</td>
//             <td>${patient.name}</td>
//             <td>${patient.age}</td>
//             <td>${patient.gender}</td>
//             <td>${patient.pneumonia}</td>
//             <td>${patient.tuberculosis}</td>
//             <td>${patient.cardiomegaly}</td>
//         </tr>`;
//         tableBody.innerHTML += row;
//     });

//     // Function to download Excel (CSV format)
//     document.getElementById("download-excel").addEventListener("click", function () {
//         let csvContent = "data:text/csv;charset=utf-8," 
//             + "Date,Name,Age,Gender,Pneumonia Severity,Tuberculosis Severity,Cardiomegaly Severity\n"
//             + patientData.map(p => `${p.date},${p.name},${p.age},${p.gender},${p.pneumonia},${p.tuberculosis},${p.cardiomegaly}`).join("\n");

//         let encodedUri = encodeURI(csvContent);
//         let link = document.createElement("a");
//         link.setAttribute("href", encodedUri);
//         link.setAttribute("download", "patient_data.csv");
//         document.body.appendChild(link);
//         link.click();
//     });
// });




document.addEventListener("DOMContentLoaded", function () {
    let loginForm = document.getElementById("login-form");
    let errorMessage = document.getElementById("error-message");

    // Set predefined username and password
    if(loginForm){
        const correctUsername = "radio123";
    const correctPassword = "secure";

    // Handle form submission
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        let enteredUsername = document.getElementById("username").value;
        let enteredPassword = document.getElementById("password").value;

        if (enteredUsername === correctUsername && enteredPassword === correctPassword) {
            window.location.href = "dashboard.html"; // Redirect to dashboard
        } else {
            errorMessage.textContent = "Invalid username or password. Try again.";
            errorMessage.style.color = "red";
        }
    });
}
});



// document.addEventListener("DOMContentLoaded", function () {
//     console.log(" DOM fully loaded and parsed");  // Debug log
//     let analyzeBtn = document.getElementById("analyze-btn");
//     let xrayUpload = document.getElementById("xray-upload");
//     let uploadedImage = document.getElementById("uploaded-image");
//     let resultSection = document.getElementById("analysis-result");
//     let patientName = document.getElementById("patient-name");
//     let age = document.getElementById("age");
//     let gender = document.getElementById("gender");
//     let phone = document.getElementById("phone");
//     let patientData=[];

//     // Hide results section initially
//     resultSection.style.display = "none";

//     // Show the results section ONLY when a file is uploaded and patient details are filled
//     analyzeBtn.addEventListener("click", function () {
//         console.log(" Analyze button clicked");
//         let file = xrayUpload.files[0];

//         if (!file) {
//             alert("Please upload an X-ray image.");
//             console.log(" No file selected!");
//             return;
//         }

//         // Validate patient details
//         if (!patientName.value.trim()) {
//             alert("Please enter the patient's name.");
//             console.log("patient name not");
//             return;
//         }
//         console.log("Selected file:", file.name);

//         if (!age.value || age.value <= 0) {
//             alert("Please enter a valid age.");
//             console.log("no age");
//             return;
//         }

//         if (gender.value === "Select Gender") {
//             alert("Please select the patient's gender.");
//             console.log("no gender");
//             return;
//         }

//         if (!phone.value || !/^[0-9]{10}$/.test(phone.value)) {
//             alert("Please enter a valid 10-digit phone number.");
//             console.log("no phone");
//             return;
//         }
//         console.log(" All patient details are valid");
//         // Show uploaded image
//         let reader = new FileReader();
//         reader.onload = function (e) {
//             uploadedImage.src = e.target.result;
//             uploadedImage.style.display = "block";
//             console.log("Image uploaded successfully"); // Debug log
//         };
//         reader.readAsDataURL(file);

//         // Show result section after clicking Analyze
//         resultSection.style.display = "block";

//         // Create FormData and append the file
//         let formData = new FormData();
//         formData.append("file", file);
//         formData.append("name", patientName.value);
//         formData.append("age", age.value);
//         formData.append("gender", gender.value);
//         formData.append("phone", phone.value);
//         console.log("FormData created, sending fetch request"); // Debug log

//         // Send file to Flask backend
//         fetch("http://127.0.0.1:5000/upload", {  // Updated endpoint
//             method: "POST",
//             body: formData
//         })
//         .then(response => {
//             console.log("Fetch response status:", response.status); // Debug log
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);  // Throw the response to handle errors
//             }
//             return response.json();
//         })
//         .then(data => {
//             console.log("Fetch response data:", data); // Debug log
//             if (data.error) {
//                 alert(data.error);
//                 console.log("server error:", data.error);
//                 return;
//             }
//             let newPatient = {
//                 date: new Date().toISOString().split("T")[0],
//                 name: patientName.value,
//                 age: age.value,
//                 gender: gender.value,
//                 pneumonia: `${data.predictions.pneumonia.confidence}% (${data.predictions.pneumonia.label})`,
//                 tuberculosis: `${data.predictions.tb.confidence}% (${data.predictions.tb.label})`,
//                 cardiomegaly: `${data.predictions.cardiomegaly.confidence}% (${data.predictions.cardiomegaly.label})`
//             };

//             // Add new data to array and update table
//             patientData.push(newPatient);
//             updateTable(newPatient);

//             // Update UI with predictions from Flask
//             document.getElementById("pneumonia-result").innerHTML = 
//                 `Pneumonia: <strong>${data.predictions.pneumonia.confidence}%</strong> - Result: <strong>${data.predictions.pneumonia.label}</strong>`;

//             document.getElementById("tb-result").innerHTML = 
//                 `Tuberculosis: <strong>${data.predictions.tb.confidence}%</strong> - Result: <strong>${data.predictions.tb.label}</strong>`;

//             document.getElementById("cardiomegaly-result").innerHTML = 
//                 `Cardiomegaly: <strong>${data.predictions.cardiomegaly.confidence}%</strong> - Result: <strong>${data.predictions.cardiomegaly.label}</strong>`;
//             console.log("results loaded");
//             resultSection.style.display = "block";  // Show the results
//         })
//         .catch(error => {
//             // console.error("Fetch error:", error.message);
//             alert("Error fetching predictions: " + error.message);
//         });


//         // Scroll to the result section smoothly
//         resultSection.scrollIntoView({ behavior: "smooth", block: "start" });

//         // Populate table with patient data
//     // let tableBody = document.querySelector("#data-table tbody");
//     // patientData.forEach(patient => {
//     //     let row = `<tr>
//     //         <td>${patient.date}</td>
//     //         <td>${patient.name}</td>
//     //         <td>${patient.age}</td>
//     //         <td>${patient.gender}</td>
//     //         <td>${patient.pneumonia}</td>
//     //         <td>${patient.tuberculosis}</td>
//     //         <td>${patient.cardiomegaly}</td>
//     //     </tr>`;
//     //     tableBody.innerHTML += row;
//     // });
//     });

//     // Function to update the table dynamically
//     let tableBody = document.querySelector("#data-table tbody");
//     function updateTable(patient) {
//         let row = `<tr>
//             <td>${patient.date}</td>
//             <td>${patient.name}</td>
//             <td>${patient.age}</td>
//             <td>${patient.gender}</td>
//             <td>${patient.pneumonia}</td>
//             <td>${patient.tuberculosis}</td>
//             <td>${patient.cardiomegaly}</td>
//         </tr>`;
//         tableBody.innerHTML += row;
//     }

//     // Function to download Excel (CSV format)
//     document.getElementById("download-excel").addEventListener("click", function () {
//         if (patientData.length === 0) {
//             alert("No data available to download.");
//             return;
//         }

//         let csvContent = "data:text/csv;charset=utf-8," 
//             + "Date,Name,Age,Gender,Pneumonia Severity,Tuberculosis Severity,Cardiomegaly Severity\n"
//             + patientData.map(p => `${p.date},${p.name},${p.age},${p.gender},${p.pneumonia},${p.tuberculosis},${p.cardiomegaly}`).join("\n");

//         let encodedUri = encodeURI(csvContent);
//         let link = document.createElement("a");
//         link.setAttribute("href", encodedUri);
//         link.setAttribute("download", "patient_data.csv");
//         document.body.appendChild(link);
//         link.click();
//     });
// });


// document.addEventListener("DOMContentLoaded", function () {
//     let xrayUpload = document.getElementById("xray-upload");
//     let fileNameDisplay = document.getElementById("file-name");

//     xrayUpload.addEventListener("change", function () {
//         if (xrayUpload.files.length > 0) {
//             fileNameDisplay.textContent = `Selected file: ${xrayUpload.files[0].name}`;
//         } else {
//             fileNameDisplay.textContent = "";
//         }
//     });
// });


// document.addEventListener("DOMContentLoaded", function () {
//     console.log("DOM fully loaded and parsed");
//     let analyzeBtn = document.getElementById("analyze-btn");
//     let xrayUpload = document.getElementById("xray-upload");
//     let uploadedImage = document.getElementById("uploaded-image");
//     let resultSection = document.getElementById("analysis-result");
//     let patientName = document.getElementById("patient-name");
//     let age = document.getElementById("age");
//     let gender = document.getElementById("gender");
//     let phone = document.getElementById("phone");
//     let patientData = [];
    
//     // Base URL for the API - change this to match your Flask server URL
//     const API_BASE_URL = "http://127.0.0.1:5000";

//     // Hide results section initially
//     resultSection.style.display = "none";

//     // Show the results section ONLY when a file is uploaded and patient details are filled
//     analyzeBtn.addEventListener("click", function () {
//         console.log("Analyze button clicked");
//         let file = xrayUpload.files[0];

//         if (!file) {
//             alert("Please upload an X-ray image.");
//             console.log("No file selected!");
//             return;
//         }

//         // Validate patient details
//         if (!patientName.value.trim()) {
//             alert("Please enter the patient's name.");
//             console.log("patient name not provided");
//             return;
//         }
//         console.log("Selected file:", file.name);

//         if (!age.value || age.value <= 0) {
//             alert("Please enter a valid age.");
//             console.log("no age");
//             return;
//         }

//         if (gender.value === "Select Gender") {
//             alert("Please select the patient's gender.");
//             console.log("no gender");
//             return;
//         }

//         if (!phone.value || !/^[0-9]{10}$/.test(phone.value)) {
//             alert("Please enter a valid 10-digit phone number.");
//             console.log("no phone");
//             return;
//         }
//         console.log("All patient details are valid");
        
//         // Show uploaded image
//         let reader = new FileReader();
//         reader.onload = function (e) {
//             uploadedImage.src = e.target.result;
//             uploadedImage.style.display = "block";
//             console.log("Image uploaded successfully");
//         };
//         reader.readAsDataURL(file);

//         // Show result section after clicking Analyze
//         resultSection.style.display = "block";

//         // Create FormData and append the file
//         let formData = new FormData();
//         formData.append("file", file);
//         formData.append("name", patientName.value);
//         formData.append("age", age.value);
//         formData.append("gender", gender.value);
//         formData.append("phone", phone.value);
//         console.log("FormData created, sending fetch request");

//         // Clear previous visualization images
//         document.getElementById("pneumonia-viz").style.display = "none";
//         document.getElementById("tb-viz").style.display = "none";
//         document.getElementById("cardiomegaly-viz").style.display = "none";

//         // Send file to Flask backend
//         fetch(`${API_BASE_URL}/upload`, {
//             method: "POST",
//             body: formData
//         })
//         .then(response => {
//             console.log("Fetch response status:", response.status);
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }
//             return response.json();
//         })
//         .then(data => {
//             console.log("Fetch response data:", data);
//             if (data.error) {
//                 alert(data.error);
//                 console.log("server error:", data.error);
//                 return;
//             }
            
//             // Convert scores to confidence percentages and labels
//             const getConfidenceAndLabel = (score) => {
//                 if (score === null || score === undefined) {
//                     return { confidence: "N/A", label: "Unknown" };
//                 }
                
//                 const percentage = Math.round(score * 100);
//                 let label = "Normal";
                
//                 if (percentage > 75) {
//                     label = "Severe";
//                 } else if (percentage > 40) {
//                     label = "Moderate";
//                 } else if (percentage > 15) {
//                     label = "Mild";
//                 }
                
//                 return { confidence: percentage, label: label };
//             };
            
//             // Process received scores
//             const pneumoniaResult = getConfidenceAndLabel(data.scores.pneumonia);
//             const tbResult = getConfidenceAndLabel(data.scores.tb);
//             const cardiomegalyResult = getConfidenceAndLabel(data.scores.cardiomegaly);
            
//             // Add new patient data
//             let newPatient = {
//                 date: new Date().toISOString().split("T")[0],
//                 name: patientName.value,
//                 age: age.value,
//                 gender: gender.value,
//                 pneumonia: `${pneumoniaResult.confidence}% (${pneumoniaResult.label})`,
//                 tuberculosis: `${tbResult.confidence}% (${tbResult.label})`,
//                 cardiomegaly: `${cardiomegalyResult.confidence}% (${cardiomegalyResult.label})`
//             };

//             // Add new data to array and update table
//             patientData.push(newPatient);
//             updateTable(newPatient);

//             // Update UI with predictions
//             document.getElementById("pneumonia-result").innerHTML = 
//                 `<span style="color: black;">Pneumonia: <strong>${pneumoniaResult.confidence}%</strong> - Result: <strong>${pneumoniaResult.label}</strong></span>`;

//             document.getElementById("tb-result").innerHTML = 
//                 `<span style="color: black;">Tuberculosis: <strong>${tbResult.confidence}%</strong> - Result: <strong>${tbResult.label}</strong></span>`;

//             document.getElementById("cardiomegaly-result").innerHTML = 
//                 `<span style="color: black;">Cardiomegaly: <strong>${cardiomegalyResult.confidence}%</strong> - Result: <strong>${cardiomegalyResult.label}</strong></span>`;
            
//             console.log("results loaded");
            
//             // Display visualization images if available
//             if (data.images) {
//                 // Handle pneumonia visualization - prepend the API base URL to the relative path
//                 if (data.images.pneumonia) {
//                     const pneumoniaViz = document.getElementById("pneumonia-viz");
//                     // Fix the URL by prepending the API base URL
//                     pneumoniaViz.src = `${API_BASE_URL}${data.images.pneumonia}`;
//                     pneumoniaViz.style.display = "block";
//                     console.log("Loading pneumonia visualization from:", pneumoniaViz.src);
//                 }
                
//                 // Handle tuberculosis visualization
//                 if (data.images.tb) {
//                     const tbViz = document.getElementById("tb-viz");
//                     // Fix the URL by prepending the API base URL
//                     tbViz.src = `${API_BASE_URL}${data.images.tb}`;
//                     tbViz.style.display = "block";
//                     console.log("Loading TB visualization from:", tbViz.src);
//                 }
                
//                 // Handle cardiomegaly visualization
//                 if (data.images.cardiomegaly) {
//                     const cardiomegalyViz = document.getElementById("cardiomegaly-viz");
//                     // Fix the URL by prepending the API base URL
//                     cardiomegalyViz.src = `${API_BASE_URL}${data.images.cardiomegaly}`;
//                     cardiomegalyViz.style.display = "block";
//                     console.log("Loading cardiomegaly visualization from:", cardiomegalyViz.src);
//                 }
//             }
//         })
//         .catch(error => {
//             console.error("Fetch error:", error.message);
//             alert("Error fetching predictions: " + error.message);
//         });

//         // Scroll to the result section smoothly
//         resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
//     });

//     // Function to update the table dynamically
//     let tableBody = document.querySelector("#data-table tbody");
//     function updateTable(patient) {
//         let row = `<tr>
//             <td>${patient.date}</td>
//             <td>${patient.name}</td>
//             <td>${patient.age}</td>
//             <td>${patient.gender}</td>
//             <td>${patient.pneumonia}</td>
//             <td>${patient.tuberculosis}</td>
//             <td>${patient.cardiomegaly}</td>
//         </tr>`;
//         tableBody.innerHTML += row;
//     }

//     // Function to download Excel (CSV format)
//     document.getElementById("download-excel").addEventListener("click", function () {
//         if (patientData.length === 0) {
//             alert("No data available to download.");
//             return;
//         }

//         let csvContent = "data:text/csv;charset=utf-8," 
//             + "Date,Name,Age,Gender,Pneumonia Severity,Tuberculosis Severity,Cardiomegaly Severity\n"
//             + patientData.map(p => `${p.date},${p.name},${p.age},${p.gender},${p.pneumonia},${p.tuberculosis},${p.cardiomegaly}`).join("\n");

//         let encodedUri = encodeURI(csvContent);
//         let link = document.createElement("a");
//         link.setAttribute("href", encodedUri);
//         link.setAttribute("download", "patient_data.csv");
//         document.body.appendChild(link);
//         link.click();
//     });

//     // File upload display functionality
//     xrayUpload.addEventListener("change", function () {
//         let fileNameDisplay = document.getElementById("file-name");
//         if (xrayUpload.files.length > 0) {
//             fileNameDisplay.textContent = `Selected file: ${xrayUpload.files[0].name}`;
//         } else {
//             fileNameDisplay.textContent = "";
//         }
//     });
// });


document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");
    let analyzeBtn = document.getElementById("analyze-btn");
    let xrayUpload = document.getElementById("xray-upload");
    let uploadedImage = document.getElementById("uploaded-image");
    let resultSection = document.getElementById("analysis-result");
    let patientName = document.getElementById("patient-name");
    let age = document.getElementById("age");
    let gender = document.getElementById("gender");
    let phone = document.getElementById("phone");
    let patientData = [];
    
    // Base URL for the API
    const API_BASE_URL = "http://127.0.0.1:5000";

    // Hide results section initially
    resultSection.style.display = "none";

    // Show the results section ONLY when a file is uploaded and patient details are filled
    analyzeBtn.addEventListener("click", function () {
        console.log("Analyze button clicked");
        let file = xrayUpload.files[0];

        if (!file) {
            alert("Please upload an X-ray image.");
            console.log("No file selected!");
            return;
        }

        // Validate patient details
        if (!patientName.value.trim()) {
            alert("Please enter the patient's name.");
            console.log("patient name not provided");
            return;
        }
        console.log("Selected file:", file.name);

        if (!age.value || age.value <= 0) {
            alert("Please enter a valid age.");
            console.log("no age");
            return;
        }

        if (gender.value === "Select Gender") {
            alert("Please select the patient's gender.");
            console.log("no gender");
            return;
        }

        if (!phone.value || !/^[0-9]{10}$/.test(phone.value)) {
            alert("Please enter a valid 10-digit phone number.");
            console.log("no phone");
            return;
        }
        console.log("All patient details are valid");
        
        // Show uploaded image
        let reader = new FileReader();
        reader.onload = function (e) {
            uploadedImage.src = e.target.result;
            uploadedImage.style.display = "block";
            console.log("Image uploaded successfully");
        };
        reader.readAsDataURL(file);

        // Show result section after clicking Analyze
        resultSection.style.display = "block";

        // Create FormData and append the file
        let formData = new FormData();
        formData.append("file", file);
        formData.append("name", patientName.value);
        formData.append("age", age.value);
        formData.append("gender", gender.value);
        formData.append("phone", phone.value);
        console.log("FormData created, sending fetch request");

        // Clear previous visualization images
        document.getElementById("pneumonia-viz").style.display = "none";
        document.getElementById("tb-viz").style.display = "none";
        document.getElementById("cardiomegaly-viz").style.display = "none";

        // Display loading indicators
        document.getElementById("pneumonia-result").innerHTML = `<div class="loading">Processing pneumonia analysis...</div>`;
        document.getElementById("tb-result").innerHTML = `<div class="loading">Processing tuberculosis analysis...</div>`;
        document.getElementById("cardiomegaly-result").innerHTML = `<div class="loading">Processing cardiomegaly analysis...</div>`;

        // Send file to Flask backend
        fetch(`${API_BASE_URL}/upload`, {
            method: "POST",
            body: formData
        })
        .then(response => {
            console.log("Fetch response status:", response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Fetch response data:", data);
            if (data.error) {
                alert(data.error);
                console.log("server error:", data.error);
                return;
            }
            
            // Function to generate a score based on presence of visualization image
            // This is a fallback when the score is null but the image exists
            const generateScoreFromImage = (imagePath) => {
                if (!imagePath) return 0;
                
                // Generate a semi-random but consistent score between 0.15 and 0.85
                // based on the image path (will be same for same image path)
                const hash = imagePath.split('').reduce((a, b) => {
                    a = ((a << 5) - a) + b.charCodeAt(0);
                    return a & a;
                }, 0);
                
                return 0.15 + (Math.abs(hash) % 70) / 100;
            };
            
            // Process received scores with fallback to generated scores
            // Extract detailed scores from backend
const pneumoniaScore = data.scores.pneumonia?.prediction || 0;
const pneumoniaInfection = data.scores.pneumonia?.infection_percentage || 0;

const tbScore = data.scores.tb?.prediction || 0;
const tbInfection = data.scores.tb?.infection_percentage || 0;

const ctr = data.scores.cardiomegaly?.ctr_value || 0;
const thoracicWidth = data.scores.cardiomegaly?.thoracic_width || 0;
const cardiacWidth = data.scores.cardiomegaly?.cardiac_width || 0;

// Severity labels
const getLabelFromInfection = (infection) => {
    if (infection > 75) return "Severe";
    if (infection > 40) return "Moderate";
    if (infection > 15) return "Mild";
    return "Normal";
};

const getLabelFromCTR = (ctr) => {
    if (ctr >= 0.6) return "Severe";
    if (ctr >= 0.55) return "Moderate";
    if (ctr >= 0.5) return "Mild";
    return "Normal";
};

const pneumoniaLabel = getLabelFromInfection(pneumoniaInfection);
const tbLabel = getLabelFromInfection(tbInfection);
const cardiomegalyLabel = getLabelFromCTR(ctr);

            
            // Add new patient data
            let newPatient = {
                date: new Date().toISOString().split("T")[0],
                name: patientName.value,
                age: age.value,
                gender: gender.value,
                pneumonia: `${pneumoniaInfection.toFixed(2)}% (${pneumoniaLabel})`,
                tuberculosis: `${tbInfection.toFixed(2)}% (${tbLabel})`,
                cardiomegaly: `CTR ${ctr.toFixed(3)} (${cardiomegalyLabel})`
            };            

            // Add new data to array and update table
            patientData.push(newPatient);
            updateTable(newPatient);

            // Update UI with predictions
            document.getElementById("pneumonia-result").innerHTML = 
                `<span style="color: black;">Pneumonia: Analysis Results:<br>
    Prediction: <strong>${pneumoniaScore.toFixed(3)}</strong><br>
    Class Label: <strong>${pneumoniaLabel}</strong><br>
    Infection Percentage: <strong>${pneumoniaInfection.toFixed(2)}%</strong>;</span>`;

            document.getElementById("tb-result").innerHTML = 
                `<span style="color: black;">Tuberculosis: Analysis Results:<br>
    Prediction: <strong>${tbScore.toFixed(3)}</strong><br>
    Class Label: <strong>${tbLabel}</strong><br>
    Infection Percentage: <strong>${tbInfection.toFixed(2)}%</strong></span>`;

            document.getElementById("cardiomegaly-result").innerHTML = 
                `<span style="color: black;">Cardiomegaly: CTR Value: <strong>${ctr.toFixed(3)}</strong><br>
    Class Label: <strong>${cardiomegalyLabel}</strong><br>
    Thoracic Width: <strong>${thoracicWidth}</strong><br>
    Cardiac Width: <strong>${cardiacWidth}</strong></span>`;
            
            console.log("results loaded");
            
            // Display visualization images if available
            if (data.images) {
                // Handle pneumonia visualization
                if (data.images.pneumonia) {
                    const pneumoniaViz = document.getElementById("pneumonia-viz");
                    pneumoniaViz.src = `${API_BASE_URL}${data.images.pneumonia}`;
                    pneumoniaViz.style.display = "block";
                    console.log("Loading pneumonia visualization from:", pneumoniaViz.src);
                }
                
                // Handle tuberculosis visualization
                if (data.images.tb) {
                    const tbViz = document.getElementById("tb-viz");
                    tbViz.src = `${API_BASE_URL}${data.images.tb}`;
                    tbViz.style.display = "block";
                    console.log("Loading TB visualization from:", tbViz.src);
                }
                
                // Handle cardiomegaly visualization
                if (data.images.cardiomegaly) {
                    const cardiomegalyViz = document.getElementById("cardiomegaly-viz");
                    cardiomegalyViz.src = `${API_BASE_URL}${data.images.cardiomegaly}`;
                    cardiomegalyViz.style.display = "block";
                    console.log("Loading cardiomegaly visualization from:", cardiomegalyViz.src);
                }
            }
        })
        .catch(error => {
            console.error("Fetch error:", error.message);
            alert("Error fetching predictions: " + error.message);
            
            // Clear loading indicators in case of error
            document.getElementById("pneumonia-result").innerHTML = `<div class="error">Error processing pneumonia analysis</div>`;
            document.getElementById("tb-result").innerHTML = `<div class="error">Error processing tuberculosis analysis</div>`;
            document.getElementById("cardiomegaly-result").innerHTML = `<div class="error">Error processing cardiomegaly analysis</div>`;
        });

        // Scroll to the result section smoothly
        resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    // Function to update the table dynamically
    let tableBody = document.querySelector("#data-table tbody");
    function updateTable(patient) {
        let row = `<tr>
            <td>${patient.date}</td>
            <td>${patient.name}</td>
            <td>${patient.age}</td>
            <td>${patient.gender}</td>
            <td>${patient.pneumonia}</td>
            <td>${patient.tuberculosis}</td>
            <td>${patient.cardiomegaly}</td>
        </tr>`;
        tableBody.innerHTML += row;
    }

    // Function to download Excel (CSV format)
    document.getElementById("download-excel").addEventListener("click", function () {
        if (patientData.length === 0) {
            alert("No data available to download.");
            return;
        }

        let csvContent = "data:text/csv;charset=utf-8," 
            + "Date,Name,Age,Gender,Pneumonia Severity,Tuberculosis Severity,Cardiomegaly Severity\n"
            + patientData.map(p => `${p.date},${p.name},${p.age},${p.gender},${p.pneumonia},${p.tuberculosis},${p.cardiomegaly}`).join("\n");

        let encodedUri = encodeURI(csvContent);
        let link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "patient_data.csv");
        document.body.appendChild(link);
        link.click();
    });

    // File upload display functionality
    xrayUpload.addEventListener("change", function () {
        let fileNameDisplay = document.getElementById("file-name");
        if (xrayUpload.files.length > 0) {
            fileNameDisplay.textContent = `Selected file: ${xrayUpload.files[0].name}`;
        } else {
            fileNameDisplay.textContent = "";
        }
    });
});