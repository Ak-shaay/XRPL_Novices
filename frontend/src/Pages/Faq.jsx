import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Faq = () => {
  return (
    <div className="bg-dark bg-gradient d-flex flex-column min-vh-100">
      <Navbar />
      <div className="container mt-5">
        <h2 className="text-center text-white mb-4">Frequently Asked Questions</h2>
        
        {/* Bootstrap Accordion */}
        <div className="accordion accordion-flush" id="faqAccordion">
          <div className="accordion-item">
            <h2 className="accordion-header" id="faqHeading1">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faqCollapse1"
                aria-expanded="true"
                aria-controls="faqCollapse1"
              >
                <b>Is my personal information safe?</b>
              </button>
            </h2>
            <div
              id="faqCollapse1"
              className="accordion-collapse collapse show"
              aria-labelledby="faqHeading1"
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body">
                Yes, your personal information is safe. We are committed to protecting your privacy. Your identity will remain confidential.
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header" id="faqHeading2">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faqCollapse2"
                aria-expanded="false"
                aria-controls="faqCollapse2"
              >
                <b>How can I report a case of child labor?</b>
              </button>
            </h2>
            <div
              id="faqCollapse2"
              className="accordion-collapse collapse"
              aria-labelledby="faqHeading2"
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body">
                You can report a case of child labor by submitting a report through our website. Please provide as much detail as possible, including the location, nature of the work, and any identifying information (without compromising the child's privacy).
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header" id="faqHeading3">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faqCollapse3"
                aria-expanded="false"
                aria-controls="faqCollapse3"
              >
                <b>What happens after I submit a report?</b>
              </button>
            </h2>
            <div
              id="faqCollapse3"
              className="accordion-collapse collapse"
              aria-labelledby="faqHeading3"
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body">
                Once you submit a report, our team will review it and take appropriate action with authorized authorities,
                such as child protection agencies and law enforcement.
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header" id="faqHeading4">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faqCollapse4"
                aria-expanded="false"
                aria-controls="faqCollapse4"
              >
                <b>Will I be rewarded for reporting child labor?</b>
              </button>
            </h2>
            <div
              id="faqCollapse4"
              className="accordion-collapse collapse"
              aria-labelledby="faqHeading4"
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body">
                In some cases, we may offer rewards for information that leads to the successful investigation and prosecution of child labor cases. However, the primary goal of our website is to protect children, not to offer rewards.
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header" id="faqHeading5">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faqCollapse5"
                aria-expanded="false"
                aria-controls="faqCollapse5"
              >
                <b>Can I submit an anonymous report?</b>
              </button>
            </h2>
            <div
              id="faqCollapse5"
              className="accordion-collapse collapse"
              aria-labelledby="faqHeading5"
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body">
                Yes, you can submit an anonymous report. We will not collect any personal information from you.
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header" id="faqHeading6">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faqCollapse6"
                aria-expanded="false"
                aria-controls="faqCollapse6"
              >
                <b>What if I'm unsure if a situation constitutes child labor?</b>
              </button>
            </h2>
            <div
              id="faqCollapse6"
              className="accordion-collapse collapse"
              aria-labelledby="faqHeading6"
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body">
                If you're unsure, please submit a report anyway. Our team will review the information and determine if it constitutes child labor.
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header" id="faqHeading7">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faqCollapse7"
                aria-expanded="false"
                aria-controls="faqCollapse7"
              >
                <b>How can I help prevent child labor?</b>
              </button>
            </h2>
            <div
              id="faqCollapse7"
              className="accordion-collapse collapse"
              aria-labelledby="faqHeading7"
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body">
                You can help prevent child labor by raising awareness, supporting organizations that work to combat child labor, and reporting any suspected cases of child labor.
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Faq;
