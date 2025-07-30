import { useState } from 'react';
import Profiledata from '../components/Profiledatafetch';
import '../App.css';
import { Card, Spinner, Container, Row, Col } from 'react-bootstrap';

function Profile() {
  const [userData, setUserData] = useState(null);

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="shadow p-4 rounded-4 border-0">
            <h3 className="mb-4 text-center text-primary">Käyttäjätiedot</h3>
            <Profiledata setUserData={setUserData} />

            {userData ? (
              <div>
                <p><strong>Nimi:</strong> {userData.displayName} {userData.surname}</p>
                <p><strong>puh.num:</strong> {userData.mobilePhone}</p>
                <p><strong>Sähköposti:</strong> {userData.mail || userData.userPrincipalName}</p>
              </div>
            ) : (
              <div className="d-flex justify-content-center align-items-center">
                <Spinner animation="border" role="status" />
                <span className="ms-2">Ladataan profiilia...</span>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;
