const checkInfo = document.getElementById("insetter");
async function uploadImage() {
  const fileInput = document.getElementById("image-input");
  const file = fileInput.files[0];
  if (!file) {
    alert("Please select an image file.");
    return;
  }

  const formData = new FormData();
  formData.append("photo", file);

  try {
    const response = await fetch("http://127.0.0.1:8081/classify_car_image", {
      method: "POST",
      body: formData,
    });
    const responseData = await response.json(); // Parse JSON response directly
    displayResult(responseData); // Display the result

    // Extract make and model from the response data
    const { make, model } = responseData[0]; // Assuming only one result is returned

    // Call getModelSpec function with make and model
    await getModelSpec(make, model);
  } catch (error) {
    console.error("Error uploading image:", error);
    alert("An error occurred while uploading the image.");
  }
}

async function getModelSpec(maker, model) {
  const url = `https://api.api-ninjas.com/v1/cars?model=${model}&make=${maker}`;
  console.log(url);
  const options = {
    method: "GET",
    headers: {
      "X-API-Key": "BoL5g2jkFkXGRqntg1bhYA==JplQLsR7lh5Hyv0k",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result[0]);
    // Handle the response here and display specifications
    const mileage = result[0].city_mpg;
    const bodyType = result[0].class;
    const cylinders = result[0].cylinders;
    const displacement = result[0].displacement;
    const drive = result[0].drive;
    const fueltype = result[0].fuel_type;

    checkInfo.innerHTML = `<li>Mileage : ${mileage} mpg</li>`;
    checkInfo.innerHTML += `<li>BodyType : ${bodyType} </li>`;
    checkInfo.innerHTML += `<li>Cylinders : ${cylinders} </li>`;
    checkInfo.innerHTML += `<li>Displacement : ${displacement} </li>`;
    checkInfo.innerHTML += `<li>Drive : ${drive} </li>`;
    checkInfo.innerHTML += `<li>Fueltype : ${fueltype} (gas is petrol)</li>`;
  } catch (error) {
    console.error(error);
  }
}

function displayResult(data) {
  const resultContainer = document.getElementById("result-container");
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";

  if (data.error) {
    resultDiv.textContent = "Error: " + data.error;
  } else {
    const modifiedData = data.map((item) => ({
      make: item.make,
      model: item.model,
    }));

    for (const item of modifiedData) {
      const p = document.createElement("p");
      p.textContent = `Make: ${item.make}, Model: ${item.model}`;
      resultDiv.appendChild(p);
    }
  }

  resultContainer.style.display = "block";
}

document.getElementById("image-input").addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = document.getElementById("image-preview");
      img.src = event.target.result;
      document.getElementById("image-preview-container").style.display =
        "block";
    };
    reader.readAsDataURL(file);
  }
});

// Call the uploadImage function when the user clicks on the upload button
document.getElementById("upload-button").addEventListener("click", uploadImage);
