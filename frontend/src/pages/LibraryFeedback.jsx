// THIS IS FOR HE LIBRARY SECTION USER ONLY
import { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

const LibraryFeedback = () => {
  const [searchParams] = useSearchParams();
  const customerFeedbackId = searchParams.get("customerFeedbackId");
  const staffVisitId = searchParams.get("staffVisitId");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerFeedback: customerFeedbackId || "",
    staffVisit: staffVisitId || "",
    queriesAnswered: false,
    subjectsOfInterest: {
      agriHorticulture: false,
      aquacultureMarine: false,
      furniture: false,
      foodProcessing: false,
      giftsHousewaresDecors: false,
      healthAndPharma: false,
      ict: false,
      metalsAndEngineering: false,
      others: false,
      othersSpecify: "",
    },
    mainReason: "",
    mainReasonOthersSpecify: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/library-feedback", formData);
      setSuccess(true);
      setError("");
      
      // Navigate to Review Summary with all collected data
      navigate(`/review-summary?staffVisitId=${staffVisitId}&customerFeedbackId=${customerFeedbackId}`);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      setSuccess(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Library User Feedback Form</h1>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          Feedback submitted successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="space-y-4">
            {/* Queries Answered */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="queriesAnswered"
                checked={formData.queriesAnswered}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 rounded"
                aria-label="Queries Answered"
              />
              <label className="text-sm font-medium text-gray-700">
                Were your queries answered?
              </label>
            </div>

            {/* Subjects of Interest */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">
                Subjects of Interest:
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(formData.subjectsOfInterest).map(
                  ([key, value]) =>
                    key !== "othersSpecify" && (
                      <div key={key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name={`subjectsOfInterest.${key}`}
                          checked={value}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <label className="text-sm text-gray-700">
                          {key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                        </label>
                      </div>
                    )
                )}
              </div>
              {formData.subjectsOfInterest.others && (
                <input
                  type="text"
                  name="subjectsOfInterest.othersSpecify"
                  value={formData.subjectsOfInterest.othersSpecify}
                  onChange={handleInputChange}
                  placeholder="Please specify other subjects"
                  className="mt-2 w-full p-2 border rounded"
                />
              )}
            </div>

            {/* Main Reason */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Main Reason for Visit:
              </label>
              <select
                name="mainReason"
                value={formData.mainReason}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Reason</option>
                <option value="support_course">Support Course</option>
                <option value="independent_learning">
                  Independent Learning
                </option>
                <option value="leisure">Leisure</option>
                <option value="others">Others</option>
              </select>
              {formData.mainReason === "others" && (
                <input
                  type="text"
                  name="mainReasonOthersSpecify"
                  value={formData.mainReasonOthersSpecify}
                  onChange={handleInputChange}
                  placeholder="Please specify other reason"
                  className="mt-2 w-full p-2 border rounded"
                />
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Submit Library Feedback
        </button>
      </form>
    </div>
  );
};

export default LibraryFeedback;
