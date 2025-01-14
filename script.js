document.getElementById("model-dropdown").addEventListener("change", function () {
  const partsSection = document.getElementById("parts-section");
  const partsDropdown = document.getElementById("parts-dropdown");

  const modelParts = {
    "Model 100": ["Part A1", "Part A2", "Part A3"],
    "Model 200": ["Part B1", "Part B2", "Part B3"],
  };

  const selectedModel = this.value;

  if (modelParts[selectedModel]) {
    partsDropdown.innerHTML = modelParts[selectedModel]
      .map((part) => `<option value="${part}">${part}</option>`)
      .join("");
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
    <select>
      <option value="">Select Part</option>
      <option value="Part A1">Part A1</option>
      <option value="Part A2">Part A2</option>
      <option value="Part A3">Part A3</option>
    </select>
    <select>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
    </select>
  `;

  partsList.appendChild(newRow); // Add new row above the button
}
