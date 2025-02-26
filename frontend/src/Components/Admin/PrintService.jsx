export class PrintService {
  static printFeedbackForm(feedbackData) {
    const printWindow = window.open('', '_blank');

    // Construct the content for printing
    const content = `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
        <h1 style="font-size: 28px; font-weight: bold; margin-bottom: 5px;">CUSTOMER SATISFACTION FEEDBACK FORM</h1>
        <h2 style="font-size: 20px; margin-bottom: 5px;">DEPARTMENT OF SCIENCE AND TECHNOLOGY</h2>
        <h3 style="font-size: 18px; margin-bottom: 5px;">MIMAROPA REGION</h3>
        <p style="margin-bottom: 5px;">TO F1</p>
        <p style="margin-bottom: 5px;">Rev 1/04-25-16</p>
        <p style="margin-bottom: 5px;">Date of visit/encounter: ${new Date(feedbackData.dateOfVisit).toLocaleDateString()}</p>
        <p style="margin-bottom: 20px;">Attending Staff: ${feedbackData.attendingStaff || 'N/A'}</p>

        <!-- Customer Profile Section -->
        <h4 style="margin-top: 20px;">SECTION 1: CUSTOMER'S PROFILE</h4>
        <p><strong>Full Name:</strong> ${feedbackData.customerProfile?.name || 'N/A'}</p>
        <p><strong>Organization:</strong> ${feedbackData.customerProfile?.organization || 'N/A'}</p>
        <p><strong>Address:</strong> ${feedbackData.customerProfile?.address || 'N/A'}</p>
        <p><strong>Contact:</strong> ${feedbackData.customerProfile?.contact || 'N/A'}</p>
        <p><strong>Classification:</strong> ${feedbackData.customerProfile?.classification || 'N/A'}</p>
        <p><strong>First Visit:</strong> ${feedbackData.customerProfile?.isFirstVisit ? 'Yes' : 'No'}</p>
        <p><strong>Sex:</strong> ${feedbackData.customerProfile?.sex || 'N/A'}</p>

        <!-- Satisfaction Ratings -->
        <h4 style="margin-top: 20px;">SECTION 2: CUSTOMER EVALUATION/FEEDBACK</h4>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Drivers of Satisfaction</th>
            <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Rating (1-5)</th>
          </tr>
          ${Object.entries(feedbackData.customerFeedback?.satisfaction || {}).map(([key, value]) => `
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">${key.replace(/([A-Z])/g, ' $1').trim()}</td>
              <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">${value || 'N/A'}</td>
            </tr>
          `).join('')}
        </table>

        <p style="margin-top: 15px;"><strong>Recommendation Score:</strong> ${feedbackData.customerFeedback?.recommendationScore || 'N/A'}/10</p>
        <p style="margin-top: 10px;"><strong>Suggestions:</strong> ${feedbackData.customerFeedback?.suggestions || 'No suggestions provided'}</p>

        <!-- Library Feedback if applicable -->
        ${feedbackData.library?.enabled ? `
          <h4 style="margin-top: 20px;">SECTION 3: LIBRARY USERS ONLY</h4>
          <p><strong>Queries Answered:</strong> ${feedbackData.libraryFeedback?.queriesAnswered ? 'Yes' : 'No'}</p>
          <p><strong>Subjects of Interest:</strong> ${
            Object.entries(feedbackData.libraryFeedback?.subjectsOfInterest || {})
              .filter(([_, value]) => value)
              .map(([key, _]) => key.replace(/([A-Z])/g, ' $1').trim())
              .join(', ') || 'None specified'
          }</p>
        ` : ''}
      </div>
    `;

    // Write content to the print window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Feedback Form - ${feedbackData.customerProfile?.name || 'Customer'}</title>
          <style>
            @media print {
              body { margin: 0; padding: 20px; }
              table { page-break-inside: avoid; }
              h1, h2, h3, h4 { page-break-after: avoid; }
            }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    
    printWindow.document.close(); // Close the document to render the content

    // Delay the print action to ensure content is rendered
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250); // Increased delay for better rendering
  }
} 