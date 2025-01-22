document.addEventListener("DOMContentLoaded", () => {
  const modelPartsData = {
    "MSC-3782-BM": ["A1", "A2", "A3", "A5"],
    "MSC-4510": ["A1A", "A2A", "A3A", "C2"],
  };

  initializeWidget();

  function initializeWidget() {
    const modelDropdown = document.getElementById("model-dropdown");
    if (!modelDropdown) {
      console.error("Model dropdown not found.");
      return;
    }

    modelDropdown.innerHTML = `
      <option value="" disabled selected>Select your Model Number</option>
      <option value="MSC-3782-BM">MSC-3782-BM</option>
      <option value="MSC-4510">MSC-4510</option>
    `;
    console.log("Model dropdown initialized.");
  }

  function logDomInfo(doc) {
    console.log("Logging all DOM elements for debugging:");
    Array.from(doc.querySelectorAll("*")).forEach((el) => {
      console.log({
        tag: el.tagName,
        id: el.id,
        name: el.name,
        visible: el.offsetParent !== null,
      });
    });
  }

  function waitForFieldsAndPopulate(data) {
    const maxRetries = 10;
    let retries = 0;

    function populateFields() {
      const iframe = document.querySelector("iframe");
      const iframeDoc = iframe ? iframe.contentDocument || iframe.contentWindow.document : document;

      // Attempt to find fields
      const modelField = iframeDoc.querySelector("#input_96") || iframeDoc.querySelector('[name="q96_modelnumber"]');
      const partsField = iframeDoc.querySelector("#input_95") || iframeDoc.querySelector('[name="q95_partsquantity"]');

      if (modelField && partsField) {
        modelField.value = data.model;
        partsField.value = data.parts;
        console.log("Fields successfully updated:", { model: data.model, parts: data.parts });
      } else if (retries < maxRetries) {
        retries++;
        console.log(`Retrying to find fields... Attempt: ${retries}`);
        setTimeout(populateFields, 500);
      } else {
        console.error("Failed to find fields after retries.");
        logDomInfo(iframeDoc);
      }
    }

    populateFields();
  }

  function updateResults() {
    const modelDropdown = document.getElementById("model-dropdown");
    const partsListRows = document.querySelectorAll("#parts-list .select-row");
    const selectedModel = modelDropdown.value;

    const formattedParts = Array.from(partsListRows)
      .map((row) => {
        const part = row.querySelector(".parts-dropdown")?.value;
        const quantity = row.querySelector(".quantity-dropdown")?.value;
        return part && quantity ? `${part}(${quantity})` : null;
      })
      .filter(Boolean);

    const data = {
      model: selectedModel || "",
      parts: formattedParts.join(", ") || "",
    };

    console.log("Selected Model:", data.model);
    console.log("Formatted Parts:", data.parts);

    waitForFieldsAndPopulate(data);
    JFCustomWidget.sendData(data);
  }

  document.getElementById("add-part").addEventListener("click", () => {
    const modelDropdown = document.getElementById("model-dropdown");
    const selectedModel = modelDropdown.value;

    if (!selectedModel) {
      alert("Please select a model first.");
      return;
    }

    const availableParts = modelPartsData[selectedModel] || [];
    const selectedParts = Array.from(document.querySelectorAll(".parts-dropdown")).map((dropdown) => dropdown.value);

    const filteredParts = availableParts.filter((part) => !selectedParts.includes(part));

    const row = document.createElement("div");
    row.className = "select-row";

    row.innerHTML = `
      <select class="parts-dropdown">
        <option value="" disabled selected>Select a Part</option>
        ${filteredParts.map((part) => `<option value="${part}">${part}</option>`).join("")}
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

    document.getElementById("parts-list").appendChild(row);
    updateResults();
  });

  document.getElementById("model-dropdown").addEventListener("change", () => {
    document.getElementById("parts-list").innerHTML = "";
    updateResults();
  });
});
