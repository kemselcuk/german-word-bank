import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Palette, Trash2 } from 'lucide-react';

const SettingsPage = () => {
  return (
    <Container>
      <header className="text-center mb-5">
        <h1 className="display-3 header-title">Settings</h1>
        <p className="header-subtitle">Customize your learning experience</p>
      </header>
      <Row className="justify-content-center">
        <Col md={8} lg={7}>
          {/* --- Theme Setting --- */}
          <div className="settings-row">
            <div className="settings-label">
              <Palette size={20} />
              <span>Theme</span>
            </div>
            <div className="settings-control">
              <Form.Select disabled>
                <option>Dark Red (Default)</option>
                <option>Cyber Blue (Coming Soon)</option>
                <option>Forest Green (Coming Soon)</option>
              </Form.Select>
            </div>
          </div>

          {/* --- Reset Progress Setting --- */}
          <div className="settings-row">
            <div className="settings-label">
              <Trash2 size={20} />
              <span>Reset Progress</span>
            </div>
            <div className="settings-control">
              <Button variant="outline-danger" disabled>
                Reset All Words & Progress
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SettingsPage;