import React, { useState, useEffect } from "react";
import Joyride from "react-joyride";

const Walkthrough = ({ startTour }) => {
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    // Define steps for the walkthrough
    setSteps([
      {
        target: "#agencies-page-link",
        content: "This is where you can browse and fix meetings with digital marketing agencies.",
        placement: "bottom",
      },
      {
        target: "#new-company-button",
        content: "Click here to create a profile for your company.",
        placement: "bottom",
      },
      {
        target: "#post-project-button",
        content: "Post your project requirements here and get bids from agencies.",
        placement: "bottom",
      },
      {
        target: "#my-meetings-link",
        content: "Here you can view all the meetings you’ve requested with agencies.",
        placement: "bottom",
      },
    ]);
  }, []);

  return (
    <Joyride
      steps={steps}
      continuous={true} // Allows user to go step by step
      showSkipButton={true} // Adds a skip button
      run={startTour} // Runs the tour only if startTour is true
      styles={{
        options: {
          zIndex: 1000,
          backgroundColor: "#fff",
          primaryColor: "#1d72b8",
          textColor: "#333",
        },
      }}
    />
  );
};

export default Walkthrough;
