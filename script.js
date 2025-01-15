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

  // Add event listener for the Add Part button after page load
window.onload = function () {
  const addPartButton = document.getElementById("add-part-button");

  // Remove any existing event listeners before adding a new one
  addPartButton.replaceWith(addPartButton.cloneNode(true));
  const newAddPartButton = document.getElementById("add-part-button");

  newAddPartButton.addEventListener("click", (e) => {
    e.preventDefault();  // Prevent any form submission
    addPart();  // Call the add part function
    updateHiddenFields();  // Update hidden fields after adding
  });
};

// Function to add a new part/quantity row
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

  partsList.appendChild(newRow);  // Append a single new row
}

// Function to update hidden fields
function updateHiddenFields() {
  const selectedModel = document.getElementById("model-dropdown").value;
  const formattedPartsList = getFormattedPartsList();

  document.getElementById("input_90").value = selectedModel || "";
  document.getElementById("input_91").value = formattedPartsList || "";
}

// Function to get quantity options (1 to 100)
function getQuantityOptions() {
  let options = "";
  for (let i = 1; i <= 100; i++) {
    options += `<option value="${i}">${i}</option>`;
  }
  return options;
}

// Function to remove part row
function removePart(button) {
  const row = button.parentElement;
  row.remove();  // Remove the row
  updateHiddenFields();  // Update the form fields

// Get formatted parts list
function getFormattedPartsList() {
  const partsList = document.querySelectorAll("#parts-list .select-row");
  let formattedParts = [];

  partsList.forEach((row) => {
    const part = row.querySelector(".parts-dropdown").value;
    const quantity = row.querySelector(".quantity-dropdown").value;

    if (part && quantity) {
      formattedParts.push(`${part}(${quantity})`);
    }
  });

  return formattedParts.join(", ");
}

// Function to update hidden fields in real-time
function updateHiddenFields() {
  const selectedModel = document.getElementById("model-dropdown").value;
  const formattedPartsList = getFormattedPartsList();

  // Populate the hidden fields
  document.getElementById("input_90").value = selectedModel || "";
  document.getElementById("input_91").value = formattedPartsList || "";
}
