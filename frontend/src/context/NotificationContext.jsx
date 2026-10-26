import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      userId: 1,
      title: 'Congratulations! Shortlisted',
      message: 'You have been shortlisted for the Java Developer position at ABC Technologies.',
      type: 'SHORTLISTED',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
      jobTitle: 'Java Developer',
      companyName: 'ABC Technologies',
      applicationId: 101,
    },
    {
      id: 2,
      userId: 1,
      title: 'Application Under Review',
      message: 'Your application for Frontend Developer Intern at XYZ Technologies is now under review.',
      type: 'UNDER_REVIEW',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      jobTitle: 'Frontend Developer Intern',
      companyName: 'XYZ Technologies',
      applicationId: 102,
    },
    {
      id: 3,
      userId: 1,
      title: 'New Matching Job Opportunity',
      message: 'A new job "Full Stack Engineer" at CloudScale Inc. matches your Java & React skills.',
      type: 'JOB_MATCH',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      jobTitle: 'Full Stack Engineer',
      companyName: 'CloudScale Inc.',
      jobId: 3,
    },
  ]);

  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    try {
      const response = await api.get('/notifications');
      if (response.data && response.data.length > 0) {
        setNotifications(response.data);
      }
    } catch (err) {
      // offline fallback
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 15000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
    } catch (e) {
      // fallback
    }
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const addNotification = (notif) => {
    const newNotif = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      isRead: false,
      ...notif,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
        refreshNotifications: fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};
