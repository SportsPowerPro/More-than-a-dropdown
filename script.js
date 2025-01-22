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

document.addEventListener("DOMContentLoaded", () => {
  const modelDropdown = document.getElementById("model-dropdown");
  const partsList = document.getElementById("parts-list");
  const addPartButton = document.getElementById("add-part");

  function updateResults() {
    const partsListRows = document.querySelectorAll("#parts-list .select-row");
    const selectedModel = document.getElementById("model-dropdown").value;

    // Format parts and quantities into a string
    const formattedParts = Array.from(partsListRows)
      .map((row) => {
        const part = row.querySelector(".parts-dropdown").value;
        const quantity = row.querySelector(".quantity-dropdown").value;
        return part && quantity ? `${part}(${quantity})` : null;
      })
      .filter(Boolean);

    // Create the data object to send
    const data = {
      model: selectedModel || "",
      parts: formattedParts.join(", ") || "",
    };

    // Populate the JotForm read-only fields
    const modelField = document.querySelector('[name="modelNumber"]');
    const partsField = document.querySelector('[name="partsQuantity"]');

    if (modelField) modelField.value = data.model; // Update Model Number field
    if (partsField) partsField.value = data.parts; // Update Parts/Quantities field

    // Send structured data to JotForm
    JFCustomWidget.sendData(data);
  }

  addPartButton.addEventListener("click", () => {
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
      row.remove();
      updateResults();
    });

    partsList.appendChild(row);
    updateResults();
  });

  modelDropdown.addEventListener("change", () => {
    partsList.innerHTML = ""; // Clear parts list on model change
    updateResults();
  });
});
