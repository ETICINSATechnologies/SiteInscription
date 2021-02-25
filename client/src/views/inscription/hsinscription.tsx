import React from "react";
import "./inscription.css";
import { Button, Container, Row, Col } from "react-bootstrap";
import * as interfaces from "./interfaces";
import { Link } from "react-router-dom";

const HubspotForm = require('react-hubspot-form');
const logo_etic = require('../../resources/logo_etic.png');

const HS_FORM_PORTAL_ID = '8632125';
const HS_FORM_ID = '33e55c05-3e1d-49be-95a6-21813123a85e';

declare global {
  interface Window {
    Stripe: any;
  }
}

const HSInscription = (props: interfaces.InscriptionProps) => {
  return (
    <Container className="background-is-white padded-medium is-rounded has-vertical-margins-desktop">
      <Row className="has-margin-bottom">
        <Col><Link to="/"><Button>⬅ Retour à l'accueil</Button></Link></Col>
      </Row>
      <Row>
        <Col><h4 className="text-center">{props.isConsultant ? "Inscription Consultant" : "Inscription Membre Actif"}</h4></Col>
      </Row>
      <HubspotForm
        portalId={HS_FORM_PORTAL_ID}
        formId={HS_FORM_ID}
        loading={<div>Chargement...</div>}
      />
      <div id="logo_etic_container">
        <img src={logo_etic} id="logo_etic_big" className="pulse" alt="ETIC INSA"></img>
      </div>
    </Container >
  );
};

export default HSInscription;
