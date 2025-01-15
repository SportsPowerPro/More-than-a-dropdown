// Models and corresponding parts
const modelPartsData = {
  "MSC-3782-BM": [
    "A1",
    "A2",
    "A3",
    "A5",
    "A6",
    "A7",
    "B4",
    "C2",
    "J1",
    "J2",
    "J3",
    "J4",
    "J8",
    "J9",
    "K1",
    "L1",
    "L2",
    "N11",
    "N12",
    "R1",
    "R2A",
    "R2B",
    "R3",
    "R4",
    "R7",
    "R8",
    "S1",
    "X1-N",
    "X2-N",
    "X3-N",
    "X4-N",
    "X5-N",
    "X6",
    "Y2",
    "Hardware A",
    "Hardware B",
  ],
  "MSC-4510": [
    "A1A",
    "A2A",
    "A3A",
    "C2",
    "A4A",
    "A5A",
    "A6",
    "A7",
    "P1",
    "P2",
    "P3",
    "P4",
    "P5",
    "J1A",
    "J1B",
    "J2",
    "K1",
    "L1-N",
    "L2-N",
    "M1",
    "M2",
    "M3",
    "M4",
    "M5",
    "L3",
    "L4",
    "Y2",
    "X1-N",
    "X2-N",
    "X3-N",
    "X4-N",
    "X5-N",
    "X6",
    "MSC-4510-Hardware A",
    "MSC-4510-Hardware B",
  ],
};
// Populate the model dropdown on page load
window.onload = function () {
  const modelDropdown = document.getElementById("model-dropdown");
  modelDropdown.innerHTML = `
    <option value="" disabled selected>Select your Model Number</option>
    <option value="MSC-3782-BM">MSC-3782-BM</option>
    <option value="MSC-4510">MSC-4510</option>
  `;
};

// Function to generate quantity options from 1 to 100
function getQuantityOptions() {
  let options = "";
  for (let i = 1; i <= 100; i++) {
    options += `<option value="${i}">${i}</option>`;
  }
  return options;
}

// Add a new part/quantity row with validation for duplicates
function addPart() {
  const selectedModel = document.getElementById("model-dropdown").value;
  const selectedParts = modelPartsData[selectedModel] || [];

  if (!selectedModel) {
    alert("Please select a model first.");
    return;
  }

  const partsList = document.querySelectorAll("#parts-list .parts-dropdown");
  const newRow = document.createElement("div");
  newRow.className = "select-row";

  // Create the dropdowns and remove button
  newRow.innerHTML = `
      <select class="parts-dropdown" onchange="updateResults()">
        <option value="" disabled selected>Select a Part</option>
        ${selectedParts
          .map((part) => `<option value="${part}">${part}</option>`)
          .join("")}
      </select>
      <select class="quantity-dropdown" onchange="updateResults()">
        ${getQuantityOptions()}
      </select>
      <button class="remove-button" onclick="removePart(this)">❌</button>
    `;

  // Add the new row to the parts list
  document.getElementById("parts-list").appendChild(newRow);

  updateResults(); // Update the results after adding a new row
}

// Function to remove the part/quantity row
function removePart(button) {
  const row = button.closest(".select-row"); // Find the closest .select-row to the button
  if (row) {
    row.remove(); // Remove the row from the DOM
  }

  updateResults(); // Update results after removal
}

// Update hidden fields and display values
function updateResults() {
  const partsList = document.querySelectorAll("#parts-list .select-row");
  let formattedParts = [];

  partsList.forEach((row) => {
    const part = row.querySelector(".parts-dropdown").value;
    const quantity = row.querySelector(".quantity-dropdown").value;

    if (part && quantity) {
      formattedParts.push(`${part}(${quantity})`);
    }
  });

  const selectedModel = document.getElementById("model-dropdown").value;
  document.getElementById("input_90").value = selectedModel || "";
  document.getElementById("input_91").value = formattedParts.join(", ") || "";
}

// Function to update parent form fields when the button is clicked
document.getElementById("update-button").addEventListener("click", () => {
  const selectedModel = document.getElementById("model-dropdown").value || "";
  const partsRows = document.querySelectorAll("#parts-list .select-row");

  const partsDetails = Array.from(partsRows)
    .map((row) => {
      const part = row.querySelector(".parts-dropdown").value || "";
      const quantity = row.querySelector(".quantity-dropdown").value || "";
      return part && quantity ? `${part}(${quantity})` : null;
    })
    .filter(Boolean);

  // Update the parent form's hidden fields
  if (window.parent) {
    const parentDoc = window.parent.document;
    const modelInput = parentDoc.querySelector("#input_90");
    const partsInput = parentDoc.querySelector("#input_91");

    if (modelInput) modelInput.value = selectedModel;
    if (partsInput) partsInput.value = partsDetails.join(", ");

    alert("Fields updated in the parent form!");
  }
});

// Add event listener to update fields when the model selection changes
document
  .getElementById("model-dropdown")
  .addEventListener("change", updateResults);
