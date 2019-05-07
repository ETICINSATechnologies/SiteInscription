import React, { useState, useEffect } from "react";
import "./inscription.css";
import { defaultMember } from "../../model/Member";
import { defaultConsultant } from "../../model/Consultant";
import { Person } from "../../model/Person";
import { Card, Button, Form } from "react-bootstrap";
import { Department } from "../../model/Department";
import { Country } from "../../model/Country";
import { Pole } from "../../model/Pole";
import { Gender } from "../../model/Gender";

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
  genders: Gender[];
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
    countries: [],
    genders: []
  } as MetaInfo);

  useEffect(() => {
    let departmentsTemp: Department[];
    let polesTemp: Pole[];
    let countriesTemp: Country[];
    let gendersTemp: Gender[];

    getDepartments().then(data => {
      data ? departmentsTemp = data : null
      getCountries().then(data => {
        data ? countriesTemp = data : null
        getPoles().then(data => {
          data ? polesTemp = data : null
          getGenders().then(data => {
            data ? gendersTemp = data : null
            setMetaInfo({
              poles: polesTemp,
              departments: departmentsTemp,
              countries: countriesTemp,
              genders: gendersTemp
            });
          })
        });
      });
    });
  }, []);

  const getDepartments = async () => {
    let response = await fetch("/api/department");
    let data = await response.json();
    return data;
  };

  const getPoles = async () => {
    let response = await fetch("/api/pole");
    let data = await response.json();
    return data;
  };

  const getCountries = async () => {
    let response = await fetch("/api/country");
    let data = await response.json();
    return data;
  };

  const getGenders = async () => {
    let response = await fetch("/api/gender");
    let data = await response.json();
    return data;
  };


  const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        let form_data: FormData = state.person.getFormData(state.person);

        if (props.isConsultant) {
            fetch('api/consultant-inscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data'
                },

                body: form_data
            })
                .then(res => {
                    if (res.status === 200) {
                        console.log('success');
                    } else {
                        alert('Oh oh, vérifie tes informations');
                    }
                });
        } else {
            fetch('api/membre-inscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data'
                },

                body: form_data
            })
                .then(res => {
                    if (res.status === 200) {
                        console.log('success');
                        payment();
                    } else {
                        alert('Oh oh, vérifie tes informations');
                    }
                });
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
          alert("Uh oh, vérifie tes informations");
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

  const onChangeFile = (event: React.ChangeEvent) => {
    event.persist();

    //to do
  };

  const payment = () => {
    var stripe = window.Stripe("pk_test_O0FCm2559gZbRpWia2bR0yVm00Qc7SPLU0");
    stripe
      .redirectToCheckout({
        items: [{ sku: "sku_EuRlqkdKSw1RxK", quantity: 1 }],
        successUrl: "https://www.google.sc/",
        cancelUrl: "https://www.google.fr/"
      })
      .then(function (result: any) {
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer
        // using `result.error.message`.
      });
  };

  const makeOptions = (objectArray: any[]) =>
    objectArray.map((option: any, index: any) => {
      return (
        <option key={index} value={option.id}>
          {option.name ? option.name : option.label}
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

              <Form.Group controlId="genderId">
                <Form.Label>Genre*</Form.Label>
                <Form.Control
                  className="genderId"
                  as="select"
                  onChange={onChange as any}
                  required
                >
                  {makeOptions(metaInfo.genders)};
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="birthday">
                <Form.Label>Date de naissance*</Form.Label>
                <Form.Control
                  className="birthday"
                  type="date"
                  required
                  onChange={onChange as any}
                >
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="email">
                <Form.Label>Adresse mail*</Form.Label>
                <Form.Control
                  className="email"
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

              <Form.Group controlId="line1">
                <Form.Label>Adresse*</Form.Label>
                <Form.Control
                  className="line1"
                  onChange={onChange as any}
                  required
                  placeholder="13 Rue des Framboises"
                />
              </Form.Group>

              <Form.Group controlId="line2">
                <Form.Label>
                  Complément d'adresse
                </Form.Label>
                <Form.Control
                  className="line2"
                  onChange={onChange as any}
                />
              </Form.Group>

              <Form.Group controlId="city">
                <Form.Label>Ville*</Form.Label>
                <Form.Control
                  className="city"
                  onChange={onChange as any}
                  required
                  pattern="^[a-zA-Zàâçéèêëîïôûùüÿñæœ .-]*$"
                  placeholder="Villeurbanne"
                />
              </Form.Group>

              <Form.Group controlId="postalCode">
                <Form.Label>Code postal*</Form.Label>
                <Form.Control
                  className="postalCode"
                  onChange={onChange as any}
                  required
                  pattern="[0-9]{5}"
                  placeholder="69100"
                />
              </Form.Group>

              <Form.Group controlId="countryId">
                <Form.Label>Pays*</Form.Label>
                <Form.Control
                  className="countryId"
                  as="select"
                  onChange={onChange as any}
                  required
                >
                  {makeOptions(metaInfo.countries)}
                </Form.Control>
              </Form.Group>

              {props.isConsultant ? (
                // all consultant specific fields here
                <div className="consultantSpecific">
                  <Form.Group controlId="document_identity">
                    <Form.Label>Pièce d'identité*</Form.Label>
                    <Form.Control className='document_identity' onChange={onChangeFile as any} type="file" required />
                  </Form.Group>

                  <Form.Group controlId="document_scolary_certificate">
                    <Form.Label>Certificat de scolarité*</Form.Label>
                    <Form.Control className='document_scolary_certificate' onChange={onChangeFile as any} type="file" required />
                  </Form.Group>

                  <Form.Group controlId="document_vitale_card">
                    <Form.Label>Carte Vitale*</Form.Label>
                    <Form.Control className='document_vitale_card' onChange={onChangeFile as any} type="file" required />
                  </Form.Group>

                  <Form.Group controlId="document_rib">
                    <Form.Label>RIB*</Form.Label>
                    <Form.Control className='document_rib' onChange={onChangeFile as any} type="file" required />
                  </Form.Group>

                  <Form.Group controlId="document_resident_permit">
                    <Form.Label>
                      Titre de séjour valide (si étudiant étranger)
                    </Form.Label>
                    <Form.Control className='document_resident_permit' onChange={onChangeFile as any} type="file" />
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
