import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Dashboard = () => {
  const [rewardAmount, setRewardAmount] = useState(0);
  const [adminMessage, setAdminMessage] = useState(""); // New state for admin message
  const [rejectMessage, setRejectMessage] = useState(""); // New state for rejection message
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false); // State for reject modal
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [actualLocation, setActualLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [reportData, setReportData] = useState([]);
  const [reportId, setReportId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);

  const getAllReports = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/api/v1/reports");
      if (response.status === 200) {
        setReportData(response.data.reports);
      } else {
        alert(response.data.message || "Failed to fetch reports");
      }
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred while fetching reports");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllReports();
  }, []);

  const handleViewClick = (data) => {
    setDescription(data.description);
    setLocation(data.userEnteredRegion);
    setActualLocation(data.region);
    setReportId(data._id);
    setImageUrl(`https://ipfs.io/ipfs/${data.ipfsHash}`);
    setShowModal(true);
  };

  const handleRewardClick = (id) => {
    setReportId(id);
    setShowRewardModal(true);
  };

  const handleRejectClick = (id) => {
    setReportId(id);
    setShowRejectModal(true); // Show reject modal
  };

  const closeModals = () => {
    setShowModal(false);
    setShowRewardModal(false);
    setShowRejectModal(false); // Close reject modal
    setRewardAmount(0);
    setAdminMessage("");
    setRejectMessage(""); // Reset reject message
    setErrorMessage('');
    setSuccessMessage('');
  };

  const setAction = async (reportId, status, rewardAmount, adminMessage) => {
    try {
      if (rewardAmount <= 0 || isNaN(rewardAmount)) {
        setErrorMessage("Please enter a valid reward amount.");
        setSuccessMessage("");
        return;
      }

      setIsActionLoading(true);
      const result = await axios.patch("http://localhost:8000/api/v1/reports", {
        id: reportId,
        status: status,
        rewardAmount: rewardAmount,
        adminMessage: adminMessage
      });

      if (result.status === 200) {
        setSuccessMessage("Reward sent successfully!");
        setErrorMessage("");
        getAllReports();
      } else {
        setErrorMessage("Failed to update report status.");
        setSuccessMessage("");
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "An error occurred while processing the request.";
      setErrorMessage(errorMessage);
      setSuccessMessage("");
    } finally {
      setIsActionLoading(false);
    }
  };

  const rejectAction = async (reportId, rejectMessage) => {
    try {
      if (!rejectMessage.trim()) {
        setErrorMessage("Please enter a rejection message.");
        setSuccessMessage("");
        return;
      }

      setIsActionLoading(true);
      const result = await axios.patch("http://localhost:8000/api/v1/reports", {
        id: reportId,
        status: "Rejected",
        adminMessage: rejectMessage
      });

      if (result.status === 200) {
        setSuccessMessage("Report rejected successfully!");
        setErrorMessage("");
        getAllReports();
      } else {
        setErrorMessage("Failed to reject the report.");
        setSuccessMessage("");
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "An error occurred while processing the request.";
      setErrorMessage(errorMessage);
      setSuccessMessage("");
    } finally {
      setIsActionLoading(false);
    }
  };

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
    <div className="bg-dark bg-gradient d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <div className="container-fluid pt-4 px-4">
          {/* <div className="row g-4">
            {["Today", "Total", "Processed Today", "Processed"].map((title, index) => (
              <div key={index} className="col-6 col-md-3">
                <div className="bg-light rounded d-flex align-items-center justify-content-between p-4">
                  <div className="ms-3">
                    <p className="mb-2">{title}</p>
                    <h6 className="mb-0">1234</h6>
                  </div>
                </div>
              </div>
            ))}
          </div> */}

          <div className="bg-light text-center rounded mt-3 p-4">
            <div className="table-responsive">
              <table className="table text-start align-middle table-bordered table-hover mb-0">
                <thead>
                  <tr className="text-dark">
                    <th>Report ID</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Content</th>
                    <th>Status</th>
                    <th>Admin action</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((item, index) => (
                    <tr key={index}>
                      <td>{item._id}</td>
                      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td>{item.region}</td>
                      <td>
                        <button className="btn btn-sm btn-primary" onClick={() => handleViewClick({
                          description: item.description,
                          userEnteredRegion: item.userEnteredRegion,
                          region: item.region,
                          ipfsHash: item.ipfsHash,
                          _id: item._id,
                        })}>
                          View
                        </button>
                      </td>
                      <td>{item.status}</td>
                      <td>
                        {item.status !== "Verified" && item.status !== "Rejected" ? (
                          <>
                            <button className="btn btn-sm btn-success" onClick={() => handleRewardClick(item._id)}>
                              Reward
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleRejectClick(item._id)}>
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-muted">{item.adminMessage}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* View Modal */}
      {showModal && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Description Details</h5>
                <button type="button" className="btn-close" onClick={closeModals}></button>
              </div>
              <div className="modal-body">
                <div className="row d-flex justify-content-center">
                  <div className="col-8">
                    <img src={imageUrl} className="img-fluid" alt="Unable to load image" />
                  </div>
                </div>
                <div className="row">
                  <div className="col-6 mb-3">
                    <label className="form-label">Location given by user</label>
                    <input type="text" className="form-control" value={location} disabled />
                  </div>
                  <div className="col-6 mb-3">
                    <label className="form-label">Actual location of image</label>
                    <input type="text" className="form-control" value={actualLocation} disabled />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea className="form-control" rows="3" value={description} disabled></textarea>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModals}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reward Modal */}
      {showRewardModal && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reward Report</h5>
                <button type="button" className="btn-close" onClick={closeModals}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Report ID</label>
                  <input type="text" className="form-control" value={reportId} disabled />
                </div>
                <div className="mb-3">
                  <label className="form-label">Select Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Amount"
                    value={rewardAmount}
                    onChange={(e) => setRewardAmount(e.target.value)}
                  />
                </div>
                {/* Admin Message Input */}
                <div className="mb-3">
                  <label className="form-label">Admin Message</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Enter message here"
                    value={adminMessage}
                    onChange={(e) => setAdminMessage(e.target.value)} 
                  />
                </div>
              </div>
              {successMessage && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  {successMessage}
                  <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
              )}
              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModals}>Close</button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setAction(reportId, "Verified", rewardAmount, adminMessage)} 
                  disabled={isActionLoading}
                >
                  {isActionLoading ? "Processing..." : "Confirm Reward"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reject Report</h5>
                <button type="button" className="btn-close" onClick={closeModals}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Report ID</label>
                  <input type="text" className="form-control" value={reportId} disabled />
                </div>
                {/* Reject Admin Message */}
                <div className="mb-3">
                  <label className="form-label">Admin Message</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Enter rejection message here"
                    value={rejectMessage}
                    onChange={(e) => setRejectMessage(e.target.value)} 
                  />
                </div>
              </div>
              {successMessage && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  {successMessage}
                  <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
              )}
              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModals}>Close</button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => rejectAction(reportId,rejectMessage)} 
                  disabled={isActionLoading}
                >
                  {isActionLoading ? "Processing..." : "Confirm Rejection"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Dashboard;
