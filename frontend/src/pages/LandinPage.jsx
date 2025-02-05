const LandingPage = () => {
  const handleGetStarted = () => {
    // Add navigation logic here
    console.log("Get Started clicked");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8">
          Welcome to DOST Customer Satisfaction
        </h1>
        <button
          onClick={handleGetStarted}
          onKeyDown={(e) => e.key === "Enter" && handleGetStarted()}
          className="px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg 
            hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
            focus:ring-offset-2 transition-colors"
          aria-label="Get Started with DOST Customer Satisfaction Survey"
          tabIndex={0}
        >
          Get Started
        </button>
      </div>
    </main>
  );
};

export default LandingPage;
