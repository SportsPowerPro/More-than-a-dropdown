function getFormattedPartsList() {
  const partsList = document.querySelectorAll("#parts-list .select-row");
  let formattedParts = [];
  let hasEmptyFields = false;

  partsList.forEach((row) => {
    const part = row.querySelector(".parts-dropdown").value;
    const quantity = row.querySelector(".quantity-dropdown").value;

    if (!part || !quantity) {
      hasEmptyFields = true;  // Track if any fields are empty
    } else {
      formattedParts.push(`${part}(${quantity})`);
    }
  });

  // Return both the formatted list and the validation status
  return { formattedParts: formattedParts.join(", "), hasEmptyFields };
}

function validateAndSendDataToJotForm() {
  const modelDropdown = document.getElementById("model-dropdown");
  const selectedModel = modelDropdown.value;

  if (!selectedModel) {
    alert("Please select a model number.");
    return false;
  }

  const { formattedParts, hasEmptyFields } = getFormattedPartsList();

  if (hasEmptyFields) {
    alert("Please fill out all part and quantity fields or remove empty lines.");
    return false;
  }

  if (!formattedParts) {
    alert("Please add at least one part and quantity.");
    return false;
  }

  // Populate hidden fields with data
  document.getElementById("hidden-model").value = selectedModel;
  document.getElementById("hidden-parts").value = formattedParts;

  // Send data to parent JotForm
  window.parent.postMessage(
    {
      model_number: selectedModel,
      parts_and_quantities: formattedParts,
    },
    "*"
  );

  alert("Form Submitted Successfully!");
  return true;
}

// Attach validation to form submission
document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();  // Prevent form from auto-submitting
  if (validateAndSendDataToJotForm()) {
    e.target.submit();  // Submit the form if validation passes
  }
});
