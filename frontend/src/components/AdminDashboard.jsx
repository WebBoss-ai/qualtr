import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { USER_API_END_POINT } from '@/utils/constant';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard data on component mount
    const fetchDashboardData = async () => {
      try {
        const { data } = await axios.get(`${USER_API_END_POINT}/admin`);
        setDashboardData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!dashboardData || !dashboardData.success) {
    return <div>Error loading dashboard data.</div>;
  }

  const { stats, recentActivity, detailedStats } = dashboardData;

  return (
    
    <div className="container mt-4">
      <Helmet>
    <title>Admin Dashboard | Manage Qualtr Platform</title>
  </Helmet>
      <h1>Admin Dashboard</h1>

      {/* Stats Summary */}
      <Row>
        <Col>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Total Users</Card.Title>
              <Card.Text>{stats.totalUsers}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Total Companies</Card.Title>
              <Card.Text>{stats.totalCompanies}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Total Project Seekers</Card.Title>
              <Card.Text>{stats.totalJobSeekers}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Total Projects</Card.Title>
              <Card.Text>{stats.totalJobs}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Total Applications</Card.Title>
              <Card.Text>{stats.totalApplications}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Total Messages</Card.Title>
              <Card.Text>{stats.totalMessages}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activities */}
      <h2>Recent Activities</h2>
      <Row>
        <Col md={6}>
          <h3>Recent Users</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.recentUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.fullname}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{new Date(user.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>

        <Col md={6}>
          <h3>Recent Projects</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>Company</th>
                <th>Posted At</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.recentJobs.map((job) => (
                <tr key={job._id}>
                  <td>{job.title}</td>
                  <td>{job.company.name}</td>
                  <td>{new Date(job.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Detailed Stats */}
      <h2>Detailed Stats</h2>
      <Row>
        <Col md={6}>
          <h3>Top Projects by Applications</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Project Title</th>
                <th>Applications</th>
              </tr>
            </thead>
            <tbody>
              {detailedStats.topJobsByApplications.map((job) => (
                <tr key={job._id}>
                  <td>{job.title}</td>
                  <td>{job.applicationCount}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>

        <Col md={6}>
          <h3>Top Companies by Project Count</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Project Count</th>
              </tr>
            </thead>
            <tbody>
              {detailedStats.topCompaniesByJobCount.map((company) => (
                <tr key={company._id}>
                  <td>{company.name}</td>
                  <td>{company.jobCount}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
