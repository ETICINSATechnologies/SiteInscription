import React, { useState, useEffect } from "react";
import "./inscription.css";
import { Member, defaultMember, MemberInterface } from "../../model/Member";
import {
  Consultant,
  defaultConsultant,
  ConsultantInterface
} from "../../model/Consultant";
import { Person } from "../../model/Person";
import { Card, Button, Form } from "react-bootstrap";
import { Department } from "../../model/Department";
import { Country } from "../../model/Country";
import { Pole } from "../../model/Pole";

declare global {
  interface Window {
    Stripe: any;
  }
}

interface InscriptionState {
  person: Person;
  showModal: boolean;
}

interface MetaInfo {
  departments: Department[];
  poles: Pole[];
  countries: Country[];
}

interface InscriptionProps {
  isConsultant: boolean;
}

const Inscription = (props: InscriptionProps) => {
  const [state, setState] = useState({
    person: props.isConsultant ? defaultConsultant : defaultMember,
    showModal: false
  } as InscriptionState);

  const [metaInfo, setMetaInfo] = useState({
    departments: [],
    poles: [],
    countries: []
  } as MetaInfo);

  useEffect(() => {
    let departmentsTemp: Department[];
    let polesTemp: Pole[];
    let countriesTemp: Country[];

    getDepartments().then(data => {
      departmentsTemp = data;
      getCountries().then(data => {
        countriesTemp = data;
        getPoles().then(data => {
          polesTemp = data;
          setMetaInfo({
            poles: polesTemp,
            departments: departmentsTemp,
            countries: countriesTemp
          });
        });
      });
    });
  }, []);

  const getDepartments = async () => {
    let response = await fetch("/api/departments");
    let data = await response.json();
    return data;
  };

  const getPoles = async () => {
    let response = await fetch("/api/poles");
    let data = await response.json();
    return data;
  };

  const getCountries = async () => {
    let response = await fetch("/api/countries");
    let data = await response.json();
    return data;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    let form_data: FormData = state.person.getFormData(state.person);

    if (props.isConsultant) {
      fetch("sg/consultant-inscription", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data"
        },

        body: form_data
      }).then(res => {
        if (res.status === 201) {
          console.log("success");
        } else {
          alert("Oh oh, vérifie tes informations");
        }
      });
    } else {
      fetch("sg/membre-inscription", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data"
        },

        body: form_data
      }).then(res => {
        if (res.status === 201) {
          console.log("success");
          payment();
        } else {
          alert("Oh oh, vérifie tes informations");
        }
      });
    }
  };

  const onChange = (event: React.ChangeEvent) => {
    event.persist();
    let property: string = event.target.className.split(" ")[0];
    let value = (event.target as HTMLFormElement).value;
    if (state.person.hasOwnProperty(property)) {
      setState({
        ...state,
        person: {
          ...state.person,
          [property]: value
        }
      });
    }
  };

  const onChangeNumbersOnly = (event: React.ChangeEvent) => {
    event.persist();
  };

  const payment = () => {
    var stripe = window.Stripe("pk_test_O0FCm2559gZbRpWia2bR0yVm00Qc7SPLU0");
    stripe
      .redirectToCheckout({
        items: [{ sku: "sku_EuRlqkdKSw1RxK", quantity: 1 }],
        successUrl: "https://www.google.sc/",
        cancelUrl: "https://www.google.fr/"
      })
      .then(function(result: any) {
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer
        // using `result.error.message`.
      });
  };

  const makeOptions = (objectArray: any[]) =>
    objectArray.map((option: any, index: any) => {
      return (
        <option key={index} value={option.id}>
          {option.label}
        </option>
      );
    });

  const makeYears = () => {
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
    <React.Fragment>
      <div
        className="container Inscription"
        style={{ backgroundColor: "#005360" }}
      >
        <Card
          className="card"
          style={{ width: "100%", maxWidth: "28rem", margin: "1rem auto" }}
        >
          <Card.Header style={{ textAlign: "center" }}>
            ETIC INSA Technologies
          </Card.Header>
          <Card.Body>
            <Card.Title style={{ textAlign: "center" }}>
              {props.isConsultant
                ? "Inscription Consultant"
                : "Inscription Membre"}
            </Card.Title>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="firstName">
                <Form.Label>Prénom*</Form.Label>
                <Form.Control
                  className="firstName"
                  type="text"
                  placeholder="Denys"
                  required
                  pattern="^[a-zA-Zàâçéèêëîïôûùüÿñæœ .-]*$"
                  maxLength={20}
                  onChange={onChange as any}
                />
              </Form.Group>
              <Form.Group controlId="lastName">
                <Form.Label>Nom de famille*</Form.Label>
                <Form.Control
                  className="lastName"
                  type="text"
                  placeholder="Chomel"
                  required
                  maxLength={20}
                  pattern="^[a-zA-Zàâçéèêëîïôûùüÿñæœ .-]*$"
                  onChange={onChange as any}
                />
              </Form.Group>

              <Form.Group controlId="mail">
                <Form.Label>Adresse mail*</Form.Label>
                <Form.Control
                  className="mail"
                  type="text"
                  placeholder="denys.chomel@insa-lyon.fr"
                  required
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                  onChange={onChange as any}
                />
              </Form.Group>

              <Form.Group controlId="departmentId">
                <Form.Label>Departement*</Form.Label>
                <Form.Control
                  className="departmentId"
                  as="select"
                  onChange={onChange as any}
                  required
                >
                  {makeOptions(metaInfo.departments)};
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="phoneNumber">
                <Form.Label>Téléphone</Form.Label>
                <Form.Control
                  className="phoneNumber"
                  type="tel"
                  placeholder="0612345678"
                  pattern="[0]{1}[0-9]{9}"
                  onChange={onChange as any}
                />
              </Form.Group>

              <Form.Group controlId="outYear">
                <Form.Label>Année de sortie</Form.Label>
                <Form.Control
                  className="outYear"
                  as="select"
                  onChange={onChange as any}
                >
                  {makeYears()}
                </Form.Control>
              </Form.Group>

              {props.isConsultant ? (
                // all consultant specific fields here
                <div className="consultantSpecific">
                  <Form.Group controlId="document_identity">
                    <Form.Label>Pièce d'identité*</Form.Label>
                    <Form.Control type="file" required />
                  </Form.Group>

                  <Form.Group controlId="document_scolary_certificate">
                    <Form.Label>Certificat de scolarité*</Form.Label>
                    <Form.Control type="file" required />
                  </Form.Group>

                  <Form.Group controlId="document_vitale_card">
                    <Form.Label>Carte Vitale*</Form.Label>
                    <Form.Control type="file" required />
                  </Form.Group>

                  <Form.Group controlId="document_rib">
                    <Form.Label>RIB*</Form.Label>
                    <Form.Control type="file" required />
                  </Form.Group>

                  <Form.Group controlId="document_resident_permit">
                    <Form.Label>
                      Titre de séjour valide (si étudiant étranger)
                    </Form.Label>
                    <Form.Control type="file" />
                  </Form.Group>
                </div>
              ) : (
                // all member specific fields here
                <div className="memberSpecific">
                  <Form.Group controlId="wantedPoleId">
                    <Form.Label>Pôle*</Form.Label>
                    <Form.Control
                      className="wantedPoleId"
                      as="select"
                      onChange={onChange as any}
                      required
                    >
                      {makeOptions(metaInfo.poles)}
                    </Form.Control>
                  </Form.Group>

                  <Form.Group controlId="nationalityId">
                    <Form.Label>Nationalité*</Form.Label>
                    <Form.Control
                      className="nationalityId"
                      as="select"
                      onChange={onChange as any}
                      required
                    >
                      {makeOptions(metaInfo.countries)}
                    </Form.Control>
                  </Form.Group>

                  <Form.Group controlId="address">
                    <Form.Label>Adresse*</Form.Label>
                    <Form.Control
                      className="line1"
                      onChange={onChange as any}
                      required
                      placeholder="13 Rue des Framboises"
                    />

                    <Form.Label>
                      Complément d'informations (facultatif)
                    </Form.Label>
                    <Form.Control
                      className="line2"
                      onChange={onChange as any}
                      placeholder="Appt 421"
                    />

                    <Form.Label>Ville*</Form.Label>
                    <Form.Control
                      className="city"
                      onChange={onChange as any}
                      required
                      pattern="^[a-zA-Zàâçéèêëîïôûùüÿñæœ .-]*$"
                      placeholder="Villeurbanne"
                    />

                    <Form.Label>Code postal*</Form.Label>
                    <Form.Control
                      className="city"
                      onChange={onChange as any}
                      required
                      pattern="[0-9]{5}"
                      placeholder="69100"
                    />

                    <Form.Label>Pays*</Form.Label>
                    <Form.Control
                      className="countryLabel"
                      as="select"
                      onChange={onChange as any}
                      required
                    >
                      {makeOptions(metaInfo.countries)}
                    </Form.Control>
                  </Form.Group>
                </div>
              )}

              <div className="text-center">
                <Button variant="primary" type="submit">
                  {props.isConsultant ? "Valider" : "Valider et Payer"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default Inscription;
