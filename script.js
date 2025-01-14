document.getElementById("model-dropdown").addEventListener("change", function () {
  const partsSection = document.getElementById("parts-section");
  const partsList = document.getElementById("parts-list");

  const modelParts = {
    "Model 100": ["Part A1", "Part A2", "Part A3"],
    "Model 200": ["Part B1", "Part B2", "Part B3"],
  };

  const selectedModel = this.value;

  if (modelParts[selectedModel]) {
    partsList.innerHTML = `
      <div class="select-row">
        <select class="parts-dropdown">
          ${modelParts[selectedModel].map((part) => `<option value="${part}">${part}</option>`).join("")}
        </select>
        <select class="quantity-dropdown">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
    `;
    partsSection.style.display = "block";
  } else {
    partsSection.style.display = "none";
  }
});

function addPart() {
  const partsList = document.getElementById("parts-list");
  const newRow = document.createElement("div");
  newRow.className = "select-row";

  newRow.innerHTML = `
    <select class="parts-dropdown">
      <option value="">Select Part</option>
      <option value="Part A1">Part A1</option>
      <option value="Part A2">Part A2</option>
      <option value="Part A3">Part A3</option>
    </select>
    <select class="quantity-dropdown">
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
    </select>
  `;

  partsList.appendChild(newRow);  // Add the new row at the end of the list
}
