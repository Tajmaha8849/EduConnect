import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import './ProfilePage.css';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // State for classrooms
    const [showPopup, setShowPopup] = useState(false);
    const [classroomName, setClassroomName] = useState('');
    const [description, setDescription] = useState('');
    const [classroomsCreatedByMe, setClassroomsCreatedByMe] = useState([]);
    const [classroomsJoinedByMe, setClassroomsJoinedByMe] = useState([]);

    const navigate = useNavigate();

    // Fetch User Info
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/getuser`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();

                if (response.ok) {
                    setUser(data.data);
                } else {
                    toast.error(data.message || 'Failed to fetch user data');
                }
            } catch (error) {
                toast.error('An error occurred while fetching user data');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    // Fetch Classrooms Created by Teacher
    const fetchClassrooms = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/class/classroomscreatedbyme`, {
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();

            if (response.ok) {
                setClassroomsCreatedByMe(data.data);
            } else {
                toast.error(data.message || 'Failed to fetch classrooms');
            }
        } catch (error) {
            toast.error('An error occurred while fetching classrooms');
        }
    };

    // Fetch Classrooms Joined by Student
    const fetchClassroomsJoinedByMe = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/class/classroomsforstudent`, {
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();

            if (response.ok) {
                setClassroomsJoinedByMe(data.data);
            } else {
                //toast.error(data.message || 'Failed to fetch joined classrooms');
            }
        } catch (error) {
            toast.error('An error occurred while fetching joined classrooms');
        }
    };

    // Fetch classrooms data when user info is available
    useEffect(() => {
        if (user) {
            fetchClassrooms();
            fetchClassroomsJoinedByMe();
        }
    }, [user]);

    // Create a new classroom
    const handleCreateClassroom = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/class/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: classroomName,
                    description,
                }),
                credentials: 'include',
            });
            const data = await response.json();

            if (response.ok) {
                toast.success('Classroom created successfully');
                setClassroomName('');
                setDescription('');
                setShowPopup(false);
                fetchClassrooms();
            } else {
                toast.error(data.message || 'Failed to create classroom');
            }
        } catch (error) {
            toast.error('An error occurred while creating the classroom');
        }
    };

    // Navigate to classroom details
    const handleRowClick = (classroomId) => {
        navigate(`/classes/${classroomId}`);
    };

    return (
        <div className="profile-page">
            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <>
                    {/* Profile Section */}
                    <section className="profile-section">
                        <h1>Profile</h1>
                        <div className="profile-info">
                            <img
                                src={user?.avatar || 'teacher.jpg'}
                                alt="Profile"
                                className="profile-picture"
                            />
                            <div className="profile-details">
                                <h2>{user?.name}</h2>
                                <p>Email: {user?.email}</p>
                                <p>Role: {user?.role}</p>
                                {user?.role === 'teacher' && (
                                    <button className="create-classroom-btn" onClick={() => setShowPopup(true)}>
                                        Create Classroom
                                    </button>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Classroom Section */}
                    <section className="classroom-section">
                        {/* Popup for Creating a Classroom */}
                        {showPopup && (
                            <div className="popup-overlay">
                                <div className="popup-content">
                                    <h3>Create Classroom</h3>
                                    <input
                                        type="text"
                                        placeholder="Classroom Name"
                                        value={classroomName}
                                        onChange={(e) => setClassroomName(e.target.value)}
                                    />
                                    <textarea
                                        placeholder="Description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                    <div className="popup-buttons">
                                        <button onClick={handleCreateClassroom}>Submit</button>
                                        <button onClick={() => setShowPopup(false)}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Classrooms Created by Me */}
                        {user?.role === 'teacher' && (
                            <div className="classroom-list">
                                <h3>Classrooms Created by Me</h3>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {classroomsCreatedByMe.map((classroom) => (
                                            <tr
                                                key={classroom._id}
                                                onClick={() => handleRowClick(classroom._id)}
                                                className="clickable-row"
                                            >
                                                <td>{classroom.name}</td>
                                                <td>{classroom.description}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Classrooms Joined by Me */}
                        <div className="classroom-list">
                            <h3>Classrooms Joined by Me</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {classroomsJoinedByMe.map((classroom) => (
                                        <tr
                                            key={classroom._id}
                                            onClick={() => handleRowClick(classroom._id)}
                                            className="clickable-row"
                                        >
                                            <td>{classroom.name}</td>
                                            <td>{classroom.description}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </>
            )}
        </div>
    );
};

export default ProfilePage;
