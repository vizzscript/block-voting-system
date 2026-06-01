import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Avatar } from '@mui/material';
import api from '../../services/api';
import Loader from '../../components/Loader';
import SchoolIcon from '@mui/icons-material/School';

const ManageUsers = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await api.get('/users/students');
        setStudents(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to retrieve registered students.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <Box sx={{ color: '#F8FAFC' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: -0.5 }}>
        Manage Student Voters
      </Typography>
      <Typography variant="body1" sx={{ color: '#94A3B8', mb: 4 }}>
        Monitor registered student profiles and voting eligibility status
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          background: 'rgba(30, 41, 59, 0.25)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 4,
          boxShadow: 'none',
          overflow: 'hidden',
          '& .MuiTableCell-root': {
            borderColor: 'rgba(255, 255, 255, 0.05)',
            color: '#E2E8F0',
            py: 2.2
          }
        }}
      >
        <Table>
          <TableHead sx={{ background: 'rgba(255, 255, 255, 0.02)' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#38BDF8' }}>Student Voter</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#38BDF8' }}>Student ID</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#38BDF8' }}>Email Address</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#38BDF8' }}>Department</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#38BDF8' }}>Academic Year</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#38BDF8' }}>Security Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ color: '#64748B', py: 8 }}>
                  <SchoolIcon sx={{ fontSize: 48, mb: 1, color: '#475569' }} />
                  <Typography>No student voters registered in the system yet.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow
                  key={student.id}
                  sx={{
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.02)',
                    }
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 38,
                          height: 38,
                          background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
                          fontSize: '0.9rem',
                          fontWeight: 700
                        }}
                      >
                        {student.fullName.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography sx={{ fontWeight: 600 }}>{student.fullName}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#06B6D4' }}>{student.studentId}</TableCell>
                  <TableCell sx={{ color: '#94A3B8' }}>{student.email}</TableCell>
                  <TableCell>{student.department || 'N/A'}</TableCell>
                  <TableCell>{student.year || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip
                      label="Verified"
                      size="small"
                      sx={{
                        background: 'rgba(16, 185, 129, 0.12)',
                        color: '#10B981',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        fontWeight: 700,
                        borderRadius: 1
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Loader open={loading} />
    </Box>
  );
};

export default ManageUsers;
