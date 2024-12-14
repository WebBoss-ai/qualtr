import React, { useState, useEffect } from "react";
import Joyride from "react-joyride";

const Walkthrough = ({ startTour }) => {
  const [steps, setSteps] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setSteps([
      {
        target: "#agencies-page-link",
        content: "Browse and schedule meetings with top digital marketing agencies.",
        placement: "bottom",
      },
      {
        target: "#new-company-button",
        content: "Create a profile for your company to get personalized recommendations.",
        placement: "bottom",
      },
      {
        target: "#post-project-button",
        content: "Post your project requirements and receive competitive bids from agencies.",
        placement: "bottom",
      },
      {
        target: "#my-meetings-link",
        content: "View and manage all your scheduled meetings with agencies.",
        placement: "bottom",
      },
    ]);
  }, []);

  return (
    <>
      <Joyride
        steps={steps}
        continuous={true}
        showSkipButton={true}
        showProgress={true}
        run={startTour}
        styles={{
          options: {
            zIndex: 10000,
            primaryColor: "#17B169",
            backgroundColor: "#ffffff",
            arrowColor: "#ffffff",
            textColor: "#333333",
          },
          tooltip: {
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            padding: "20px",
          },
          tooltipContainer: {
            textAlign: "left",
          },
          tooltipTitle: {
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "10px",
            color: "#17B169",
          },
          tooltipContent: {
            fontSize: "14px",
            lineHeight: "1.5",
          },
          buttonNext: {
            backgroundColor: "#17B169",
            color: "#ffffff",
            padding: "10px 15px",
            borderRadius: "5px",
            border: "none",
            fontSize: "14px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          },
          buttonBack: {
            color: "#17B169",
            marginRight: "10px",
            fontSize: "14px",
            cursor: "pointer",
          },
          buttonSkip: {
            color: "#666666",
            fontSize: "14px",
            cursor: "pointer",
          },
          beacon: {
            inner: "#17B169",
            outer: "#17B16940",
          },
        }}
        floaterProps={{
          disableAnimation: true,
          styles: {
            floater: {
              filter: "drop-shadow(0 2px 5px rgba(0, 0, 0, 0.1))",
            },
          },
        }}
        callback={(data) => {
          if (data.status === "finished" || data.status === "skipped") {
            setShowModal(true);
          }
        }}
      />
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10001]">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-[#17B169] mb-4">Tour Completed!</h2>
            <p className="text-gray-700 mb-4">
              Thank you for completing the walkthrough. You're now ready to explore our platform!
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-[#17B169] text-white px-4 py-2 rounded hover:bg-[#14a05c] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Walkthrough;
