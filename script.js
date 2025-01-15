// Models and corresponding parts
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

// Populate the model dropdown on page load
window.onload = function () {
  const modelDropdown = document.getElementById("model-dropdown");
  modelDropdown.innerHTML = "";  // Clear existing options

  // Add placeholder text
  const placeholderOption = document.createElement("option");
  placeholderOption.value = "";
  placeholderOption.textContent = "Select your Model Number";
  placeholderOption.disabled = true;
  placeholderOption.selected = true;
  modelDropdown.appendChild(placeholderOption);

  // Add models to the dropdown
  Object.keys(modelPartsData).forEach((model) => {
    const option = document.createElement("option");
    option.value = model;
    option.textContent = model;
    modelDropdown.appendChild(option);
  });
};

// Generate quantity options from 1 to 100
function getQuantityOptions() {
  let options = "";
  for (let i = 1; i <= 100; i++) {
    options += `<option value="${i}">${i}</option>`;
  }
  return options;
}

// Validate and format parts list
function getFormattedPartsList() {
  const partsList = document.querySelectorAll("#parts-list .select-row");
  let formattedParts = [];
  let hasEmptyFields = false;

  partsList.forEach((row) => {
    const part = row.querySelector(".parts-dropdown").value;
    const quantity = row.querySelector(".quantity-dropdown").value;

    if (!part || !quantity) {
      hasEmptyFields = true;  // Track if any fields are empty
    } else {
      formattedParts.push(`${part}(${quantity})`);
    }
  });

  return { formattedParts: formattedParts.join(", "), hasEmptyFields };
}

// Validate and send data to JotForm
function validateAndSendDataToJotForm() {
  const modelDropdown = document.getElementById("model-dropdown");
  const selectedModel = modelDropdown.value;

  if (!selectedModel) {
    alert("Please select a model number.");
    return false;
  }

  const { formattedParts, hasEmptyFields } = getFormattedPartsList();

  if (hasEmptyFields) {
    alert("Please fill out all part and quantity fields or remove empty lines.");
    return false;
  }

  if (!formattedParts) {
    alert("Please add at least one part and quantity.");
    return false;
  }

  // Populate hidden fields with data
  const modelField = document.querySelector("#input_90") || document.querySelector("#hidden-model");
  const partsField = document.querySelector("#input_91") || document.querySelector("#hidden-parts");
  if (modelField && partsField) {
    modelField.value = selectedModel;
    partsField.value = formattedParts;
  } else {
    console.error("Hidden fields not found in JotForm.");
  }

  // Send data to parent JotForm
  window.parent.postMessage(
    {
      model_number: selectedModel,
      parts_and_quantities: formattedParts,
    },
    "*"
  );

  console.log("Form data sent successfully!");
  return true;
}

// Add a new part/quantity row
function addPart() {
  const selectedModel = document.getElementById("model-dropdown").value;
  const selectedParts = modelPartsData[selectedModel] || [];

  const partsList = document.getElementById("parts-list");
  const newRow = document.createElement("div");
  newRow.className = "select-row";

  newRow.innerHTML = `
    <select class="parts-dropdown">
      <option value="" disabled selected>Select a Part</option>
      ${selectedParts.map((part) => `<option value="${part}">${part}</option>`).join("")}
    </select>
    <select class="quantity-dropdown">
      ${getQuantityOptions()}
    </select>
    <button class="remove-button" onclick="removePart(this)">❌</button>
  `;

  partsList.appendChild(newRow);
}

// Remove a part/quantity row
function removePart(button) {
  const row = button.parentElement;
  row.remove();  // Remove the corresponding row
}

// Ensure script only runs after DOM has loaded
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();  // Prevent default submission
      if (validateAndSendDataToJotForm()) {
        e.target.submit();  // Submit the form if validation passes
      }
    });
  } else {
    console.error("Form element not found!");
  }
});
