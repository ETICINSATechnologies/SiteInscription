import React, { useState, useEffect } from "react";
import "./inscription.css";
import { Button, Form, Container, Row, Col, Modal } from "react-bootstrap";
import *  as helpers from "./helpers";
import * as interfaces from "./interfaces";
import { Link } from "react-router-dom";

const logo_etic = require('../../resources/logo_etic.png');

declare global {
  interface Window {
    Stripe: any;
  }
}

const Inscription = (props: interfaces.InscriptionProps) => {
  const [inscriptionState, setInscriptionState] = useState(helpers.initiateInscriptionState(props.isConsultant));

  const [metaInfo, setMetaInfo] = useState(helpers.initiateMetaInfo());

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    refreshMetaInfo()
  }, []);

  const refreshMetaInfo = async () => {
    const metaInfo = await helpers.getData("/api/meta")
    if (metaInfo) {
      setMetaInfo({
        poles: metaInfo.pole ? metaInfo.pole : [],
        departments: metaInfo.department ? metaInfo.department : [],
        countries: metaInfo.country ? metaInfo.country : [],
        genders: metaInfo.gender ? helpers.filterGenders(metaInfo.gender) : [],
      });
    }
  }

  const handleChangeInput = (event: React.ChangeEvent) => {
    event.persist();
    let property: string = event.target.id;
    if (inscriptionState.person.hasOwnProperty(property)) {
      let value = (event.target as HTMLFormElement).value;
      setInscriptionState({
        ...inscriptionState,
        person: {
          ...inscriptionState.person,
          [property]: value
        }
      });
    }
  };

  const handleChangeCheckbox = (event: React.ChangeEvent) => {
    event.persist();
    const property: string = event.target.id;
    console.log(property)
    if (inscriptionState.person.hasOwnProperty(property)) {
      setInscriptionState((previous) => ({
        ...previous,
        person: {
          ...previous.person,
          [property]: !previous.person[property]
        }
      }))
    }
  }

  const handleChangeFile = (event: React.ChangeEvent) => {
    event.persist();
    let property: string = event.target.id;
    if (inscriptionState.person.hasOwnProperty(property)) {
      let value = (event.target as HTMLFormElement).value;
      setInscriptionState({
        ...inscriptionState,
        person: {
          ...inscriptionState.person,
          [property]: value
        }
      });
    }
  };

  const handleToggleModal = (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setShowModal((previous) => !previous);
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  const renderOptions = (objectArray: any[]) =>
    objectArray.map((option: any, index: any) => {
      return (
        <option key={index} value={option.id}>
          {option.name ? option.name : option.label}
        </option>
      );
    });

  const renderYears = () => {
    //make array
    let dt = new Date();
    let years: number[] = [dt.getFullYear()];
    for (let i = 1; i < 6; ++i) years.push(dt.getFullYear() + i);

    //make options
    let yearList = () =>
      years.map((option: number, index: any) => {
        return (
          <option key={index} value={option}>
            {option}
          </option>
        );
      });
    return yearList();
  };

  // form groups

  const firstName = (
    <Form.Group controlId="firstName">
      <Form.Label className="required">Prénom</Form.Label>
      <Form.Control
        className="firstName"
        type="text"
        required
        pattern="^[a-zA-Zàâçéèêëîïôûùüÿñæœ .-]*$"
        maxLength={20}
        onChange={handleChangeInput as any}
      />
    </Form.Group>
  )

  const lastName = (
    <Form.Group controlId="lastName">
      <Form.Label className="required">Nom de famille</Form.Label>
      <Form.Control
        className="lastName"
        type="text"
        required
        maxLength={20}
        pattern="^[a-zA-Zàâçéèêëîïôûùüÿñæœ .-]*$"
        onChange={handleChangeInput as any}
      />
    </Form.Group>
  )

  const birthday = (
    <Form.Group controlId="birthday">
      <Form.Label className="required">Date de naissance</Form.Label>
      <Form.Control
        className="birthday"
        type="date"
        required
        onChange={handleChangeInput as any}
      >
      </Form.Control>
    </Form.Group>
  )

  const email = (
    <Form.Group controlId="email">
      <Form.Label className="required">Adresse mail</Form.Label>
      <Form.Control
        className="email"
        type="text"
        required
        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
        onChange={handleChangeInput as any}
      />
    </Form.Group>
  )

  const genderId = (
    <Form.Group controlId="genderId">
      <Form.Label className="required">Genre</Form.Label>
      <Form.Control
        className="genderId"
        as="select"
        onChange={handleChangeInput as any}
        value={String(inscriptionState.person.genderId)}
      >
        {renderOptions(metaInfo.genders)};
      </Form.Control>
    </Form.Group>
  )

  const departmentId = (
    <Form.Group controlId="departmentId">
      <Form.Label className="required">Departement</Form.Label>
      <Form.Control
        className="departmentId"
        as="select"
        onChange={handleChangeInput as any}
      >
        {renderOptions(metaInfo.departments)};
                </Form.Control>
    </Form.Group>
  )

  const phoneNumber = (
    <Form.Group controlId="phoneNumber">
      <Form.Label>Téléphone portable</Form.Label>
      <Form.Control
        className="phoneNumber"
        type="tel"
        pattern="[0]{1}[0-9]{9}"
        onChange={handleChangeInput as any}
      />
    </Form.Group>
  )

  const outYear = (
    <Form.Group controlId="outYear">
      <Form.Label>Année de sortie</Form.Label>
      <Form.Control
        className="outYear"
        as="select"
        onChange={handleChangeInput as any}
      >
        {renderYears()}
      </Form.Control>
    </Form.Group>
  )

  const nationalityId = (
    <Form.Group controlId="nationalityId">
      <Form.Label className="required">Nationalité</Form.Label>
      <Form.Control
        className="nationalityId"
        as="select"
        onChange={handleChangeInput as any}
        value={String(inscriptionState.person.nationalityId)}
      >
        {props.isConsultant ? renderOptions(helpers.filterNationalities(metaInfo.countries, 4)) : renderOptions(metaInfo.countries)}
      </Form.Control>
    </Form.Group>
  )

  const line1 = (
    <Form.Group controlId="line1">
      <Form.Label className="required">Adresse postale</Form.Label>
      <Form.Control
        className="line1"
        onChange={handleChangeInput as any}
        required
      />
    </Form.Group>
  )

  const line2 = (
    <Form.Group controlId="line2">
      <Form.Label>
        Complément d'adresse
      </Form.Label>
      <Form.Control
        className="line2"
        onChange={handleChangeInput as any}
      />
    </Form.Group>
  )

  const city = (
    <Form.Group controlId="city">
      <Form.Label className="required">Ville</Form.Label>
      <Form.Control
        className="city"
        onChange={handleChangeInput as any}
        required
        pattern="^[a-zA-Zàâçéèêëîïôûùüÿñæœ .-]*$"
      />
    </Form.Group>
  )

  const postalCode = (
    <Form.Group controlId="postalCode">
      <Form.Label className="required">Code postal</Form.Label>
      <Form.Control
        className="postalCode"
        onChange={handleChangeInput as any}
        required
        pattern="[0-9]{5}"
      />
    </Form.Group>
  )

  const countryId = (
    <Form.Group controlId="countryId">
      <Form.Label className="required">Pays</Form.Label>
      <Form.Control
        className="countryId"
        as="select"
        onChange={handleChangeInput as any}
        value={String(inscriptionState.person.countryId)}
      >
        {renderOptions(metaInfo.countries)}
      </Form.Control>
    </Form.Group>
  )

  const isAlternant = (
    <Form.Group style={{ display: 'grid', gridTemplateColumns: '1fr 10fr' }} controlId="isAlternant">
      <Form.Check
        type={'checkbox'}
        onChange={handleChangeCheckbox as any} />
      <Form.Label>J’effectues ma formation en alternance</Form.Label>
    </Form.Group>
  )

  const document_identity = (
    <Form.Group controlId="document_identity">
      <Form.Label className="required">Pièce d'identité ou passeport</Form.Label>
      <Form.Control className='document_identity' onChange={handleChangeFile as any} type="file" required />
    </Form.Group>
  )

  const document_scolary_certificate = (
    <Form.Group controlId="document_scolarity_certificate">
      <Form.Label className="required">Certificat de scolarité (de l'année courante)</Form.Label>
      <Form.Control className='document_scolary_certificate' onChange={handleChangeFile as any} type="file" required />
    </Form.Group>
  )

  const document_vitale_card = (
    <Form.Group controlId="document_vitale_card">
      <Form.Label className="required">Carte Vitale</Form.Label>
      <Form.Control className='document_vitale_card' onChange={handleChangeFile as any} type="file" required />
    </Form.Group>
  )

  const document_rib = (
    <Form.Group controlId="document_rib">
      <Form.Label className="required">RIB</Form.Label>
      <Form.Control className='document_rib' onChange={handleChangeFile as any} type="file" required />
    </Form.Group>
  )

  const document_cvec = (
    <Form.Group controlId="document_cvec">
      <Form.Label className="required">CVEC (de l'année courante)</Form.Label>
      <Form.Control className='document_cvec' onChange={handleChangeFile as any} type="file" required />
    </Form.Group>
  )

  const document_residence_permit = (
    <Form.Group controlId="document_resident_permit">
      <Form.Label>
        Titre de séjour valide (si étudiant étranger)
      <br />
        <button className='btn-like-link' onClick={handleToggleModal}>Clique-ici pour plus d'information</button>
      </Form.Label>
      <Form.Control className='document_resident_permit' onChange={handleChangeFile as any} type="file" />
    </Form.Group>
  )

  const wantedPoleId = (
    <Form.Group controlId="wantedPoleId">
      <Form.Label className="required">Pôle</Form.Label>
      <Form.Control
        className="wantedPoleId"
        as="select"
        onChange={handleChangeInput as any}
        required
      >
        {renderOptions(metaInfo.poles)}
      </Form.Control>
    </Form.Group>
  )

  const ri = (
    <Form.Group style={{ display: 'grid', gridTemplateColumns: '1fr 10fr' }} controlId="ri">
      <Form.Check type={'checkbox'} required />
      <Form.Label className="required">
        J'ai bien pris connaissance du <a href={helpers.links.ri}> règlement intérieur </a> et des <a href={helpers.links.stt}> statuts d'ETIC</a>
      </Form.Label>
    </Form.Group>
  )

  const charte = (
    <Form.Group style={{ display: 'grid', gridTemplateColumns: '1fr 10fr' }} controlId="charte">
      <Form.Check type={'checkbox'} required />
      <Form.Label className="required">
        J'ai bien pris connaissance de la <a href={helpers.links.rse}> charte RSE </a> et de la <a href={helpers.links.cq}> charte qualité d'ETIC</a>
      </Form.Label>
    </Form.Group>
  )

  const donnees = (
    <Form.Group style={{ display: 'grid', gridTemplateColumns: '1fr 10fr' }} controlId="donnees">
      <Form.Check type={'checkbox'} required />
      <Form.Label className="required">
        J’accepte que mes données personnelles soient utilisées au sein d’ETIC dans le cadre de l’activité de l’association. ETIC et chacun de ses membres s’engagent à ne pas divulguer ces informations en dehors de l’activité de la Junior
    </Form.Label>
    </Form.Group>
  )

  const droitImage = (
    <Form.Group style={{ display: 'grid', gridTemplateColumns: '1fr 10fr' }} controlId="droitImage">
      <Form.Check
        className="droitImage"
        type={'checkbox'}
        onChange={handleChangeCheckbox as any} />
      <Form.Label>
        J’accepte d’apparaître sur des photos dans le cadre de l’activité de la Junior
    </Form.Label>
    </Form.Group>
  )

  const renderMember = () => {
    return (
      <Row>
        <Col md>
          {firstName} {lastName} {genderId} {birthday} {email} {departmentId} {phoneNumber}
          {outYear} {nationalityId} {line1}
        </Col>
        <Col md>
          {line2} {city} {postalCode} {countryId} {wantedPoleId}
          {ri} {charte} {donnees} {droitImage}
        </Col>
      </Row>
    )
  }

  const renderConsultant = () => {
    return (
      <Row>
        <Col md>
          {firstName} {lastName} {genderId} {birthday} {email} {departmentId} {phoneNumber}
          {outYear} {nationalityId} {line1} {line2} {city} {postalCode}
        </Col>
        <Col md>
          {countryId} {document_identity}
          {document_scolary_certificate} {document_vitale_card} {document_rib} {document_cvec}
          {document_residence_permit} {isAlternant}
          {ri} {charte} {donnees} {droitImage}
        </Col>
      </Row>
    )
  }


  return (
    <Container className="background-is-white padded-medium is-rounded has-vertical-margins-desktop">
      <Row className="has-margin-bottom">
        <Col><Link to="/"><Button>⬅ Retour à l'accueil</Button></Link></Col>
      </Row>
      <Row>
        <Col><h4 className="text-center">{props.isConsultant ? "Inscription Consultant" : "Inscription Membre Actif"}</h4></Col>
      </Row>
      <Form onSubmit={(event: React.FormEvent<Element>) => helpers.handleSubmit(event, inscriptionState.person, props.isConsultant)}>
        {props.isConsultant ? renderConsultant() : renderMember()}
        <Row className="text-center">
          <Col>
            <Button variant="primary" type="submit">
              {props.isConsultant ? "Valider et s'inscrire" : "Payer et s'inscrire"}
            </Button>
          </Col>
        </Row>
        {props.isConsultant ? null :
          <Row className="text-center has-margin-top">
            <Col className="important">
              Une cotisation de 4 euros est demandée à chaque nouvel adhérent pour finaliser son inscription. Cette cotisation permet de contribuer à la vie quotidienne de l’association.
            </Col>
          </Row>
        }

      </Form>

      <div id="logo_etic_container">
        <img src={logo_etic} id="logo_etic_big" className="pulse" alt="ETIC INSA"></img>
      </div>

      <Modal show={showModal} onHide={handleToggleModal} centered>
        <Modal.Body>
          <p>Types de documents acceptés :</p>
          <ul>
            <li>Un titre de séjour en cours de validité portant la mention « étudiant » </li>
            <li>Un visa long séjour en cours de validité du type VLS-TS portant la mention « étudiant » </li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleToggleModal}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>

    </Container >
  );
};

export default Inscription;
