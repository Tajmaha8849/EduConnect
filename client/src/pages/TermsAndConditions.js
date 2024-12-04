import React from 'react';
import './TermsAndConditions.css'

const TermsAndConditions = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '10%', textAlign: 'justify' }}>
      <h1 style={{ fontSize: '36px', color: '#333', fontWeight: '700', marginBottom: '20px' }}>
        Terms and Conditions
      </h1>
      {/* <p style={{fontSize:'36px',color: '#333', fontWeight: '700', marginBottom: '20px'}}>
        Terms And Conditions
        
      </p> */}
      <p>Welcome to EduConnect! By accessing or using our platform, you agree to comply with the
      following terms and conditions.</p>
      <h2>Use of Platform</h2>
      <p>
        The content on this platform is for educational purposes only. You must not misuse or harm
        the platform, its services, or its users.
      </p>
      <h2>Account Responsibility</h2>
      <p>
        You are responsible for maintaining the confidentiality of your account credentials. Any
        misuse of your account is your responsibility.
      </p>
      <h2>Amendments</h2>
      <p>
        We reserve the right to modify these terms at any time. Continued use of the platform after
        changes signifies your acceptance of the updated terms.
      </p>
      <h2>Contact Us</h2>
      <p>
        For any questions regarding these terms, please contact us at shubham.prajapati9297@gmail.com.
      </p>
    </div>
  );
};

export default TermsAndConditions;
