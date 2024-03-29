import React, { useState, useEffect } from "react";
import moment from "moment";
import Signature from "../../components/Signature/Signature";
import CustomModal from "../../components/Modal/Modal";
import "./inscription.css";
import { Button, Form, Container, Row, Col, Modal, Spinner } from "react-bootstrap";
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

  const [showSignatureModal, setShowSignatureModal] = useState(false);

  const [isUploading, setIsUploading] = useState(false);

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
        countryMap: metaInfo.country ? helpers.makeCountryMap(metaInfo.country) : new Map()
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
  }

  const handleChangeInputDate = (event: React.ChangeEvent) => {
    event.persist();
    let property: string = event.target.id;
    if (inscriptionState.person.hasOwnProperty(property)) {
      let value = (event.target as HTMLFormElement).value;
      let momentDate = moment(value, "DD/MM/YYYY");
      if (momentDate.isValid()) {
        setInscriptionState({
          ...inscriptionState,
          person: {
            ...inscriptionState.person,
            [property]: momentDate.format("YYYY-MM-DD")
          }
        });
      }
    }
  }

  const handleChangeCheckbox = (event: React.ChangeEvent) => {
    event.persist();
    const property: string = event.target.id;
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
      let reader = new FileReader();
      let file = (event.target as HTMLFormElement).files[0];
      //if (helpers.checkFileExtension(file) && helpers.checkFileSize(file)) {
      if (helpers.checkFile(file)) {
        reader.onloadend = () => {
          setInscriptionState({
            ...inscriptionState,
            person: {
              ...inscriptionState.person,
              [property]: file
            }
          });
        }
        reader.readAsDataURL(file);
      } else {
        (event.target as HTMLFormElement).value = '';
      }
    }
  }

  const handleToggleModal = (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setShowModal((previous) => !previous);
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  const handleToggleSignatureModal = (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setShowSignatureModal((previous) => !previous);
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  const stopEvent = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.stopPropagation();
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
        placeholder="Hubert"
        maxLength={50}
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
        maxLength={50}
        placeholder="Bonisseur de la Bath"
        pattern="^[a-zA-Zàâçéèêëîïôûùüÿñæœ .-]*$"
        onChange={handleChangeInput as any}
      />
    </Form.Group>
  )

  const birthday = (
    <Form.Group controlId="birthday">
      <Form.Label className="required">Date de naissance (jj/mm/aaaa)</Form.Label>
      <Form.Control
        className="birthday"
        type="text"
        placeholder="jj/mm/aaaa"
        pattern="^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$"
        required
        onChange={handleChangeInputDate as any}
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
        placeholder="hubert.bonisseur@sdece.fr"
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
      <Form.Label className="required">Département</Form.Label>
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
      <Form.Label className="required" >Téléphone portable</Form.Label>
      <Form.Control
        className="phoneNumber"
        type="tel"
        pattern="[0]{1}[0-9]{9}"
        placeholder="0669361420"
        onChange={handleChangeInput as any}
        required
      />
    </Form.Group>
  )

  const outYear = (
    <Form.Group controlId="outYear">
      <Form.Label className="required">Année de sortie</Form.Label>
      <Form.Control
        className="outYear"
        as="select"
        onChange={handleChangeInput as any}
        required
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
        placeholder="20 Avenue Albert Einstein"
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
        placeholder="Résidence H"
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
        placeholder="Villeurbanne"
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
        placeholder="69100"
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

  const isApprentice = (
    <Form.Group style={{ display: 'grid', gridTemplateColumns: '1fr 10fr' }} controlId="isApprentice">
      <Form.Check
        type={'checkbox'}
        onChange={handleChangeCheckbox as any} />
      <Form.Label>J’effectue ma formation en alternance</Form.Label>
    </Form.Group>
  )

  const socialSecurityNumber = (
    <Form.Group controlId="socialSecurityNumber">
      <Form.Label className="required">
        Numéro de sécurité sociale
      </Form.Label>
      <Form.Control
        className="socialSecurityNumber"
        required
        pattern="[0-9]{15}"
        placeholder="294037512000522"
        onChange={handleChangeInput as any}
      />
    </Form.Group>
  )

  const documentIdentity = (
    <Form.Group controlId="documentIdentity">
      <Form.Label className="required">Pièce d'identité ou passeport - recto-verso</Form.Label>
      <Form.Control className='documentIdentity' onChange={handleChangeFile as any} type="file" required accept={helpers.acceptedExtensions} />
    </Form.Group>
  )

  const documentScolaryCertificate = (
    <Form.Group controlId="documentScolaryCertificate">
      <Form.Label className="required">Certificat de scolarité (de l'année courante)</Form.Label>
      <Form.Control className='documentScolaryCertificate' onChange={handleChangeFile as any} type="file" required accept={helpers.acceptedExtensions} />
    </Form.Group>
  )

  const documentVitaleCard = (
    <Form.Group controlId="documentVitaleCard">
      <Form.Label className="required">Carte Vitale - recto-verso</Form.Label>
      <Form.Control className='documentVitaleCard' onChange={handleChangeFile as any} type="file" required accept={helpers.acceptedExtensions} />
    </Form.Group>
  )

  const documentRIB = (
    <Form.Group controlId="documentRIB">
      <Form.Label className="required">RIB</Form.Label>
      <Form.Control className='documentRIB' onChange={handleChangeFile as any} type="file" required accept={helpers.acceptedExtensions} />
    </Form.Group>
  )

  const documentCVEC = (
    <Form.Group controlId="documentCVEC">
      <Form.Label className="required">CVEC (de l'année courante)</Form.Label>
      <Form.Control className='documentCVEC' onChange={handleChangeFile as any} type="file" required accept={helpers.acceptedExtensions} />
    </Form.Group>
  )

  const documentResidencePermit = (
    <Form.Group controlId="documentResidencePermit">
      <Form.Label className={helpers.isEU(Number(inscriptionState.person.nationalityId), metaInfo.countryMap) ? '' : 'required'}>
        Titre de séjour valide (si étudiant étranger) - recto-verso
      <br />
        <button className='btn-like-link' onClick={handleToggleModal}>Clique-ici pour plus d'information</button>
      </Form.Label>
      <Form.Control className='documentResidencePermit' onChange={handleChangeFile as any} type="file" accept={helpers.acceptedExtensions} required={!helpers.isEU(Number(inscriptionState.person.nationalityId), metaInfo.countryMap)} />
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
      <Form.Check type={'checkbox'} required>
        <Form.Check.Input required type={'checkbox'}></Form.Check.Input>
      </Form.Check>
      <Form.Label className="required">
        J'ai bien pris connaissance du <a href={helpers.links.ri} onClick={stopEvent}> règlement intérieur </a> et des <a href={helpers.links.stt} onClick={stopEvent}> statuts d'ETIC</a>
      </Form.Label>
    </Form.Group>
  )

  const charte = (
    <Form.Group style={{ display: 'grid', gridTemplateColumns: '1fr 10fr' }} controlId="charte">
      <Form.Check type={'checkbox'} required>
        <Form.Check.Input required type={'checkbox'}></Form.Check.Input>
      </Form.Check>
      <Form.Label className="required">
        J'ai bien pris connaissance de la <a href={helpers.links.rse} onClick={stopEvent}> charte RSE </a> et de la <a href={helpers.links.cq} onClick={stopEvent}> charte qualité d'ETIC</a>
      </Form.Label>
    </Form.Group>
  )

  const donnees = (
    <Form.Group style={{ display: 'grid', gridTemplateColumns: '1fr 10fr' }} controlId="donnees">
      <Form.Check type={'checkbox'} required>
        <Form.Check.Input required type={'checkbox'}></Form.Check.Input>
      </Form.Check>
      <Form.Label className="required">
        J’accepte que mes données personnelles soient utilisées au sein d’ETIC dans le cadre de l’activité de l’association. ETIC et chacun de ses membres s’engagent à ne pas divulguer ces informations en dehors de l’activité de la Junior
    </Form.Label>
    </Form.Group>
  )

  const droitImage = (
    <Form.Group style={{ display: 'grid', gridTemplateColumns: '1fr 10fr' }} controlId="droitImage">
      <Form.Check type={'checkbox'}>
        <Form.Check.Input type={'checkbox'} id={"droitImage"} onChange={handleChangeCheckbox as any}></Form.Check.Input>
      </Form.Check>
      <Form.Label>
        J’accepte d’apparaître sur des photos dans le cadre de l’activité de la Junior
    </Form.Label>
    </Form.Group>
  )

  const renderSubmit = () => {
    return (
      <React.Fragment>
        <div className="text-center">
          <Button variant="primary" type="submit">
            Valider et s'inscrire
          </Button>
        </div>
      </React.Fragment>

    )
  }

  const renderMakeSignature = () => {
    return (
      <React.Fragment>
        <div className="text-center">
          <Button onClick={() => { setShowSignatureModal(true) }}>
            {"Signer"}
          </Button>
        </div>
      </React.Fragment>

    )
  }

  const renderMember = () => {
    return (
      <React.Fragment>
        <Col md>
          {firstName} {lastName} {genderId} {birthday} {email} {departmentId} {phoneNumber}
          {outYear} {nationalityId} {line1} {line2}
        </Col>
        <Col md>
          {city} {postalCode} {countryId} {wantedPoleId}
          {ri} {charte} {donnees} {droitImage}
          {inscriptionState.person.signature ? renderSubmit() : renderMakeSignature()}
        </Col>
      </React.Fragment>
    )
  }

  const renderConsultant = () => {
    return (
      <React.Fragment>
        <Col md>
          {firstName} {lastName} {genderId} {birthday} {email} {departmentId} {phoneNumber}
          {outYear} {nationalityId} {line1} {line2} {city} {postalCode} {countryId}
        </Col>
        <Col md>
          {socialSecurityNumber} {documentIdentity}
          {documentScolaryCertificate} {documentVitaleCard} {documentRIB} {documentCVEC}
          {documentResidencePermit} {isApprentice}
          {ri} {charte} {donnees} {droitImage}
          {renderSubmit()}
        </Col>
      </React.Fragment>
    )
  }

  const renderUploadingSpinner = () => {
    if (isUploading) {
      return (
        <div id="uploading_container">
          <Spinner animation="border" variant="info" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
          <p>Traitement en cours</p>
          <p>Ceci peut prendre un peu de temps selon la taille de fichiers</p>
        </div>
      )
    }
    return null
  }

  const renderSignatureModal = () => {
    const handleValider = (trimmedDataURL: string) => {
      fetch(trimmedDataURL)
        .then(res => res.blob())
        .then(blob => {
          setInscriptionState({
            ...inscriptionState,
            person: {
              ...inscriptionState.person,
              signature: blob
            }
          })
        })
      handleToggleSignatureModal()
    }
    const signatureContainer = <Signature handleValider={handleValider} />
    return (
      <CustomModal children={signatureContainer} onClose={handleToggleSignatureModal} show={showSignatureModal} additionalClass={'signature_modal'} />
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
      <Form onSubmit={(event: React.FormEvent<Element>) => helpers.handleSubmit(event, inscriptionState.person, props.isConsultant, setIsUploading)}>
        <Row>
          {props.isConsultant ? renderConsultant() : renderMember()}
        </Row>
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

      {renderUploadingSpinner()}
      {renderSignatureModal()}
    </Container >
  );
};

export default Inscription;
