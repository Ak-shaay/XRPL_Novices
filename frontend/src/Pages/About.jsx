import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const About = () => {
  return (
    <div className="bg-dark bg-gradient d-flex flex-column min-vh-100">
      <Navbar />
      <div className="container py-5">
        <h1 className="text-white mb-4 ">About Us</h1>
        <p className="text-white text-start">
          Welcome to XRPL_Novices, a dedicated initiative focused on
          fighting child labour and ensuring every child has the opportunity to
          grow, learn, and thrive in a safe environment. We are a passionate
          team of advocates, educators, and human rights defenders committed to
          eradicating child labour and its devastating impact on communities
          around the world.
        </p>

        <h2 className="text-white mt-4 text-start">Our Mission</h2>
        <p className="text-white text-start">
          Our mission is to end child labour by raising awareness, influencing
          policy, and providing direct support to affected children and
          families. Through our efforts, we aim to create a world where no child
          is deprived of their childhood, education, or future opportunities.
          Together, we work to build stronger communities and provide children
          with a path toward a brighter future.
        </p>

        {/* <h2 className="text-white mt-4 text-start">What We Do</h2>
        <ul className="text-white text-start">
          <li>
            <strong>Raise Awareness:</strong> We use campaigns, events, and
            educational resources to inform communities about the dangers and
            long-term effects of child labour. By sharing knowledge, we empower
            individuals and organizations to take action against exploitation.
          </li>
          <li>
            <strong>Advocacy and Policy Change:</strong> We actively work with
            governments and global organizations to improve laws and policies
            that protect children’s rights, reduce child labour, and ensure
            access to quality education for all children.
          </li>
          <li>
            <strong>Support for Children and Families:</strong> Through
            partnerships with local organizations, we provide direct support to
            children affected by child labour, including access to education,
            healthcare, and vocational training. We also assist families by
            offering resources that address the root causes of child labour,
            such as poverty, and help them build sustainable livelihoods.
          </li>
          <li>
            <strong>Collaboration and Partnerships:</strong> We recognize that
            ending child labour requires collective action. We work alongside
            businesses, governments, and other non-profit organizations to
            ensure we build long-term solutions and deliver lasting change.
          </li>
        </ul> */}

        <h2 className="text-white mt-4 text-start">
          XRP Rewards for Reporting Child Labour
        </h2>
        <p className="text-white text-start">
          To empower the global community in our fight against child labour, we
          have introduced a unique rewards program. We believe that every person
          has a role to play in eliminating child exploitation. As part of our
          efforts, we reward individuals who report instances of child labour or
          share valuable information that helps us identify and address child
          exploitation.
        </p>

        <h3 className="text-white mt-3 text-start">How it Works:</h3>
        <ul className="text-white text-start">
          <li>
            <strong>Confidential Reporting:</strong> Reports can be made
            anonymously and securely.
          </li>
          <li>
            <strong>XRP Rewards:</strong> As a thank-you for your contribution,
            we reward the most impactful reports with XRP. Your support helps us
            gather crucial information and take swift action.
          </li>
          <li>
            <strong>Incentive for Action:</strong> Your involvement can help
            change lives, and your XRP reward is just one way we show our
            gratitude for helping us protect children.
          </li>
        </ul>

        <h2 className="text-white mt-4 text-start">Our Vision</h2>
        <p className="text-white text-start">
          We envision a world where no child is forced into work. A world where
          every child has the opportunity to learn, play, and grow in a
          nurturing environment. Our goal is to completely eradicate child
          labour by fostering systemic changes in education, legal protections,
          and community development.
        </p>

        <h2 className="text-white mt-4 text-start">Why We Care</h2>
        <p className="text-white text-start">
          Every day, millions of children are subjected to child labour, which
          robs them of their future. We stand against this injustice, and we
          believe that by uniting people from all walks of life, we can make a
          tangible difference. The use of XRP is just one innovative way we are
          motivating and rewarding the global community to stand up against
          child exploitation.
        </p>

        <h2 className="text-white mt-4 text-start">
          Join Us in Making a Difference
        </h2>
        <p className="text-white text-start">
          Your actions matter. By reporting child labour, spreading awareness,
          and supporting our initiatives, you are making an impact. With our XRP
          rewards program, you can play an active role in ending child labour,
          and we’ll reward you for your efforts. Join us today and help create a
          world where every child has the opportunity to thrive.
        </p>

        <h2 className="text-white mt-4 text-start">Contact Us</h2>
        <p className="text-white text-start">
          For more information about our XRP rewards program or to get involved,
          please contact us at [Contact Information]. Together, we can make a
          lasting difference in the lives of children worldwide.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default About;
