import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

const SectionOne = () => {
  const [searchParams] = useSearchParams();
  const staffVisitId = searchParams.get("staffVisitId");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    staffVisit: staffVisitId || "",
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
      navigate(
        `/customer-feedback?customerProfileId=${response.data._id}&staffVisitId=${staffVisitId}`
      );
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      setSuccess(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Customer Profile Form</h1>
            <p className="text-gray-600 mt-2">Please fill in your information below</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded" role="alert">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded" role="alert">
              <p className="text-green-700">Profile created successfully!</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6 bg-white p-8 rounded-lg shadow-lg">
              {/* Basic Information Section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                      <input
                        type="text"
                        name="organizationName"
                        value={formData.organizationName}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                        rows="2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Information</label>
                      <input
                        type="text"
                        name="contactInfo"
                        value={formData.contactInfo}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Classification Section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Classification</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Classification</label>
                    <select
                      name="classification"
                      value={formData.classification}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    >
                      <option value="">Select Classification</option>
                      {classifications.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </div>

                  {formData.classification === "Professional" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Specify Professional Type</label>
                      <input
                        type="text"
                        name="professionalSpecify"
                        value={formData.professionalSpecify}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  )}

                  {formData.classification === "Others" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Specify Other Classification</label>
                      <input
                        type="text"
                        name="othersSpecify"
                        value={formData.othersSpecify}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Personal Information Section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 bg-white p-3 rounded-lg border border-gray-200">
                      <input
                        type="checkbox"
                        name="isFirstVisit"
                        checked={formData.isFirstVisit}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label className="text-gray-700">First Visit</label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
                      <select
                        name="sex"
                        value={formData.sex}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      >
                        <option value="">Select Sex</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
                      <select
                        name="ageGroup"
                        value={formData.ageGroup}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      >
                        <option value="">Select Age Group</option>
                        {ageGroups.map((age) => (
                          <option key={age} value={age}>{age}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 bg-white p-3 rounded-lg border border-gray-200">
                      <input
                        type="checkbox"
                        name="isPwd"
                        checked={formData.isPwd}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label className="text-gray-700">Person with Disability</label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
                      <select
                        name="educationLevel"
                        value={formData.educationLevel}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      >
                        <option value="">Select Education Level</option>
                        {educationLevels.map((level) => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>

                    {formData.educationLevel === "Others" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Specify Other Education Level</label>
                        <input
                          type="text"
                          name="educationOthersSpecify"
                          value={formData.educationOthersSpecify}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SectionOne;