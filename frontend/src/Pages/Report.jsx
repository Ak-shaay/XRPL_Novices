import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { useSelector } from "react-redux";

const Report = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const { walletAddress } = useSelector((state) => state.user);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  // Canvas and Image Handler
  const canvasRef = useRef(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selection, setSelection] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [isSelecting, setIsSelecting] = useState(false);
  const [previousCanvasState, setPreviousCanvasState] = useState(null);

  // Handle File Selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      setErrorMessage("No file selected.");
      setFile(null);
      return;
    }

    // Check if the file is an image
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      previewImage(selectedFile);
    } else {
      setErrorMessage("Please upload a valid image file.");
      setFile(null);
    }
  };

  // Preview image on canvas
  const previewImage = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const image = new Image();
      image.src = e.target.result;
      image.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // Resize canvas to fit the image within the max width
        const maxWidth = 400; // Max width for canvas
        const aspectRatio = image.width / image.height;
        const maxHeight = maxWidth / aspectRatio;

        canvas.width = maxWidth;
        canvas.height = maxHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        setUploadedImage(image);
      };
    };
    reader.readAsDataURL(file);
  };

  // Handle canvas mouse events for selection
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    setSelection({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      width: 0,
      height: 0,
    });
    setIsSelecting(true);
  };

  const handleMouseMove = (e) => {
    if (isSelecting) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const width = e.clientX - rect.left - selection.x;
      const height = e.clientY - rect.top - selection.y;
      setSelection({
        ...selection,
        width: Math.min(Math.max(width, 0), canvas.width - selection.x),
        height: Math.min(Math.max(height, 0), canvas.height - selection.y),
      });
    }

    // Change cursor to 'crosshair' when mouse is over the canvas
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const isInsideImage =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;

    if (isInsideImage) {
      canvas.style.cursor = "crosshair"; // Change cursor to crosshair when inside the canvas
    } else {
      canvas.style.cursor = "default"; // Reset to default cursor when outside the image
    }
  };

  const handleMouseUp = () => setIsSelecting(false);

  // Apply Blur Effect to Selected Area
  const applyBlurToSelection = () => {
    if (selection.width > 0 && selection.height > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Store the current state of the canvas before modifying it
      setPreviousCanvasState(
        ctx.getImageData(0, 0, canvas.width, canvas.height)
      );

      const imageData = ctx.getImageData(
        selection.x,
        selection.y,
        selection.width,
        selection.height
      );
      const blurredData = blurImageData(imageData);
      ctx.putImageData(blurredData, selection.x, selection.y);
    } else {
      alert("Please select a valid area to apply the blur effect.");
    }
  };

  // Simple Box Blur Function
  const blurImageData = (imageData) => {
    const radius = 5;
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const output = new ImageData(width, height);
    const outputData = output.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0,
          g = 0,
          b = 0,
          a = 0,
          count = 0;

        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const idx = (ny * width + nx) * 4;
              r += data[idx];
              g += data[idx + 1];
              b += data[idx + 2];
              a += data[idx + 3];
              count++;
            }
          }
        }

        const idx = (y * width + x) * 4;
        outputData[idx] = r / count;
        outputData[idx + 1] = g / count;
        outputData[idx + 2] = b / count;
        outputData[idx + 3] = a / count;
      }
    }
    return output;
  };

  // Undo last action
  const undoLastAction = () => {
    if (previousCanvasState) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.putImageData(previousCanvasState, 0, 0);
      setPreviousCanvasState(null); // Clear previous canvas state after undo
    } else {
      alert("No action to undo.");
    }
  };

  // Convert canvas to file and append to FormData
  const prepareImageFile = () => {
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
      const processedFile = new File([blob], "blurred_image.png", {
        type: "image/png",
      });
      setFile(processedFile); // Update file state with the processed file
    }, "image/png");
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!file) {
        setErrorMessage("Please upload an image.");
        return;
      }
    if (!description.trim()) {
        setErrorMessage("Please provide a description.");
        return;
      }
  
      if (!location.trim()) {
        setErrorMessage("Please enter the location of the incident.");
        return;
      }
  
    setLoading(true); // Start loading state

    const formData = new FormData();
    if (file) {
      formData.append("image", file);
    }
    formData.append("userId", walletAddress);
    formData.append("description", description);
    formData.append("userEnteredRegion", location);

    try {
      await axios.post("http://localhost:8000/api/v1/reports", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccessMessage("Report submitted successfully");
      setErrorMessage("");
      resetForm();
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "Failed to submit the report. " + error?.response?.data.message
      );
      setSuccessMessage("");
    } finally {
      setLoading(false); // End loading state
    }
  };

  // Reset form fields after submission
  const resetForm = () => {
    setFile(null);
    setDescription("");
    setLocation("");
    setUploadedImage(null);
    setSelection({ x: 0, y: 0, width: 0, height: 0 });
    // Clear the canvas
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Reset canvas size to initial values (e.g., 0 or desired size)
    canvas.width = 0;
    canvas.height = 0;
  };

  // Clear messages after a few seconds
  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage, successMessage]);

  return (
    <div className="bg-dark bg-gradient">
      <Navbar />
      <div className="container d-flex justify-content-center mt-3 mb-3">
        <div className="col-lg-8 col-md-10 col-12">
          <form className="border border-light rounded p-4 text-white">
            {/* Image Upload */}
            <div className="form-group mb-2">
              <label htmlFor="imageUpload" className="text-left">
                Upload Image
              </label>
              <input
                type="file"
                className="form-control-file"
                id="imageUpload"
                accept="image/*"
                onChange={handleFileChange}
                disabled={loading}
              />
            </div>

            {/* Tooltip for blur selection */}
            {uploadedImage && (
              <div className="text-center text-white mb-3">
                <span>Click and drag over the area to apply blur.</span>
              </div>
            )}

            {/* Canvas */}
            <div className="canvas-container d-flex justify-content-center">
              <canvas
                id="imageCanvas"
                ref={canvasRef}
                width={0}
                height={0}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </div>

            <div className="controls text-center d-flex gap-3 mt-2 justify-content-center">
              {uploadedImage && (
                <>
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={applyBlurToSelection}
                    disabled={loading}
                  >
                    Add Blur
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={undoLastAction}
                    disabled={loading}
                  >
                    Undo
                  </button>
                  {/* <button
                    type="button"
                    className="btn btn-success"
                    onClick={prepareImageFile}
                    disabled={loading}
                  >
                    Apply
                  </button> */}
                </>
              )}
            </div>

            {/* Description, Location, and Wallet Address */}
            <div className="mb-3">
              <label
                htmlFor="description"
                className="form-label d-flex justify-content-start"
              >
                Add description for the submitted item
              </label>
              <textarea
                className="form-control"
                id="description"
                rows="3"
                placeholder="Describe the incident with more information"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="location"
                className="form-label d-flex justify-content-start"
              >
                Location
              </label>
              <input
                type="text"
                className="form-control"
                id="location"
                placeholder="Enter location of incident"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Success/Failure Message */}
            {successMessage && (
              <div
                className="alert alert-success alert-dismissible fade show"
                role="alert"
              >
                {successMessage}
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                ></button>
              </div>
            )}

            {errorMessage && (
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
            )}

            <div className="mb-3 d-flex justify-content-center">
              <button
                type="button"
                className="py-0 px-4 btn"
                style={{ backgroundColor: "#6c63ff", color: "white" }}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Report;
