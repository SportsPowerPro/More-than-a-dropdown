// When a model is selected, show the corresponding parts
document.getElementById("model-dropdown").addEventListener("change", function () {
  const partsDropdown = document.getElementById("parts-dropdown");
  const partsSection = document.getElementById("parts-section");
  const quantitySection = document.getElementById("quantity-section");

  const modelParts = {
    "Model 100": ["Part A1", "Part A2", "Part A3"],
    "Model 200": ["Part B1", "Part B2", "Part B3"],
  };

  const selectedModel = this.value;

  // Show parts for the selected model
  if (modelParts[selectedModel]) {
    partsDropdown.innerHTML = modelParts[selectedModel]
      .map((part) => `<option value="${part}">${part}</option>`)
      .join("");
    partsSection.style.display = "block";
  } else {
    partsSection.style.display = "none";
    quantitySection.style.display = "none";
  }

  partsDropdown.addEventListener("change", function () {
    if (this.value) {
      quantitySection.style.display = "block";
    } else {
      quantitySection.style.display = "none";
    }
  });
});
function addPart() {
  const partsSection = document.getElementById('parts-section');
  const newRow = document.createElement('div');
  newRow.className = 'select-row';

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

  partsSection.appendChild(newRow);
}
