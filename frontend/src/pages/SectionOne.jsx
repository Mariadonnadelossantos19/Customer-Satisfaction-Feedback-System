import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const SectionOne = () => {
  const [searchParams] = useSearchParams();
  const staffVisitId = searchParams.get("staffVisitId");

  const [formData, setFormData] = useState({
    staffVisit: staffVisitId || "", // Initialize with the passed staffVisitId
    name: "",
    organizationName: "",
    address: "",
    contactInfo: "",
    classification: "",
    professionalSpecify: "",
    othersSpecify: "",
    isFirstVisit: false,
    sex: "",
    ageGroup: "",
    isPwd: false,
    educationLevel: "",
    educationOthersSpecify: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const classifications = [
    "Student",
    "Owner of a business",
    "Employee of a business",
    "Government employee",
    "Professional",
    "Overseas Filipino Worker",
    "Not employed",
    "Others",
  ];

  const ageGroups = [
    "15 & below",
    "16-20",
    "21-30",
    "31-40",
    "41-50",
    "51-59",
    "60 & above",
  ];

  const educationLevels = [
    "Elementary",
    "High School",
    "College",
    "Masters/ PhD.",
    "Others",
  ];

  // Update formData when staffVisitId becomes available
  useEffect(() => {
    if (staffVisitId) {
      setFormData((prev) => ({ ...prev, staffVisit: staffVisitId }));
    }
  }, [staffVisitId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/customer-profiles",
        formData
      );
      setSuccess(true);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      setSuccess(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Customer Profile Form</h1>

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
          Profile created successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Full Name"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
              aria-label="Full Name"
            />

            <input
              type="text"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleInputChange}
              placeholder="Organization Name"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
              aria-label="Organization Name"
            />

            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Address"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
              aria-label="Address"
            />

            <input
              type="text"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleInputChange}
              placeholder="Contact Information"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
              aria-label="Contact Information"
            />
          </div>

          {/* Classification and Other Details */}
          <div className="space-y-4">
            <select
              name="classification"
              value={formData.classification}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
              aria-label="Classification"
            >
              <option value="">Select Classification</option>
              {classifications.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {formData.classification === "Professional" && (
              <input
                type="text"
                name="professionalSpecify"
                value={formData.professionalSpecify}
                onChange={handleInputChange}
                placeholder="Specify Professional Type"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                aria-label="Specify Professional Type"
              />
            )}

            {formData.classification === "Others" && (
              <input
                type="text"
                name="othersSpecify"
                value={formData.othersSpecify}
                onChange={handleInputChange}
                placeholder="Specify Other Classification"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                aria-label="Specify Other Classification"
              />
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isFirstVisit"
                checked={formData.isFirstVisit}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600"
                aria-label="First Visit"
              />
              <label>First Visit</label>
            </div>

            <div className="space-y-2">
              <label className="block">Sex</label>
              <select
                name="sex"
                value={formData.sex}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
                aria-label="Sex"
              >
                <option value="">Select Sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block">Age Group</label>
              <select
                name="ageGroup"
                value={formData.ageGroup}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
                aria-label="Age Group"
              >
                <option value="">Select Age Group</option>
                {ageGroups.map((age) => (
                  <option key={age} value={age}>
                    {age}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isPwd"
                checked={formData.isPwd}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600"
                aria-label="Person with Disability"
              />
              <label>Person with Disability</label>
            </div>

            <div className="space-y-2">
              <label className="block">Education Level</label>
              <select
                name="educationLevel"
                value={formData.educationLevel}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
                aria-label="Education Level"
              >
                <option value="">Select Education Level</option>
                {educationLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            {formData.educationLevel === "Others" && (
              <input
                type="text"
                name="educationOthersSpecify"
                value={formData.educationOthersSpecify}
                onChange={handleInputChange}
                placeholder="Specify Other Education Level"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                aria-label="Specify Other Education Level"
              />
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Submit Form"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default SectionOne;
