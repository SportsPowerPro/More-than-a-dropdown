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
// Populate the model dropdown on widget initialization
function initializeWidget() {
  const modelDropdown = document.getElementById("model-dropdown");
  modelDropdown.innerHTML = `
    <option value="" disabled selected>Select your Model Number</option>
    <option value="MSC-3782-BM">MSC-3782-BM</option>
    <option value="MSC-4510">MSC-4510</option>
  `;
}

// Function to generate quantity options from 1 to 100
function getQuantityOptions() {
  let options = "";
  for (let i = 1; i <= 100; i++) {
    options += `<option value="${i}">${i}</option>`;
  }
  return options;
}

// Add a new part/quantity row
function addPart() {
  const selectedModel = document.getElementById("model-dropdown").value;
  const selectedParts = modelPartsData[selectedModel] || [];

  if (!selectedModel) {
    alert("Please select a model first.");
    return;
  }

  const selectedPartsList = Array.from(
    document.querySelectorAll(".parts-dropdown")
  )
    .map((dropdown) => dropdown.value)
    .filter((part) => part !== "");

  const availableParts = selectedParts.filter(
    (part) => !selectedPartsList.includes(part)
  );

  const newRow = document.createElement("div");
  newRow.className = "select-row";

  newRow.innerHTML = `
    <select class="parts-dropdown" onchange="updateResults()">
      <option value="" disabled selected>Select a Part</option>
      ${availableParts
        .map((part) => `<option value="${part}">${part}</option>`)
        .join("")}
    </select>
    <select class="quantity-dropdown" onchange="updateResults()">
      ${getQuantityOptions()}
    </select>
    <button class="remove-button" onclick="removePart(this)">❌</button>
  `;

  document.getElementById("parts-list").appendChild(newRow);
  updateResults();
}

// Update the widget results
function updateResults() {
  const partsList = document.querySelectorAll("#parts-list .select-row");
  const selectedModel = document.getElementById("model-dropdown").value;

  const formattedParts = Array.from(partsList)
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

  JFCustomWidget.sendData(data);
}

// Remove a part/quantity row
function removePart(button) {
  const row = button.closest(".select-row");
  if (row) {
    row.remove();
    updateResults();
  }
}

// Widget initialization and event subscriptions
document.addEventListener("DOMContentLoaded", () => {
  initializeWidget();

  JFCustomWidget.subscribe("ready", (data) => {
    console.log("Widget is ready:", data);

    // Prepopulate widget if there's existing data
    if (data.value) {
      const { model, parts } = JSON.parse(data.value);
      document.getElementById("model-dropdown").value = model;

      if (parts) {
        parts.split(", ").forEach((partQuantity) => {
          addPart();
          const lastRow = document.querySelectorAll(
            "#parts-list .select-row:last-child"
          )[0];
          const [part, quantity] = partQuantity.match(/(.+)\((\d+)\)/).slice(1);
          lastRow.querySelector(".parts-dropdown").value = part;
          lastRow.querySelector(".quantity-dropdown").value = quantity;
        });
      }
    }
  });

  JFCustomWidget.subscribe("submit", () => {
    const selectedModel = document.getElementById("model-dropdown").value;
    const partsList = document.querySelectorAll("#parts-list .select-row");

    const partsDetails = Array.from(partsList)
      .map((row) => {
        const part = row.querySelector(".parts-dropdown").value;
        const quantity = row.querySelector(".quantity-dropdown").value;
        return part && quantity ? `${part}(${quantity})` : null;
      })
      .filter(Boolean);

    const result = {
      valid: !!selectedModel && partsDetails.length > 0,
      value: JSON.stringify({
        model: selectedModel,
        parts: partsDetails.join(", "),
      }),
    };

    console.log("Submitting widget data:", result);
    JFCustomWidget.sendSubmit(result);
  });
});

// Add part button event
document.getElementById("add-part").addEventListener("click", addPart);
