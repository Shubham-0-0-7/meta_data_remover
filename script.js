const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");
const previewContainer = document.getElementById("preview-container");
const removeBtn = document.getElementById("removeBtn");
const downloadBtn = document.getElementById("downloadBtn");
const toast = document.getElementById("toast");

let originalImageDataURL = "";
let cleanedBlob = null;

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 3000);
}

fileInput.addEventListener("change", handleFile);

function handleFile(event) {
  const file = event.target.files[0];
  if (!file || !file.type.startsWith("image/")) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    originalImageDataURL = e.target.result;
    preview.src = originalImageDataURL;
    previewContainer.style.display = "block";
    removeBtn.disabled = false;
    downloadBtn.disabled = true;
    showToast("Image loaded. Ready to remove metadata.");
  };
  reader.readAsDataURL(file);
}

removeBtn.addEventListener("click", () => {
  if (!originalImageDataURL) return;

  try {
    if (originalImageDataURL.startsWith("data:image/jpeg")) {
      // Step 1: Strip EXIF data using piexifjs
      let strippedDataURL = piexif.remove(originalImageDataURL);

      // Step 2: Load EXIF data
      const exifObj = piexif.load(strippedDataURL);

      // Step 3: Remove all EXIF tags that we don't need
      delete exifObj["GPS"];
      delete exifObj["Exif"];
      delete exifObj["0th"]; // Main EXIF section
      delete exifObj["1st"]; // Subsection, if exists

      // Step 4: Insert the stripped EXIF data back into the image
      strippedDataURL = piexif.insert(piexif.dump(exifObj), strippedDataURL);

      // Step 5: Convert cleaned image to Blob
      dataURLToBlob(strippedDataURL).then((blob) => {
        cleanedBlob = blob;
        preview.src = URL.createObjectURL(cleanedBlob);
        showToast("Metadata removed!");
        downloadBtn.disabled = false;
      });

    } else if (originalImageDataURL.startsWith("data:image/png")) {
      // Step 1: PNG files (no EXIF data but could have other metadata)
      let strippedDataURL = originalImageDataURL;

      // Step 2: Remove any unnecessary PNG metadata
      // PNG doesn't have EXIF like JPEG, but it can have other metadata (e.g., tEXt, zTXt)
      // We remove all non-essential metadata here

      strippedDataURL = removePNGMetadata(strippedDataURL);

      // Step 3: Convert cleaned image to Blob
      dataURLToBlob(strippedDataURL).then((blob) => {
        cleanedBlob = blob;
        preview.src = URL.createObjectURL(cleanedBlob);
        showToast("PNG metadata removed!");
        downloadBtn.disabled = false;
      });

    } else {
      showToast("Unsupported file type. Please upload JPEG or PNG.");
    }
  } catch (error) {
    console.error("Error removing metadata:", error);
    showToast("Error occurred while processing.");
  }
});

downloadBtn.addEventListener("click", () => {
  if (!cleanedBlob) return;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(cleanedBlob);
  a.download = "cleaned-image.jpg"; // or .png based on file type
  a.click();
});

function dataURLToBlob(dataurl) {
  return fetch(dataurl).then((res) => res.blob());
}

// Function to remove unnecessary PNG metadata (tEXt, zTXt, etc.)
function removePNGMetadata(dataURL) {
  // PNG has its metadata in chunks, like tEXt and zTXt, which can be stripped
  const data = atob(dataURL.split(",")[1]);
  const cleanedData = removePNGChunks(data);
  return "data:image/png;base64," + btoa(cleanedData);
}

// Function to remove all unnecessary chunks from PNG
function removePNGChunks(pngData) {
  let cleanedData = "";
  let i = 0;
  
  while (i < pngData.length) {
    // Get the length of the chunk
    const length = parseInt(pngData.slice(i, i + 8), 16);
    i += 8;

    // Skip chunks that are non-essential (e.g., tEXt, zTXt)
    const chunkType = pngData.slice(i + 8, i + 12);
    if (chunkType === "tEXt" || chunkType === "zTXt" || chunkType === "iTXt") {
      // Skip this chunk, do not add it to the cleaned data
      i += length + 4; // Skip length + CRC
    } else {
      // Add the chunk to cleaned data
      cleanedData += pngData.slice(i, i + 8 + length + 4); // Length + Chunk + CRC
      i += length + 12;
    }
  }

  return cleanedData;
}
