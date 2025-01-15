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
  modelDropdown.innerHTML = `<option value="" disabled selected>Select your Model Number</option>`;
  Object.keys(modelPartsData).forEach((model) => {
    const option = document.createElement("option");
    option.value = model;
    option.textContent = model;
    modelDropdown.appendChild(option);
  });
};

// Generate quantity options (1 to 100)
function getQuantityOptions() {
  let options = "";
  for (let i = 1; i <= 100; i++) {
    options += `<option value="${i}">${i}</option>`;
  }
  return options;
}

// Add new part row
function addPart() {
  const selectedModel = document.getElementById("model-dropdown").value;
  if (!selectedModel) {
    alert("Please select a model first.");
    return;
  }

  const partsList = document.getElementById("parts-list");
  const partRow = document.createElement("div");
  partRow.className = "select-row";

  const partsDropdown = modelPartsData[selectedModel].map((part) => `<option value="${part}">${part}</option>`).join("");
  partRow.innerHTML = `
    <select class="parts-dropdown" onchange="updatePartDropdowns()">
      <option value="" disabled selected>Select a Part</option>
      ${partsDropdown}
    </select>
    <select class="quantity-dropdown">${getQuantityOptions()}</select>
    <button class="remove-button" onclick="removePart(this)">❌</button>
  `;
  partsList.appendChild(partRow);
  updatePartDropdowns(); // Update dropdowns after adding
}

// Remove part row
function removePart(button) {
  button.parentElement.remove();
  updatePartDropdowns(); // Update dropdowns after removing
}

// Update dropdowns to disable selected parts
function updatePartDropdowns() {
  const selectedParts = Array.from(document.querySelectorAll(".parts-dropdown")).map((dropdown) => dropdown.value);
  const partDropdowns = document.querySelectorAll(".parts-dropdown");

  partDropdowns.forEach((dropdown) => {
    const currentSelection = dropdown.value;
    dropdown.querySelectorAll("option").forEach((option) => {
      option.disabled = selectedParts.includes(option.value) && option.value !== currentSelection;
    });
  });
}

// Handle form submission to JotForm
document.querySelector("body").addEventListener("submit", (e) => {
  const modelDropdown = document.getElementById("model-dropdown");
  const selectedModel = modelDropdown.value;
  const partsList = document.querySelectorAll("#parts-list .select-row");

  if (!selectedModel) {
    alert("Please select a model.");
    e.preventDefault();
    return;
  }

  const formattedParts = [];
  let hasEmptyFields = false;

  partsList.forEach((row) => {
    const part = row.querySelector(".parts-dropdown").value;
    const quantity = row.querySelector(".quantity-dropdown").value;

    if (!part || !quantity) {
      hasEmptyFields = true;
    } else {
      formattedParts.push(`${part}(${quantity})`);
    }
  });

  if (hasEmptyFields) {
    alert("Please fill out all part and quantity fields or remove empty rows.");
    e.preventDefault();
    return;
  }

  document.getElementById("input_90").value = selectedModel;
  document.getElementById("input_91").value = formattedParts.join(", ");

  // Send data to JotForm
  window.parent.postMessage({ type: "widget-complete" }, "*");
});

function formatOutput (){
 const model_number=document.getElementById("input_90");
  model_number.value=document.getElementById("model-dropdown").value;
};
