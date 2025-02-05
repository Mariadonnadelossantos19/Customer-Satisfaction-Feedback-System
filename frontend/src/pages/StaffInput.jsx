import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StaffInput = () => {
  const navigate = useNavigate();
  const initialFormState = {
    dateOfVisit: "",
    attendingStaff: "",
    serviceInquired: "",
    tna: false,
    technoTransfer: {
      enabled: false,
      sectors: {
        foodProcessing: false,
        metalsAndEngineering: false,
        giftsHousewaresDecors: false,
        healthAndPharma: false,
        agriHorticulture: false,
        ict: false,
        aquacultureMarine: false,
        furniture: false,
        others: false,
      },
      othersSpecify: "",
    },
    technoConsultancy: {
      enabled: false,
      services: {
        mpex: false,
        cape: false,
        cpt: false,
        energyAudit: false,
        others: false,
      },
      othersSpecify: "",
    },
    projectProposalPreparation: false,
    packagingAndLabeling: false,
    technologyTraining: false,
    technologyClinics: {
      enabled: false,
      name: "Technology Clinics/Forum",
    },
    scholarship: false,
    laboratory: {
      enabled: false,
      name: "Laboratory (Metrology/Microbiology)",
    },
    library: {
      enabled: false,
      name: "",
    },
    others: {
      enabled: false,
      specify: "",
    },
    referralSource: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
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

  const handleNestedChange = (section, subsection, field) => (e) => {
    const { checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: checked,
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/staff-visits",
        formData
      );
      setSuccess("Staff visit record created successfully!");
      navigate(`/SectionOne?staffVisitId=${response.data._id}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while submitting the form"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Staff Visit Input Form</h1>

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
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4 bg-white p-6 rounded-lg shadow">
          {/* Header Section */}
          <div className="bg-gray-100 p-4 rounded-t-lg">
            <h2 className="text-lg font-semibold text-center">
              To be filled out by DOST-MIMAROPA Staff
            </h2>
          </div>

          {/* Date and Staff Section */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date of visit/encounter:
              </label>
              <input
                type="date"
                name="dateOfVisit"
                value={formData.dateOfVisit}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Attending Staff:
              </label>
              <input
                type="text"
                name="attendingStaff"
                value={formData.attendingStaff}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Services Section */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">
              Services inquired on/availed:
            </h3>

            {/* TNA Checkbox */}
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                name="tna"
                checked={formData.tna}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 rounded border-gray-300"
              />
              <label className="ml-2 text-sm text-gray-700">
                Technology Needs Assessment (TNA)
              </label>
            </div>

            {/* Techno Transfer Section */}
            <div className="ml-4 mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="technoTransfer.enabled"
                  checked={formData.technoTransfer.enabled}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Techno. Transfer & Commercialization (SETUP/GIA)
                </label>
              </div>

              {formData.technoTransfer.enabled && (
                <div className="ml-6 mt-2">
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(formData.technoTransfer.sectors).map(
                      ([key, value]) =>
                        key !== "others" && (
                          <div key={key} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={handleNestedChange(
                                "technoTransfer",
                                "sectors",
                                key
                              )}
                              className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                            />
                            <label className="ml-2 text-sm text-gray-700">
                              {key
                                .replace(/([A-Z])/g, " $1")
                                .replace(/^./, (str) => str.toUpperCase())}
                            </label>
                          </div>
                        )
                    )}
                  </div>
                  {formData.technoTransfer.sectors.others && (
                    <input
                      type="text"
                      name="technoTransfer.othersSpecify"
                      value={formData.technoTransfer.othersSpecify}
                      onChange={handleChange}
                      placeholder="Please specify"
                      className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Techno Consultancy */}
            <div className="ml-4 mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="technoConsultancy.enabled"
                  checked={formData.technoConsultancy.enabled}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Techno. Consultancy
                </label>
              </div>

              {formData.technoConsultancy.enabled && (
                <div className="ml-6 mt-2">
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(formData.technoConsultancy.services).map(
                      ([key, value]) =>
                        key !== "others" && (
                          <div key={key} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={handleNestedChange(
                                "technoConsultancy",
                                "services",
                                key
                              )}
                              className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                            />
                            <label className="ml-2 text-sm text-gray-700">
                              {key.toUpperCase()}
                            </label>
                          </div>
                        )
                    )}
                  </div>
                  {formData.technoConsultancy.services.others && (
                    <input
                      type="text"
                      name="technoConsultancy.othersSpecify"
                      value={formData.technoConsultancy.othersSpecify}
                      onChange={handleChange}
                      placeholder="Please specify"
                      className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Other Services */}
            <div className="space-y-2">
              {[
                {
                  name: "projectProposalPreparation",
                  label: "Project Proposal Preparation",
                },
                {
                  name: "packagingAndLabeling",
                  label: "Packaging and Labeling",
                },
                { name: "technologyTraining", label: "Technology Training" },
                { name: "scholarship", label: "Scholarship" },
              ].map((service) => (
                <div key={service.name} className="flex items-center">
                  <input
                    type="checkbox"
                    name={service.name}
                    checked={formData[service.name]}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    {service.label}
                  </label>
                </div>
              ))}
            </div>

            {/* Special Services */}
            {["technologyClinics", "laboratory", "library"].map((service) => (
              <div key={service} className="flex items-center mt-2">
                <input
                  type="checkbox"
                  name={`${service}.enabled`}
                  checked={formData[service].enabled}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                />
                <label className="ml-2 text-sm text-gray-700">
                  {formData[service].name ||
                    service
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                </label>
              </div>
            ))}

            {/* Others */}
            <div className="mt-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="others.enabled"
                  checked={formData.others.enabled}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                />
                <label className="ml-2 text-sm text-gray-700">Others</label>
              </div>
              {formData.others.enabled && (
                <input
                  type="text"
                  name="others.specify"
                  value={formData.others.specify}
                  onChange={handleChange}
                  placeholder="Please specify"
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              )}
            </div>

            {/* Referral Source */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">
                How did you know of our services?
              </label>
              <input
                type="text"
                name="referralSource"
                value={formData.referralSource}
                onChange={handleChange}
                required
                placeholder="i.e. friend referral, TV, radio, newspaper, Internet, fairs/forums, etc."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
          >
            {isLoading ? "Processing..." : "Next"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StaffInput;
