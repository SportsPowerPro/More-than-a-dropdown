// Models and corresponding parts
const modelPartsData = {
  "MSC-3782-BM": [
    "A1", "A2", "A3", "A5", "A6", "A7", "B4", "C2",
    "J1", "J2", "J3", "J3", "J4", "J8", "J9", "K1",
    "L1", "L2", "N11", "N12", "R1", "R2A", "R2B", "R3", "R3",
    "R4", "R7", "R8", "R8", "S1", "X1-N", "X2-N", "X3-N",
    "X4-N", "X5-N", "X6", "Y2", "Hardware A", "Hardware B"
  ],
  "MSC-4510": [
    "A1A", "A2A", "A3A", "C2", "A4A", "A5A", "A6", "A7",
    "P1", "P2", "P3", "P4", "P5", "J1A", "J1B", "J2",
    "K1", "L1-N", "L2-N", "M1", "M2", "M3", "M4", "M5",
    "L3", "L4", "Y2", "X1-N", "X2-N", "X3-N", "X4-N",
    "X5-N", "X6", "MSC-4510-Hardware A", "MSC-4510-Hardware B"
  ]
};

// Function to format parts and quantities into "Part(Quantity)" format
function getFormattedPartsList() {
  const partsList = document.querySelectorAll("#parts-list .select-row");
  let formattedParts = [];

  partsList.forEach((row) => {
    const part = row.querySelector(".parts-dropdown").value;
    const quantity = row.querySelector(".quantity-dropdown").value;
    if (part && quantity) {
      formattedParts.push(`${part}(${quantity})`);  // Combine part and quantity
    }
  });

  return formattedParts.join(", ");  // Join all parts into a single string
}

// Function to handle form submission
function handleSubmitForm() {
  const modelDropdown = document.getElementById("model-dropdown");
  const selectedModel = modelDropdown.value;

  if (!selectedModel) {
    alert("Please select a model number.");
    return;
  }

  const formattedPartsList = getFormattedPartsList();

  if (!formattedPartsList) {
    alert("Please select at least one part and its quantity.");
    return;
  }

  console.log("Model:", selectedModel);
  console.log("Parts and Quantities:", formattedPartsList);

  // Example: Send data to JotForm hidden fields (you can add hidden inputs in your HTML)
  document.getElementById("hidden-model").value = selectedModel;
  document.getElementById("hidden-parts").value = formattedPartsList;

  alert("Form Submitted Successfully!");
}

