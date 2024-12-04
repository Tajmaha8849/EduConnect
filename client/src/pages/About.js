import React from 'react';
import './About.css'; // Optional: Create a separate CSS file for styling

const About = () => {
  return (
    <div className="about-container">
      <div className="about-section">
        <h1>About Me</h1>
        <p>
          Hello! I'm <strong>Shubham Prajapati</strong>, the creator of EduConnect. With a passion for education and technology, I've developed this platform to make learning more organized, accessible, and efficient. My goal is to empower students and educators by providing a comprehensive digital space for classrooms, resources, and collaborations.
        </p>
      </div>
      <div className="about-section">
        <h1>About EduConnect</h1>
        <p>
          EduConnect is an all-in-one platform designed to revolutionize the way students and educators interact. It provides a seamless space for students to explore and manage their classrooms, collaborate with peers, and access educational resources. Whether you're a student or an educator, EduConnect helps streamline your learning experience, making it easier to stay organized and stay connected.
        </p>
        <p>
          Our platform focuses on efficiency and fun, allowing users to interact with their learning environment through personalized dashboards, easy navigation, and helpful tools. Join us today and make learning a more engaging and organized experience!
        </p>
      </div>
    </div>
  );
};

export default About;
