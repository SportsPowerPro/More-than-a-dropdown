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

// Populate the model dropdown
window.onload = function () {
  const modelDropdown = document.getElementById("model-dropdown");
  modelDropdown.innerHTML = ""; // Clear existing options

  const placeholderOption = document.createElement("option");
  placeholderOption.value = "";
  placeholderOption.textContent = "Select your Model Number";
  placeholderOption.disabled = true;
  placeholderOption.selected = true;
  modelDropdown.appendChild(placeholderOption);

  Object.keys(modelPartsData).forEach((model) => {
    const option = document.createElement("option");
    option.value = model;
    option.textContent = model;
    modelDropdown.appendChild(option);
  });
};

// Function to generate quantity options from 1 to 100
function getQuantityOptions() {
  let options = "";
  for (let i = 1; i <= 100; i++) {
    options += `<option value="${i}">${i}</option>`;
  }
  return options;
}

// Function to get the formatted parts list
function getFormattedPartsList() {
  const partsList = document.querySelectorAll("#parts-list .select-row");
  let formattedParts = [];
  let hasEmptyFields = false;

  partsList.forEach((row) => {
    const part = row.querySelector(".parts-dropdown").value;
    const quantity = row.querySelector(".quantity-dropdown").value;

    if (!part || !quantity) {
      hasEmptyFields = true; // Track if any fields are empty
    } else {
      formattedParts.push(`${part}(${quantity})`);
    }
  });

  return { formattedParts: formattedParts.join(", "), hasEmptyFields };
}

// Function to send data to JotForm
function sendDataToJotForm() {
  const modelDropdown = document.getElementById("model-dropdown");
  const selectedModel = modelDropdown.value;

  if (!selectedModel) {
    alert("Please select a model number.");
    return;
  }

  const { formattedParts, hasEmptyFields } = getFormattedPartsList();

  if (hasEmptyFields) {
    alert("Please fill out all part and quantity fields or remove empty lines.");
    return;
  }

  if (!formattedParts) {
    alert("Please add at least one part and quantity.");
    return;
  }

  // Populate hidden fields with data
  const hiddenModelField = document.querySelector("[name='model_number']");
  const hiddenPartsField = document.querySelector("[name='parts_and_quantities']");

  if (hiddenModelField && hiddenPartsField) {
    hiddenModelField.value = selectedModel;
    hiddenPartsField.value = formattedParts;

    console.log(`Hidden Model Value: ${hiddenModelField.value}`);
    console.log(`Hidden Parts Value: ${hiddenPartsField.value}`);
  }

  // Send a completion message to JotForm
  window.parent.postMessage(
    {
      type: "widget-complete", // Notify JotForm that the widget process is done
      model_number: selectedModel,
      parts_and_quantities: formattedParts
    },
    "*"
  );

  console.log("Form data sent successfully!");
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
  row.remove(); // Remove the corresponding row
}

// Attach event listener to form submission
document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent default submission
  sendDataToJotForm(); // Send data on form submission
});
