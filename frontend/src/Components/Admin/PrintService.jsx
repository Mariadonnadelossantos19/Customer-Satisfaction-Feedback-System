export class PrintService {
  static printFeedbackForm(feedbackData) {
    const printWindow = window.open('', '_blank');

    // Construct the content for printing
    const content = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; border: 1px solid #000;">
        <!-- Header Section -->
        <table style="width: 100%; border-collapse: collapse; border-bottom: 1px solid #000;">
          <tr>
            <td style="width: 15%; border-right: 1px solid #000; padding: 5px; vertical-align: middle; text-align: center;">
              <img src="../../assets/dostbg.jpg" alt="DOST Logo" style="max-width: 60px; max-height: 60px;">
            </td>
            <td style="width: 55%; text-align: center; vertical-align: middle; padding: 5px;">
              <div style="font-weight: bold; font-size: 14px;">CUSTOMER SATISFACTION FEEDBACK FORM</div>
              <div style="font-size: 11px;">To be filled out by DOST-MIMAROPA staff</div>
              <div style="font-size: 11px;">Date of visit/encounter: ${new Date(feedbackData.dateOfVisit).toLocaleDateString()}</div>
            </td>
            <td style="width: 30%; border-left: 1px solid #000; padding: 5px; vertical-align: top;">
              <div style="border: 1px solid #000; padding: 3px; text-align: right; font-size: 10px; margin-bottom: 5px;">
                TO F1<br>
                Rev 1/04-25-16
              </div>
              <div style="font-size: 11px;">Attending Staff: ${feedbackData.attendingStaff || ''}</div>
            </td>
          </tr>
        </table>

        <!-- Services Section -->
        <table style="width: 100%; border-collapse: collapse; border-bottom: 1px solid #000;">
          <tr>
            <td colspan="2" style="font-weight: bold; font-size: 12px; padding: 3px 5px; border-bottom: 1px solid #000;">Services inquired on/availed:</td>
          </tr>
          <tr>
            <td style="width: 50%; vertical-align: top; padding: 0; border-right: 1px solid #000;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 3px; font-size: 11px; border-bottom: 1px solid #000;">
                    [ ${feedbackData.technoAssessment ? '✓' : ' '} ] Technology Need Assessment (TNA)
                  </td>
                </tr>
                <tr>
                  <td style="padding: 3px; font-size: 11px; border-bottom: 1px solid #000;">
                    [ ${feedbackData.technoTransfer?.enabled ? '✓' : ' '} ] Techno. Transfer & Commercialization (SETUP/GIA)
                  </td>
                </tr>
                <tr>
                  <td style="padding-left: 15px; font-size: 10px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr;">
                      <div>[ ${feedbackData.technoTransfer?.sectors?.foodProcessing ? '✓' : ' '} ] Food Processing</div>
                      <div>[ ${feedbackData.technoTransfer?.sectors?.metalsAndEngineering ? '✓' : ' '} ] Metals & Engineering</div>
                      <div>[ ${feedbackData.technoTransfer?.sectors?.giftsHousewaresDecors ? '✓' : ' '} ] Gifts/Housewares/ Decors</div>
                      <div>[ ${feedbackData.technoTransfer?.sectors?.healthAndPharma ? '✓' : ' '} ] Health and Pharma</div>
                      <div>[ ${feedbackData.technoTransfer?.sectors?.agriHorticulture ? '✓' : ' '} ] Agri./Horticulture</div>
                      <div>[ ${feedbackData.technoTransfer?.sectors?.ict ? '✓' : ' '} ] ICT</div>
                      <div>[ ${feedbackData.technoTransfer?.sectors?.aquacultureMarine ? '✓' : ' '} ] Aquaculture/Marine</div>
                      <div>[ ${feedbackData.technoTransfer?.othersSpecify ? '✓' : ' '} ] Others, pls. specify ${feedbackData.technoTransfer?.othersSpecify || ''}</div>
                      <div>[ ${feedbackData.technoTransfer?.sectors?.furniture ? '✓' : ' '} ] Furniture</div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 3px; font-size: 11px; border-top: 1px solid #000; border-bottom: 1px solid #000;">
                    [ ${feedbackData.technoConsultancy?.enabled ? '✓' : ' '} ] Techno. Consultancy
                  </td>
                </tr>
                <tr>
                  <td style="padding-left: 15px; font-size: 10px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr;">
                      <div>[ ${feedbackData.technoConsultancy?.services?.mpex ? '✓' : ' '} ] MPEX</div>
                      <div>[ ${feedbackData.technoConsultancy?.services?.energyAudit ? '✓' : ' '} ] Energy Audit</div>
                      <div>[ ${feedbackData.technoConsultancy?.services?.cape ? '✓' : ' '} ] CAPE</div>
                      <div>[ ${feedbackData.technoConsultancy?.othersSpecify ? '✓' : ' '} ] Others, pls. specify ${feedbackData.technoConsultancy?.othersSpecify || ''}</div>
                      <div>[ ${feedbackData.technoConsultancy?.services?.cpe ? '✓' : ' '} ] CPE</div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
            <td style="width: 50%; vertical-align: top; padding: 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 3px; font-size: 10px;">
                    <div style="display: grid; grid-template-columns: 1fr;">
                      <div>[ ${feedbackData.projectProposalPreparation ? '✓' : ' '} ] Project Proposal Preparation</div>
                      <div>[ ${feedbackData.packagingAndLabeling ? '✓' : ' '} ] Packaging and Labeling</div>
                      <div>[ ${feedbackData.technologyTraining ? '✓' : ' '} ] Technology Training</div>
                      <div>[ ${feedbackData.technologyTraining ? '✓' : ' '} ] Testing</div>
                      <div>[ ${feedbackData.scholarship ? '✓' : ' '} ] Scholarship</div>
                      <div>[ ${feedbackData.laboratory?.enabled ? '✓' : ' '} ] Laboratory (Metrology/Microbiology)</div>
                      <div>[ ${feedbackData.library?.enabled ? '✓' : ' '} ] Library/Information</div>
                      <div>[ ${feedbackData.others?.enabled ? '✓' : ' '} ] Others, pls. specify ${feedbackData.others?.specify || ''}</div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 3px; font-size: 10px; border-top: 1px solid #000;">
                    How did you know of our services? (i.e. friend, referral, TV, radio, newspaper, internet, fairs/forums, etc.)
                    <div style="font-size: 11px; margin-top: 3px;">${feedbackData.referralSource || ''}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Customer Instruction Section -->
        <table style="width: 100%; border-collapse: collapse; border-bottom: 1px solid #000;">
          <tr>
            <td style="padding: 5px; font-size: 10px; text-align: center; border-bottom: 1px dashed #000;">
              <strong>To be filled out by all customers</strong><br>
              To help us serve you better, please completely fill up this survey.
            </td>
          </tr>
        </table>

        <!-- Section 1: Customer's Profile -->
        <table style="width: 100%; border-collapse: collapse; border-bottom: 1px solid #000;">
          <tr>
            <td colspan="2" style="font-weight: bold; font-size: 11px; padding: 3px 5px; border-bottom: 1px solid #000;">
              SECTION 1: CUSTOMER'S PROFILE (FOR ALL CUSTOMERS)
            </td>
          </tr>
          <tr>
            <td style="width: 50%; vertical-align: top; padding: 0; border-right: 1px solid #000;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 3px; font-size: 10px; border-bottom: 1px solid #000;">
                    Name: <u>${feedbackData.customerProfile?.name || '___________________'}</u>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 3px; font-size: 10px; border-bottom: 1px solid #000;">
                    School/Company/Organization Name: <u>${feedbackData.customerProfile?.organizationName || '_______________'}</u>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 3px; font-size: 10px; border-bottom: 1px solid #000;">
                    Address (Brgy./Mun./Prov.): <u>${feedbackData.customerProfile?.address || '_______________'}</u>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 3px; font-size: 10px; border-bottom: 1px solid #000;">
                    Tel or Cel No./E-mail Add.: <u>${feedbackData.customerProfile?.contactInfo || '_______________'}</u>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 3px; font-size: 10px;">
                    Classification:<br>
                    <div style="display: grid; grid-template-columns: 1fr 1fr;">
                      <div>[ ${feedbackData.customerProfile?.classification === 'Student' ? '✓' : ' '} ] Student</div>
                      <div>[ ${feedbackData.customerProfile?.classification === 'Overseas Filipino Worker' ? '✓' : ' '} ] Overseas Filipino Worker</div>
                      <div>[ ${feedbackData.customerProfile?.classification === 'Owner of a business' ? '✓' : ' '} ] Owner of a business</div>
                      <div>[ ${feedbackData.customerProfile?.classification === 'Not employed' ? '✓' : ' '} ] Not employed</div>
                      <div>[ ${feedbackData.customerProfile?.classification === 'Employee of a business' ? '✓' : ' '} ] Employee of a business</div>
                      <div>[ ${feedbackData.customerProfile?.classification === 'Retired/displaced' ? '✓' : ' '} ] Retired/displaced</div>
                      <div>[ ${feedbackData.customerProfile?.classification === 'Government employee' ? '✓' : ' '} ] Government employee</div>
                      <div>[ ${feedbackData.customerProfile?.classification === 'Others' ? '✓' : ' '} ] Others, pls. specify ${feedbackData.customerProfile?.othersSpecify || ''}</div>
                      <div>[ ${feedbackData.customerProfile?.classification === 'Professional' ? '✓' : ' '} ] Professional, pls. specify ${feedbackData.customerProfile?.professionalSpecify || ''}</div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
            <td style="width: 50%; vertical-align: top; padding: 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 3px; font-size: 10px; border-bottom: 1px solid #000;">
                    First time to visit DOST? [ ${feedbackData.customerProfile?.isFirstVisit ? '✓' : ' '} ] Yes [ ${!feedbackData.customerProfile?.isFirstVisit ? '✓' : ' '} ] No
                  </td>
                </tr>
                <tr>
                  <td style="padding: 3px; font-size: 10px; border-bottom: 1px solid #000;">
                    Sex: [ ${feedbackData.customerProfile?.sex === 'Male' ? '✓' : ' '} ] Male [ ${feedbackData.customerProfile?.sex === 'Female' ? '✓' : ' '} ] Female
                  </td>
                </tr>
                <tr>
                  <td style="padding: 3px; font-size: 10px; border-bottom: 1px solid #000;">
                    Age Group:<br>
                    <div style="display: grid; grid-template-columns: 1fr 1fr;">
                      <div>[ ${feedbackData.customerProfile?.ageGroup === '15 & below' ? '✓' : ' '} ] 15 & below</div>
                      <div>[ ${feedbackData.customerProfile?.ageGroup === '41-50' ? '✓' : ' '} ] 41-50</div>
                      <div>[ ${feedbackData.customerProfile?.ageGroup === '16-20' ? '✓' : ' '} ] 16-20</div>
                      <div>[ ${feedbackData.customerProfile?.ageGroup === '51-59' ? '✓' : ' '} ] 51-59</div>
                      <div>[ ${feedbackData.customerProfile?.ageGroup === '21-30' ? '✓' : ' '} ] 21-30</div>
                      <div>[ ${feedbackData.customerProfile?.ageGroup === '60 & above' ? '✓' : ' '} ] 60 & above</div>
                      <div>[ ${feedbackData.customerProfile?.ageGroup === '31-40' ? '✓' : ' '} ] 31-40</div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 3px; font-size: 10px; border-bottom: 1px solid #000;">
                    Person with Disability? [ ${feedbackData.customerProfile?.isPWD ? '✓' : ' '} ] Yes [ ${!feedbackData.customerProfile?.isPWD ? '✓' : ' '} ] No
                  </td>
                </tr>
                <tr>
                  <td style="padding: 3px; font-size: 10px;">
                    Level of Education:<br>
                    <div style="display: grid; grid-template-columns: 1fr 1fr;">
                      <div>[ ${feedbackData.customerProfile?.educationLevel === 'Elementary' ? '✓' : ' '} ] Elementary</div>
                      <div>[ ${feedbackData.customerProfile?.educationLevel === 'Masters/PhD' ? '✓' : ' '} ] Masters/PhD</div>
                      <div>[ ${feedbackData.customerProfile?.educationLevel === 'High School' ? '✓' : ' '} ] High School</div>
                      <div>[ ${feedbackData.customerProfile?.educationLevel === 'Others' ? '✓' : ' '} ] Others, pls. specify ${feedbackData.customerProfile?.educationOthersSpecify || ''}</div>
                      <div>[ ${feedbackData.customerProfile?.educationLevel === 'College' ? '✓' : ' '} ] College</div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Section 2: Customer Evaluation/Feedback -->
        <table style="width: 100%; border-collapse: collapse; border-bottom: 1px solid #000;">
          <tr>
            <td colspan="6" style="font-weight: bold; font-size: 11px; padding: 3px 5px; border-bottom: 1px solid #000;">
              SECTION 2: CUSTOMER EVALUATION/FEEDBACK (FOR ALL CUSTOMERS)
            </td>
          </tr>
          <tr>
            <td colspan="6" style="font-size: 10px; padding: 3px 5px; border-bottom: 1px solid #000;">
              Please rate your level of satisfaction with the delivery of service:
            </td>
          </tr>
          <tr style="font-size: 9px; text-align: center; border-bottom: 1px solid #000;">
            <td style="width: 40%; padding: 3px 5px; text-align: left; border-right: 1px solid #000;">Drivers of satisfaction</td>
            <td style="width: 12%; padding: 3px 5px; border-right: 1px solid #000;">6-Outstanding</td>
            <td style="width: 12%; padding: 3px 5px; border-right: 1px solid #000;">5-Very Satisfied</td>
            <td style="width: 12%; padding: 3px 5px; border-right: 1px solid #000;">4-Satisfied</td>
            <td style="width: 12%; padding: 3px 5px; border-right: 1px solid #000;">3-Neutral</td>
            <td style="width: 12%; padding: 3px 5px; border-right: 1px solid #000;">2-Dissatisfied</td>
            <td style="width: 12%; padding: 3px 5px;">1-Very Dissatisfied</td>
          </tr>
          ${renderSatisfactionRow('Speed and timeliness', feedbackData.customerFeedback?.satisfaction?.speedAndTimeliness)}
          ${renderSatisfactionRow('Quality of service rendered', feedbackData.customerFeedback?.satisfaction?.qualityOfService)}
          ${renderSatisfactionRow('Relevance of service rendered', feedbackData.customerFeedback?.satisfaction?.relevanceOfService)}
          ${renderSatisfactionRow('Staff competence', feedbackData.customerFeedback?.satisfaction?.staffCompetence)}
          ${renderSatisfactionRow('Staff attitude', feedbackData.customerFeedback?.satisfaction?.staffAttitude)}
          ${renderSatisfactionRow('Overall perception of service rendered', feedbackData.customerFeedback?.satisfaction?.overallPerception)}
          <tr>
            <td colspan="6" style="font-size: 10px; padding: 5px; border-top: 1px solid #000;">
              How likely is it that you would recommend/endorse DOST's services to others?<br>
              <table style="width: 100%; border-collapse: collapse; margin-top: 5px;">
                <tr style="text-align: center; font-size: 9px;">
                  <td style="width: 8%; border: 1px solid #000; padding: 2px;">Not at all likely</td>
                  ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => 
                    `<td style="width: 8%; border: 1px solid #000; padding: 2px;">${val === Number(feedbackData.customerFeedback?.recommendationScore) ? '✓' : ''}</td>`
                  ).join('')}
                  <td style="width: 8%; border: 1px solid #000; padding: 2px;">Extremely likely</td>
                </tr>
                <tr style="text-align: center; font-size: 9px;">
                  <td style="border: 1px solid #000; padding: 2px;"></td>
                  ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => 
                    `<td style="border: 1px solid #000; padding: 2px;">${val}</td>`
                  ).join('')}
                  <td style="border: 1px solid #000; padding: 2px;"></td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td colspan="6" style="font-size: 10px; padding: 5px; border-top: 1px solid #000;">
              Please help us improve our services with your suggestions and/or comments below. Thank you! ☺<br>
              <div style="min-height: 40px; border: 1px solid #000; margin-top: 5px; padding: 3px; font-size: 9px;">${feedbackData.customerFeedback?.suggestions || ''}</div>
            </td>
          </tr>
        </table>

        <!-- Section 3: For Library Users Only -->
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td colspan="3" style="font-weight: bold; font-size: 11px; padding: 3px 5px; border-bottom: 1px solid #000;">
              SECTION 3: FOR LIBRARY USERS ONLY
            </td>
          </tr>
          <tr>
            <td colspan="3" style="font-size: 10px; padding: 3px 5px; border-bottom: 1px solid #000;">
              Were your queries answered? [ ${feedbackData.libraryFeedback?.queriesAnswered ? '✓' : ' '} ] Yes [ ${!feedbackData.libraryFeedback?.queriesAnswered ? '✓' : ' '} ] No
            </td>
          </tr>
          <tr>
            <td colspan="3" style="font-size: 10px; padding: 3px 5px; border-bottom: 1px solid #000;">
              Please specify subject of interest:
            </td>
          </tr>
          <tr>
            <td colspan="3" style="font-size: 10px; padding: 0 5px;">
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr;">
                <div>[ ${feedbackData.libraryFeedback?.subjectsOfInterest?.agriHorticulture ? '✓' : ' '} ] Agri./Horticulture</div>
                <div>[ ${feedbackData.libraryFeedback?.subjectsOfInterest?.giftsHousewareDecors ? '✓' : ' '} ] Gifts, Housewares, Decors</div>
                <div>[ ${feedbackData.libraryFeedback?.subjectsOfInterest?.ict ? '✓' : ' '} ] ICT</div>
                <div>[ ${feedbackData.libraryFeedback?.subjectsOfInterest?.aquacultureMarine ? '✓' : ' '} ] Aquaculture/Marine</div>
                <div>[ ${feedbackData.libraryFeedback?.subjectsOfInterest?.healthAndPharma ? '✓' : ' '} ] Health and Pharma</div>
                <div>[ ${feedbackData.libraryFeedback?.subjectsOfInterest?.metalsAndEngineering ? '✓' : ' '} ] Metals & Engineering</div>
                <div>[ ${feedbackData.libraryFeedback?.subjectsOfInterest?.furniture ? '✓' : ' '} ] Furniture</div>
                <div>[ ${feedbackData.libraryFeedback?.subjectsOfInterest?.foodProcessing ? '✓' : ' '} ] Food Processing</div>
                <div>[ ${feedbackData.libraryFeedback?.subjectsOfInterest?.others ? '✓' : ' '} ] Others, pls. specify ${feedbackData.libraryFeedback?.othersSpecify || ''}</div>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="3" style="font-size: 10px; padding: 3px 5px; border-top: 1px solid #000;">
              What is your main reason for using the library?
            </td>
          </tr>
          <tr>
            <td colspan="3" style="font-size: 10px; padding: 0 5px;">
              <div style="display: grid; grid-template-columns: 1fr 1fr;">
                <div>[ ${feedbackData.libraryFeedback?.reasonForVisit === 'support' ? '✓' : ' '} ] To support course of study/school requirement</div>
                <div>[ ${feedbackData.libraryFeedback?.reasonForVisit === 'research' ? '✓' : ' '} ] Independent learning/research</div>
                <div>[ ${feedbackData.libraryFeedback?.reasonForVisit === 'leisure' ? '✓' : ' '} ] Leisure/personal interest</div>
              </div>
            </td>
          </tr>
        </table>
      </div>
    `;

    function renderSatisfactionRow(label, value) {
      return `
        <tr style="font-size: 9px; text-align: center; border-bottom: 1px dotted #000;">
          <td style="padding: 3px 5px; text-align: left; border-right: 1px solid #000;">${label}................................</td>
          <td style="padding: 3px 5px; border-right: 1px solid #000;">[ ${Number(value) === 6 ? '✓' : ' '} ]</td>
          <td style="padding: 3px 5px; border-right: 1px solid #000;">[ ${Number(value) === 5 ? '✓' : ' '} ]</td>
          <td style="padding: 3px 5px; border-right: 1px solid #000;">[ ${Number(value) === 4 ? '✓' : ' '} ]</td>
          <td style="padding: 3px 5px; border-right: 1px solid #000;">[ ${Number(value) === 3 ? '✓' : ' '} ]</td>
          <td style="padding: 3px 5px; border-right: 1px solid #000;">[ ${Number(value) === 2 ? '✓' : ' '} ]</td>
          <td style="padding: 3px 5px;">[ ${Number(value) === 1 ? '✓' : ' '} ]</td>
        </tr>
      `;
    }

    // Write content to the print window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Feedback Form - ${feedbackData.customerProfile?.name || 'Customer'}</title>
          <style>
            @media print {
              body { margin: 0; padding: 0; }
              table { page-break-inside: avoid; }
            }
            body {
              font-family: Arial, sans-serif;
              font-size: 10px;
              line-height: 1.2;
              color: #000;
            }
            table, tr, td {
              border-collapse: collapse;
            }
            u { 
              display: inline-block;
              min-width: 100px;
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
    }, 500); // Increased delay for better rendering
  }
} 