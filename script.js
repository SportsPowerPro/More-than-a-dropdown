const API_KEY = "14f8d0810207120e808bf23ccb94e8cc"; // Placeholder for potential future use

const modelsAndParts = {
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

const modelDropdown = document.getElementById('model-dropdown');
const partsList = document.getElementById('parts-list');
const inputModel = document.getElementById('input-model');
const inputParts = document.getElementById('input-parts');
const addPartButton = document.getElementById('add-part');

// Populate models dropdown
const populateModels = () => {
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'Select your Model Number';
  modelDropdown.appendChild(defaultOption);

  Object.keys(modelsAndParts).forEach(model => {
    const option = document.createElement('option');
    option.value = model;
    option.textContent = model;
    modelDropdown.appendChild(option);
  });
};

// Update parts dropdown
const updatePartsDropdown = (dropdown, model) => {
  dropdown.innerHTML = ''; // Clear existing options
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'Select Part Number';
  dropdown.appendChild(defaultOption);

  modelsAndParts[model].forEach(part => {
    const option = document.createElement('option');
    option.value = part;
    option.textContent = part;
    dropdown.appendChild(option);
  });
};

// Add new part row
const addPartRow = () => {
  const model = modelDropdown.value;
  if (!model) return alert('Please select a model first!');

  const row = document.createElement('div');
  row.className = 'part-row';

  const partDropdown = document.createElement('select');
  partDropdown.className = 'dropdown';
  updatePartsDropdown(partDropdown, model);

  const quantityInput = document.createElement('input');
  quantityInput.type = 'number';
  quantityInput.min = 1;
  quantityInput.value = 1;
  quantityInput.className = 'input-field';

  const removeButton = document.createElement('button');
  removeButton.textContent = 'X';
  removeButton.className = 'remove-button';
  removeButton.addEventListener('click', () => row.remove());

  row.appendChild(partDropdown);
  row.appendChild(quantityInput);
  row.appendChild(removeButton);
  partsList.appendChild(row);
};

// Update summary
const updateSummary = () => {
  const selectedModel = modelDropdown.value;
  inputModel.value = selectedModel || 'Selected Model';

  const partsSummary = Array.from(partsList.children)
    .map(row => {
      const part = row.querySelector('select').value;
      const quantity = row.querySelector('input').value;
      return part && quantity ? `${part}(${quantity})` : null;
    })
    .filter(Boolean)
    .join(', ');

  inputParts.value = partsSummary || 'Selected Parts and Quantities';
};

// Event listeners
modelDropdown.addEventListener('change', () => {
  partsList.innerHTML = ''; // Clear existing parts rows
  updateSummary();
});

addPartButton.addEventListener('click', addPartRow);
partsList.addEventListener('change', updateSummary);
partsList.addEventListener('input', updateSummary);

// Initialize
populateModels();
