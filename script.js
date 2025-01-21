// API Key
const API_KEY = "your-api-key-here"; // Replace with your actual API key

// Predefined models and their corresponding parts
const modelPartsData = {
  "MSC-3782-BM": [
    "A1", "A2", "A3", "A5", "A6", "A7", "B4", "C2",
    "J1", "J2", "J3", "J4", "J8", "J9", "K1",
    "L1", "L2", "N11", "N12", "R1", "R2A", "R2B", "R3",
    "R4", "R7", "R8", "S1", "X1-N", "X2-N", "X3-N", "X4-N",
    "X5-N", "X6", "Y2", "Hardware A", "Hardware B"
  ],
  "MSC-4510": [
    "A1A", "A2A", "A3A", "C2", "A4A", "A5A", "A6", "A7",
    "P1", "P2", "P3", "P4", "P5", "J1A", "J1B", "J2",
    "K1", "L1-N", "L2-N", "M1", "M2", "M3", "M4", "M5",
    "L3", "L4", "Y2", "X1-N", "X2-N", "X3-N", "X4-N",
    "X5-N", "X6", "MSC-4510-Hardware A", "MSC-4510-Hardware B"
  ]
};

// Populate model dropdown on page load
function populateModelDropdown() {
  const modelDropdown = document.getElementById("model-dropdown");

  // Clear existing options
  modelDropdown.innerHTML = '<option value="" disabled selected>Select your Model Number</option>';

  // Add models to dropdown
  Object.keys(modelPartsData).forEach((model) => {
    const option = document.createElement("option");
    option.value = model;
    option.textContent = model;
    modelDropdown.appendChild(option);
  });
}

// Add Part Functionality
function addPart() {
  const model = document.getElementById("model-dropdown").value;

  if (!model) {
    alert("Please select a model first.");
    return;
  }

  const selectedParts = modelPartsData[model] || [];
  const partDropdown = document.createElement("select");
  const quantityInput = document.createElement("input");
  const removeButton = document.createElement("button");

  partDropdown.className = "part-dropdown";
  quantityInput.className = "quantity-input";
  removeButton.className = "remove-button";

  // Populate part dropdown
  selectedParts.forEach((part) => {
    const option = document.createElement("option");
    option.value = part;
    option.textContent = part;
    partDropdown.appendChild(option);
  });

  // Add quantity input
  quantityInput.type = "number";
  quantityInput.min = 1;
  quantityInput.placeholder = "Quantity";

  // Remove button functionality
  removeButton.textContent = "X";
  removeButton.addEventListener("click", function () {
    const parent = removeButton.parentElement;
    parent.remove();
    updateResults(); // Update results when a part is removed
  });

  // Append to parts list
  const partsList = document.getElementById("parts-list");
  const partRow = document.createElement("div");
  partRow.className = "part-row";
  partRow.appendChild(partDropdown);
  partRow.appendChild(quantityInput);
  partRow.appendChild(removeButton);
  partsList.appendChild(partRow);

  // Update results automatically when part or quantity changes
  partDropdown.addEventListener("change", updateResults);
  quantityInput.addEventListener("input", updateResults);
}

// Update results and validate duplicate entries
function updateResults() {
  const model = document.getElementById("model-dropdown").value;
  const partRows = document.querySelectorAll(".part-row");
  const results = [];
  const partTracker = new Set(); // To track duplicate parts

  partRows.forEach((row) => {
    const part = row.querySelector(".part-dropdown").value;
    const quantity = row.querySelector(".quantity-input").value;

    // Skip empty rows
    if (!part || !quantity) return;

    // Check for duplicates
    if (partTracker.has(part)) {
      alert(`Duplicate part detected: ${part}`);
      return;
    }

    partTracker.add(part);
    results.push(`${part}(${quantity})`);
  });

  // Update text boxes
  document.getElementById("input_90").value = model || "None";
  document.getElementById("input_91").value = results.join(", ") || "None";
}

// Attach Add Part functionality to button
document.getElementById("add-part-button").addEventListener("click", addPart);

// Initialize the widget
document.addEventListener("DOMContentLoaded", () => {
  populateModelDropdown(); // Populate model dropdown
});

// Submit functionality for the widget
JFCustomWidget.subscribe("submit", function () {
  const model = document.getElementById("input_90").value;
  const partsSummary = document.getElementById("input_91").value;

  const widgetData = {
    type: "submit",
    value: {
      model: model,
      parts: partsSummary,
    },
    apiKey: API_KEY, // Include API Key
  };

  // Send data to JotForm
  JFCustomWidget.sendData(widgetData);

  alert("Form submitted successfully!");
});
