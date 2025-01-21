document.addEventListener("DOMContentLoaded", function () {
    // API Key initialization
    const API_KEY = "14f8d0810207120e808bf23ccb94e8cc"; // Replace with your actual API key

    // Initialize JotForm Widget
    if (window.JFCustomWidget) {
        JFCustomWidget.subscribe("submit", function () {
            const model = document.getElementById("model-dropdown").value;
            const parts = Array.from(document.querySelectorAll(".part-line")).map(line => {
                const part = line.querySelector(".part-dropdown").value;
                const quantity = line.querySelector(".quantity-input").value;
                return part && quantity ? `${part}(${quantity})` : null;
            }).filter(Boolean);

            // Validate and send data
            if (model && parts.length) {
                JFCustomWidget.sendSubmit({
                    valid: true,
                    value: {
                        apiKey: API_KEY,
                        model: model,
                        parts: parts
                    }
                });
            } else {
                JFCustomWidget.sendSubmit({
                    valid: false,
                    value: {
                        error: "Model and parts must be selected."
                    }
                });
            }
        });
    }

    // Models and parts
    const modelParts = {
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

    // DOM Elements
    const modelDropdown = document.getElementById("model-dropdown");
    const addPartButton = document.getElementById("add-part-button");
    const partsList = document.getElementById("parts-list");
    const inputModel = document.getElementById("input_90");
    const inputParts = document.getElementById("input_91");

    // Utility: Throttle updates
    let debounceTimer;
    function debounce(func, delay) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(func, delay);
    }

    // Populate model dropdown
    function populateModelDropdown() {
        Object.keys(modelParts).forEach((model) => {
            const option = document.createElement("option");
            option.value = model;
            option.textContent = model;
            modelDropdown.appendChild(option);
        });
    }

    // Populate part dropdown for a specific model
    function populatePartDropdown(partDropdown, model) {
        const parts = modelParts[model] || [];
        partDropdown.innerHTML = parts
            .map((part) => `<option value="${part}">${part}</option>`)
            .join("");
    }

    // Add a new part line
    function addPart() {
        const selectedModel = modelDropdown.value;

        if (!selectedModel) {
            alert("Please select a model first.");
            return;
        }

        const partLine = document.createElement("div");
        partLine.className = "part-line";

        const partDropdown = document.createElement("select");
        partDropdown.className = "part-dropdown";
        populatePartDropdown(partDropdown, selectedModel);

        const quantityInput = document.createElement("input");
        quantityInput.className = "quantity-input";
        quantityInput.type = "number";
        quantityInput.min = 1;
        quantityInput.value = 1;

        const removeButton = document.createElement("button");
        removeButton.className = "remove-part";
        removeButton.textContent = "X";

        // Remove part event
        removeButton.addEventListener("click", () => {
            partLine.remove();
            updateSummary();
        });

        // Prevent duplicate parts
        partDropdown.addEventListener("change", () => {
            const selectedPart = partDropdown.value;
            const duplicate = Array.from(
                partsList.querySelectorAll(".part-dropdown")
            ).some((dropdown) => dropdown !== partDropdown && dropdown.value === selectedPart);

            if (duplicate) {
                alert(`Duplicate part "${selectedPart}" is not allowed.`);
                partDropdown.value = "";
            }
            updateSummary();
        });

        partLine.appendChild(partDropdown);
        partLine.appendChild(quantityInput);
        partLine.appendChild(removeButton);

        partsList.appendChild(partLine);
        updateSummary();
    }

    // Update the result summary
    function updateSummary() {
        debounce(() => {
            const selectedModel = modelDropdown.value;
            const selectedParts = Array.from(
                partsList.querySelectorAll(".part-line")
            ).map((line) => {
                const part = line.querySelector(".part-dropdown").value;
                const quantity = line.querySelector(".quantity-input").value;
                return part && quantity ? `${part}(${quantity})` : null;
            }).filter(Boolean);

            // Update text fields
            inputModel.value = selectedModel || "No model selected";
            inputParts.value = selectedParts.join(", ") || "No parts selected";

            // Send to JotForm
            if (window.JFCustomWidget) {
                JFCustomWidget.sendSubmit({
                    valid: !!selectedModel && selectedParts.length > 0,
                    value: {
                        apiKey: API_KEY,
                        model: selectedModel,
                        parts: selectedParts,
                    },
                });
            }
        }, 300);
    }

    // Populate dropdowns and set up event listeners
    populateModelDropdown();
    addPartButton.addEventListener("click", addPart);
    modelDropdown.addEventListener("change", () => {
        // Reset parts list when model changes
        partsList.innerHTML = "";
        updateSummary();
    });

    // Initial update
    updateSummary();
});
