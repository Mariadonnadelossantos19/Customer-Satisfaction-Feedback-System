{/*
import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, Badge, IconButton } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../firebase-config';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Listen to feedback collection for real-time updates
    const feedbackRef = collection(db, 'feedback');
    const q = query(
      feedbackRef,
      where('isRead', '==', false),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newNotifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotifications(newNotifications);
      setUnreadCount(newNotifications.length);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ mr: 2 }}>
          Notifications
        </Typography>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </Box>

      {notifications.length === 0 ? (
        <Typography>No new notifications</Typography>
      ) : (
        notifications.map((notification) => (
          <Card key={notification.id} sx={{ mb: 2, p: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              New Feedback Received
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Customer: {notification.customerName}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {notification.feedback}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {notification.timestamp?.toDate().toLocaleString()}
            </Typography>
          </Card>
        ))
      )}
    </Box>
  );
};

export default Notifications; */}