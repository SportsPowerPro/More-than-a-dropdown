const modelPartsData = {
  "MSC-3782-BM": [
    "A1", "A2", "A3", "A5", "A6", "A7", "B4", "C2",
    "J1", "J2", "J3", "J4", "J8", "J9", "K1", "L1",
    "L2", "N11", "N12", "R1", "R2A", "R2B", "R3",
    "R4", "R7", "R8", "S1", "X1-N", "X2-N", "X3-N",
    "X4-N", "X5-N", "X6", "Y2", "Hardware A", "Hardware B",
  ],
  "MSC-4510": [
    "A1A", "A2A", "A3A", "C2", "A4A", "A5A", "A6",
    "A7", "P1", "P2", "P3", "P4", "P5", "J1A", "J1B",
    "J2", "K1", "L1-N", "L2-N", "M1", "M2", "M3",
    "M4", "M5", "L3", "L4", "Y2", "X1-N", "X2-N",
    "X3-N", "X4-N", "X5-N", "X6", "MSC-4510-Hardware A",
    "MSC-4510-Hardware B",
  ],
};

function initializeWidget() {
  const modelDropdown = document.getElementById("model-dropdown");
  if (!modelDropdown) {
    console.error("Model dropdown not found");
    return;
  }

  // Populate the dropdown with model options
  modelDropdown.innerHTML = `
    <option value="" disabled selected>Select your Model Number</option>
    <option value="MSC-3782-BM">MSC-3782-BM</option>
    <option value="MSC-4510">MSC-4510</option>
  `;

  console.log("Model dropdown initialized with options");
}

function waitForFieldsAndPopulate(data) {
  const maxRetries = 10;
  let retries = 0;

  function populateFields() {
    const iframe = document.querySelector("iframe");
    const iframeDoc = iframe ? iframe.contentDocument : document;

    const modelField = iframeDoc.querySelector('[name="q96_modelnumber"]');
    const partsField = iframeDoc.querySelector('[name="q95_partsquantity"]');

    console.log("Model Field Found:", modelField);
    console.log("Parts Field Found:", partsField);

    if (modelField && partsField) {
      modelField.value = data.model;
      partsField.value = data.parts;
      console.log("Fields successfully updated:", data);
    } else if (retries < maxRetries) {
      retries++;
      console.log(`Retrying to find fields... Attempt: ${retries}`);
      setTimeout(populateFields, 500);
    } else {
      console.error("Failed to find fields after retries.");
    }
  }

  populateFields();
}

document.addEventListener("DOMContentLoaded", () => {
  initializeWidget();

  const modelDropdown = document.getElementById("model-dropdown");
  const partsList = document.getElementById("parts-list");
  const addPartButton = document.getElementById("add-part");

  function updateResults() {
    console.log("updateResults triggered");

    const partsListRows = document.querySelectorAll("#parts-list .select-row");
    const selectedModel = modelDropdown.value;

    const formattedParts = Array.from(partsListRows)
      .map((row) => {
        const part = row.querySelector(".parts-dropdown").value;
        const quantity = row.querySelector(".quantity-dropdown").value;
        return part && quantity ? `${part}(${quantity})` : null;
      })
      .filter(Boolean);

    const data = {
      model: selectedModel || "",
      parts: formattedParts.join(", ") || "",
    };

    console.log("Selected Model:", data.model);
    console.log("Formatted Parts:", data.parts);

    waitForFieldsAndPopulate(data);

    // Send structured data to JotForm
    JFCustomWidget.sendData(data);
  }

  addPartButton.addEventListener("click", () => {
    console.log("Add Part Button Clicked");

    const selectedModel = modelDropdown.value;
    if (!selectedModel) {
      alert("Please select a model first.");
      return;
    }

    const availableParts = modelPartsData[selectedModel] || [];
    const selectedParts = Array.from(
      document.querySelectorAll(".parts-dropdown")
    ).map((dropdown) => dropdown.value);

    const filteredParts = availableParts.filter(
      (part) => !selectedParts.includes(part)
    );

    const row = document.createElement("div");
    row.className = "select-row";

    row.innerHTML = `
      <select class="parts-dropdown">
        <option value="" disabled selected>Select a Part</option>
        ${filteredParts
          .map((part) => `<option value="${part}">${part}</option>`)
          .join("")}
      </select>
      <select class="quantity-dropdown">
        ${Array.from({ length: 100 }, (_, i) => `<option>${i + 1}</option>`).join("")}
      </select>
      <button class="remove-button">&times;</button>
    `;

    row.querySelector(".remove-button").addEventListener("click", () => {
      console.log("Remove Button Clicked");
      row.remove();
      updateResults();
    });

    partsList.appendChild(row);
    updateResults();
  });

  modelDropdown.addEventListener("change", () => {
    console.log("Model Dropdown Changed");
    partsList.innerHTML = "";
    updateResults();
  });
});
