const API_KEY = "14f8d0810207120e808bf23ccb94e8cc"; // Replace with your actual API key

const models = {
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

const modelDropdown = document.getElementById("model-dropdown");
const partsList = document.getElementById("parts-list");
const addPartButton = document.getElementById("add-part");
const inputModel = document.getElementById("input-model");
const inputParts = document.getElementById("input-parts");

// Initialize model dropdown with a default option
function initializeModelDropdown() {
    modelDropdown.innerHTML = ""; // Clear all existing options

    // Default "Select your Model Number" option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select your Model Number";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    modelDropdown.appendChild(defaultOption);

    // Populate model options dynamically
    Object.keys(models).forEach(model => {
        const option = document.createElement("option");
        option.value = model;
        option.textContent = model;
        modelDropdown.appendChild(option);
    });
}

// Populate parts dropdown dynamically based on selected model
function populatePartsDropdown(dropdown, parts) {
    dropdown.innerHTML = ""; // Clear all options

    // Default "Select Part Number" option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select Part Number";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    dropdown.appendChild(defaultOption);

    parts.forEach(part => {
        const option = document.createElement("option");
        option.value = part;
        option.textContent = part;
        dropdown.appendChild(option);
    });
}

// Add a new part selection row
function addPartRow() {
    const row = document.createElement("div");
    row.classList.add("part-line");

    const partDropdown = document.createElement("select");
    partDropdown.classList.add("part-dropdown");

    const quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.min = 1;
    quantityInput.value = 1;
    quantityInput.classList.add("quantity-input");

    const removeButton = document.createElement("button");
    removeButton.textContent = "X";
    removeButton.classList.add("remove-part");
    removeButton.onclick = () => {
        row.remove();
        updateSummary();
    };

    // Populate parts dropdown with parts for the currently selected model
    const selectedModel = modelDropdown.value;
    if (selectedModel && models[selectedModel]) {
        populatePartsDropdown(partDropdown, models[selectedModel]);
    }

    row.appendChild(partDropdown);
    row.appendChild(quantityInput);
    row.appendChild(removeButton);
    partsList.appendChild(row);

    updateSummary();
}

// Update the summary fields and send data to JotForm
function updateSummary() {
    const selectedModel = modelDropdown.value;
    const selectedParts = Array.from(partsList.querySelectorAll(".part-line"))
        .map(line => {
            const part = line.querySelector(".part-dropdown").value;
            const quantity = line.querySelector(".quantity-input").value;
            return part && quantity ? `${part}(${quantity})` : null;
        })
        .filter(Boolean);

    // Update text fields for summary
    inputModel.value = selectedModel || "No model selected";
    inputParts.value = selectedParts.join(", ") || "No parts selected";

    if (window.JFCustomWidget) {
        const submitValue = selectedModel && selectedParts.length > 0
            ? { apiKey: API_KEY, model: selectedModel, parts: selectedParts }
            : null;

        JFCustomWidget.sendSubmit({
            valid: !!submitValue,
            value: submitValue
        });
    }
}

// Event listeners
modelDropdown.addEventListener("change", () => {
    const selectedModel = modelDropdown.value;
    if (selectedModel && models[selectedModel]) {
        // Update all parts dropdowns with new model's parts
        const partDropdowns = partsList.querySelectorAll(".part-dropdown");
        partDropdowns.forEach(dropdown => populatePartsDropdown(dropdown, models[selectedModel]));
    }
    updateSummary();
});

addPartButton.addEventListener("click", addPartRow);

partsList.addEventListener("change", updateSummary);

// Initialize the widget
initializeModelDropdown();
