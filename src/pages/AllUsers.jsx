import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import styled from "styled-components";
import { Button, Typography } from "@mui/material";

const Container = styled.div`
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const GridContainer = styled.div`
  height: 600px;
  width: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StyledButton = styled(Button)`
  && {
    background-color: #1976d2;
    color: white;
    &:hover {
      background-color: #115293;
    }
  }
`;

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(true);

  useEffect(() => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NDM5ZDczNWU4NTA4ZGNiNWMyMGU0ZiIsImVtYWlsIjoicGF1bHlzYW1hbmllZ29AZ21haWwuY29tIiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNzMyOTc5MDQ5LCJleHAiOjE3MzMwNjU0NDl9.K5yh_k2ZkG_vQUEvZagJf0ZZLxXchlfFzTl2omK9YvU";

    let config = {
      method: "get",
      url: "http://localhost:8080/users",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        const allUsers = response.data.data.map((user) => ({
          ...user,
          id: user._id,
        }));
        console.log(allUsers);
        setUsers(allUsers);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const deleteUser = (userId) => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NDM5ZDczNWU4NTA4ZGNiNWMyMGU0ZiIsImVtYWlsIjoicGF1bHlzYW1hbmllZ29AZ21haWwuY29tIiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNzMyOTc5MDQ5LCJleHAiOjE3MzMwNjU0NDl9.K5yh_k2ZkG_vQUEvZagJf0ZZLxXchlfFzTl2omK9YvU";

    axios
      .delete(`http://localhost:8080/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setUsers(users.filter((user) => user.id !== userId));
      })
      .catch((error) => {
        console.error("There was an error deleting the user!", error);
      });
  };
  const columns = [
    { field: "id", headerName: "Id", width: 150 },

    { field: "email", headerName: "Email", width: 200 },
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "lastName", headerName: "Last Name", width: 150 },
    { field: "birthDate", headerName: "Birth Date", width: 150 },
    { field: "flatsCreated", headerName: "Flats Created", width: 150 },
    {
      field: "isAdmin",
      headerName: "Role",
      width: 100,
      renderCell: (params) => (params.value ? "Admin" : "User"),
    },
    {
      field: "profile",
      headerName: "Profile",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => openUserProfile(params.row.id)}
        >
          View Profile
        </Button>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => deleteUser(params.row.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  if (!isAdmin) {
    return <Typography variant="h6">Access Denied</Typography>;
  }

  return (
    <Container>
      <Header>
        <Typography variant="h4" component="h1">
          Users Management
        </Typography>
      </Header>
      <GridContainer>
        <DataGrid
          rows={users}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection
          disableSelectionOnClick
        />
      </GridContainer>
    </Container>
  );
};

const openUserProfile = (userId) => {
  // Implementar la lógica para abrir el perfil del usuario
  console.log(`Open profile for user ${userId}`);
};

export default AllUsers;
