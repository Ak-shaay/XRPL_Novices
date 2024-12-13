import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const PrivacyPolicies = () => {
  return (
    <div className="bg-dark bg-gradient d-flex flex-column min-vh-100">
      <Navbar />
      <div class="container mt-5" id="privacy-policy">
        <h2 class="text-center text-white ">Privacy Policy</h2>

        <div class="policy-content text-white text-start">
          <h3 class="policy-header text-white text-start">
            1. Anonymous Reporting
          </h3>
          <p>
            We value your privacy and understand the importance of anonymity in
            reporting sensitive incidents. To protect your identity and ensure
            that your report remains confidential:
          </p>
          <ul>
            <li>
              <strong>Anonymous submissions:</strong> You are not required to
              provide any personal information when submitting a report.
            </li>
            <li>
              <strong>No tracking of personal data:</strong> We do not collect
              or store any personal information related to your identity, such
              as your name, email address, or location, unless you voluntarily
              provide it.
            </li>
            <li>
              <strong>Secure system:</strong> We use a secure reporting system
              to maintain the confidentiality of both the reporter and the
              children involved.
            </li>
          </ul>
        </div>

        <div class="policy-content text-white text-start">
          <h3 class="policy-header text-white text-start">2. Blurring Faces</h3>
          <p>To protect the privacy of children in the images submitted:</p>
          <ul>
            <li>
              <strong>Face blurring/pixelation option:</strong> We provide a
              tool that allows you to blur or pixelate the faces of children in
              the images you submit. This helps prevent the identification of
              children while still allowing authorities to assess the situation
              and take necessary action.
            </li>
            <li>
              <strong>Pre-submission safety:</strong> Before submitting an
              image, we strongly encourage you to use this tool to ensure the
              protection of the children's identity.
            </li>
          </ul>
        </div>

        <div class="policy-content text-white text-start">
          <h3 class="policy-header text-white">
            3. Privacy Policy & Data Use
          </h3>
          <p>We are committed to transparency about how your data is used:</p>
          <ul>
            <li>
              <strong>Data collection:</strong> We only collect the data
              necessary to process and investigate child labor reports, such as
              the details of the incident and any images submitted.
            </li>
            <li>
              <strong>Confidentiality:</strong> Any information you provide will
              be kept confidential and only shared with authorized authorities,
              such as child protection agencies and law enforcement, as part of
              an investigation.
            </li>
            <li>
              <strong>Data storage:</strong> We take appropriate technical and
              organizational measures to protect your data from unauthorized
              access or disclosure. We ensure that all personal data is stored
              securely and deleted when no longer necessary.
            </li>
          </ul>
        </div>

        <div class="policy-content text-white text-start">
          <h3 class="policy-header text-white">
            4. Ethical Guidelines for Image Submission
          </h3>
          <p>
            We hold ourselves to high ethical standards when handling sensitive
            material:
          </p>
          <ul>
            <li>
              <strong>Respect for children’s dignity:</strong> All images of
              children should be submitted with the utmost respect for their
              dignity and privacy.
            </li>
            <li>
              <strong>No exploitation:</strong> We do not condone the use of
              images that exploit or harm children in any way. Images should
              only be submitted if they are directly relevant to reporting
              suspected child labor.
            </li>
            <li>
              <strong>Compliance with laws:</strong> By submitting images, you
              agree that they do not violate any laws regarding child protection
              or the distribution of sensitive content.
            </li>
          </ul>
        </div>

        <div class="policy-content text-white text-start">
          <h3 class="policy-header ">
            5. Collaboration with Authorities
          </h3>
          <p>
            To ensure the timely and effective investigation of child labor
            incidents:
          </p>
          <ul>
            <li>
              <strong>Sharing with authorities:</strong> We work closely with
              child protection agencies and law enforcement to ensure that all
              reports are investigated. This may include sharing information you
              submit, such as images and case details, with relevant
              authorities.
            </li>
            <li>
              <strong>Privacy protection:</strong> When sharing information with
              authorities, we will take steps to protect the identities of the
              children involved by blurring faces and removing any unnecessary
              personal data.
            </li>
          </ul>
        </div>

        <div class="policy-content text-white text-start">
          <h3 class="policy-header">
            {/* 6. Education and Awareness */}
            6. Awareness
          </h3>
          <p>
            We believe in the importance of responsible reporting and raising
            awareness about privacy risks:
          </p>
          <ul>
            <li>
              <strong>Responsible reporting:</strong> We encourage users to
              report suspected child labor incidents responsibly and ethically.
              Before submitting, please ensure that the images and information
              provided are relevant to the case and do not compromise the safety
              or privacy of the children.
            </li>
            {/* <li>
              <strong>Education on privacy risks:</strong> We provide resources
              to help users understand the potential risks of sharing images of
              children online and emphasize the importance of protecting their
              privacy.
            </li> */}
          </ul>
        </div>

        <div class="policy-content text-white text-start">
          <h3 class="policy-header">
            7. Changes to This Privacy Policy
          </h3>
          <p>
            We may update this privacy policy periodically to reflect changes in
            our practices or legal obligations. When we do, we will post the
            updated policy on this page with the date of the last revision. We
            encourage you to review this policy regularly to stay informed about
            how we are protecting your privacy.
          </p>
        </div>

        <div class="policy-content text-white text-start">
          <h3 class="policy-header">8. Contact Us</h3>
          <p>
            If you have any questions or concerns about this privacy policy or
            how your data is being handled, please contact us through our
            support page or email address.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicies;
