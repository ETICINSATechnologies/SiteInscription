import React, { useState, useEffect } from "react";
import "./inscription.css";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import *  as helpers from "./helpers";
import * as interfaces from "./interfaces";

declare global {
  interface Window {
    Stripe: any;
  }
}

const Inscription = (props: interfaces.InscriptionProps) => {
  const [inscriptionState, setInscriptionState] = useState(helpers.initiateInscriptionState(props.isConsultant));

  const [metaInfo, setMetaInfo] = useState(helpers.initiateMetaInfo());

  useEffect(() => {
    refreshMetaInfo()
  }, []);

  const refreshMetaInfo = async () => {
    setMetaInfo({
      poles: await helpers.getData("/api/meta/pole"),
      departments: await helpers.getData("/api/meta/department"),
      countries: await helpers.getData("/api/meta/country"),
      genders: helpers.filterGenders(await helpers.getData("/api/meta/gender")),
    });
  }

  const handleChange = (event: React.ChangeEvent) => {
    event.persist();
    let property: string = event.target.className.split(" ")[0];
    let value = (event.target as HTMLFormElement).value;
    if (inscriptionState.person.hasOwnProperty(property)) {
      setInscriptionState({
        ...inscriptionState,
        person: {
          ...inscriptionState.person,
          [property]: value
        }
      });
    }
  };

  const handleChangeDroitImage = (event: React.ChangeEvent) => {
    event.persist();
    let property: string = 'droitImage';
    let value = !inscriptionState.person.droitImage;
    if (inscriptionState.person.hasOwnProperty(property)) {
      setInscriptionState({
        ...inscriptionState,
        person: {
          ...inscriptionState.person,
          [property]: value
        }
      });
    }
  }

  const handleChangeFile = (event: React.ChangeEvent) => {
    event.persist();
    let property: string = event.target.className.split(" ")[0];
    let value = (event.target as HTMLFormElement).value;
    if (inscriptionState.person.hasOwnProperty(property)) {
      setInscriptionState({
        ...inscriptionState,
        person: {
          ...inscriptionState.person,
          [property]: value
        }
      });
    }
  };

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

  return (
    <Container className="background-is-white padded-medium is-rounded">
      <Row>
        <Col><title className="text-center">{props.isConsultant ? "Inscription Consultant" : "Inscription Membre"}</title></Col>
      </Row>
      <Form onSubmit={(event: React.FormEvent<Element>) => helpers.handleSubmit(event, inscriptionState.person, props.isConsultant)}>
        <Row>
          <Col md>
            <Form.Group controlId="firstName">
              <Form.Label className="required">Prénom</Form.Label>
              <Form.Control
                className="firstName"
                type="text"
                required
                pattern="^[a-zA-Zàâçéèêëîïôûùüÿñæœ .-]*$"
                maxLength={20}
                onChange={handleChange as any}
              />
            </Form.Group>

            <Form.Group controlId="lastName">
              <Form.Label className="required">Nom de famille</Form.Label>
              <Form.Control
                className="lastName"
                type="text"
                required
                maxLength={20}
                pattern="^[a-zA-Zàâçéèêëîïôûùüÿñæœ .-]*$"
                onChange={handleChange as any}
              />
            </Form.Group>

            <Form.Group controlId="genderId">
              <Form.Label className="required">Genre</Form.Label>
              <Form.Control
                className="genderId"
                as="select"
                onChange={handleChange as any}
                value={String(inscriptionState.person.genderId)}
              >
                {renderOptions(metaInfo.genders)};
                </Form.Control>
            </Form.Group>

            <Form.Group controlId="birthday">
              <Form.Label className="required">Date de naissance</Form.Label>
              <Form.Control
                className="birthday"
                type="date"
                required
                onChange={handleChange as any}
              >
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label className="required">Adresse mail</Form.Label>
              <Form.Control
                className="email"
                type="text"
                required
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                onChange={handleChange as any}
              />
            </Form.Group>

            <Form.Group controlId="departmentId">
              <Form.Label className="required">Departement</Form.Label>
              <Form.Control
                className="departmentId"
                as="select"
                onChange={handleChange as any}
              >
                {renderOptions(metaInfo.departments)};
                </Form.Control>
            </Form.Group>

            <Form.Group controlId="phoneNumber">
              <Form.Label>Téléphone</Form.Label>
              <Form.Control
                className="phoneNumber"
                type="tel"
                pattern="[0]{1}[0-9]{9}"
                onChange={handleChange as any}
              />
            </Form.Group>

            <Form.Group controlId="outYear">
              <Form.Label>Année de sortie</Form.Label>
              <Form.Control
                className="outYear"
                as="select"
                onChange={handleChange as any}
              >
                {renderYears()}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="nationalityId">
              <Form.Label className="required">Nationalité</Form.Label>
              <Form.Control
                className="nationalityId"
                as="select"
                onChange={handleChange as any}
                value={String(inscriptionState.person.nationalityId)}
              >
                {props.isConsultant ? renderOptions(helpers.filterNationalities(metaInfo.countries, 4)) : renderOptions(metaInfo.countries)}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="line1">
              <Form.Label className="required">Adresse</Form.Label>
              <Form.Control
                className="line1"
                onChange={handleChange as any}
                required
              />
            </Form.Group>
          </Col>
          <Col md>

            <Form.Group controlId="line2">
              <Form.Label>
                Complément d'adresse
                </Form.Label>
              <Form.Control
                className="line2"
                onChange={handleChange as any}
              />
            </Form.Group>

            <Form.Group controlId="city">
              <Form.Label className="required">Ville</Form.Label>
              <Form.Control
                className="city"
                onChange={handleChange as any}
                required
                pattern="^[a-zA-Zàâçéèêëîïôûùüÿñæœ .-]*$"
              />
            </Form.Group>

            <Form.Group controlId="postalCode">
              <Form.Label className="required">Code postal</Form.Label>
              <Form.Control
                className="postalCode"
                onChange={handleChange as any}
                required
                pattern="[0-9]{5}"
              />
            </Form.Group>

            <Form.Group controlId="countryId">
              <Form.Label className="required">Pays</Form.Label>
              <Form.Control
                className="countryId"
                as="select"
                onChange={handleChange as any}
                value={String(inscriptionState.person.countryId)}
              >
                {renderOptions(metaInfo.countries)}
              </Form.Control>
            </Form.Group>

            {props.isConsultant ? (
              // all consultant specific fields here
              <React.Fragment>
                <Form.Group controlId="document_identity">
                  <Form.Label className="required">Pièce d'identité</Form.Label>
                  <Form.Control className='document_identity' onChange={handleChangeFile as any} type="file" required />
                </Form.Group>

                <Form.Group controlId="document_scolarity_certificate">
                  <Form.Label className="required">Certificat de scolarité</Form.Label>
                  <Form.Control className='document_scolary_certificate' onChange={handleChangeFile as any} type="file" required />
                </Form.Group>

                <Form.Group controlId="document_vitale_card">
                  <Form.Label className="required">Carte Vitale</Form.Label>
                  <Form.Control className='document_vitale_card' onChange={handleChangeFile as any} type="file" required />
                </Form.Group>

                <Form.Group controlId="document_rib">
                  <Form.Label className="required">RIB</Form.Label>
                  <Form.Control className='document_rib' onChange={handleChangeFile as any} type="file" required />
                </Form.Group>

                <Form.Group controlId="document_cvec">
                  <Form.Label className="required">CVEC</Form.Label>
                  <Form.Control className='document_cvec' onChange={handleChangeFile as any} type="file" required />
                </Form.Group>

                <Form.Group controlId="document_resident_permit">
                  <Form.Label>
                    Titre de séjour valide (si étudiant étranger)
                    </Form.Label>
                  <Form.Control className='document_resident_permit' onChange={handleChangeFile as any} type="file" />
                </Form.Group>
              </React.Fragment>
            ) : (
                // all member specific fields here
                <React.Fragment>
                  <Form.Group controlId="wantedPoleId">
                    <Form.Label className="required">Pôle</Form.Label>
                    <Form.Control
                      className="wantedPoleId"
                      as="select"
                      onChange={handleChange as any}
                      required
                    >
                      {renderOptions(metaInfo.poles)}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group style={{ display: 'grid', gridTemplateColumns: '1fr 10fr' }} controlId="charte">
                    <Form.Check
                      className="droitImage"
                      type={'checkbox'}
                      onChange={handleChangeDroitImage as any} />
                    <Form.Label>
                      Je déclare avoir lu les
                        <a href={helpers.links.di}> règlements par rapport au droit à l'image </a>
                    </Form.Label>
                  </Form.Group>
                </React.Fragment>
              )}
            <Form.Group style={{ display: 'grid', gridTemplateColumns: '1fr 10fr' }} controlId="charte">
              <Form.Check type={'checkbox'} required />
              <Form.Label className="required">
                Je déclare avoir lu et accepté le <a href={helpers.links.ri}> règlement intérieur </a> ainsi que <a href={helpers.links.rse}> la charte RSE </a>d' ETIC INSA Technologies.
              </Form.Label>
            </Form.Group>

            <div className="text-center">
              <Button variant="primary" type="submit">
                {props.isConsultant ? "Valider" : "Valider et Payer"}
              </Button>
            </div>
          </Col>
        </Row>
      </Form>


    </Container >
  );
};

export default Inscription;
