import React, { useEffect, useState } from "react";
import fetchSpecifications from "../../services/fecthSpecifications";
import fetchDomains from "../../services/fetchDomains";
import AlertNotice from "../shared/AlertNotice";
import TopNav from "../shared/TopNav";
import TopNavOptions from "../shared/TopNavOptions";

const MappingWithExistingSchema = () => {
  const [errors, setErrors] = useState([]);
  const [domains, setDomains] = useState([]);
  const [availableSchemas, setAvailableSchemas] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedSchema, setSelectedSchema] = useState(null);

  const anyError = (response) => {
    if (response.error) {
      setErrors([...errors, response.error]);
    } else {
      setErrors([]);
    }

    return !_.isUndefined(response.error);
  };

  const fetchData = () => {
    fetchDomains().then((response) => {
      if (!anyError(response)) {
        setDomains(response.domains);
      }
    });

    fetchSpecifications().then((response) => {
      if (!anyError(response)) {
        setAvailableSchemas(response.specifications);
      }
    });
  };

  const handleLooksGood = () => {
    let domain = domains.find((d) => d.id === parseInt(selectedDomain));

    if (domain.spine) {
      console.log("Create mapping");
    } else {
      console.log("Create spine");
    }
  };

  const navCenterOptions = () => {
    return (
      <TopNavOptions
        viewMappings={true}
        mapSpecification={true}
        stepper={true}
        stepperStep={1}
      />
    );
  };

  useEffect(() => {
    if (domains.length === 0) fetchData();
  }, []);

  return (
    <div className="wrapper">
      <TopNav centerContent={navCenterOptions} />
      <div className="container-fluid container-wrapper">
        {errors.length ? <AlertNotice message={errors} /> : ""}
        <div className="row">
          <MainMappingForm
            availableSchemas={availableSchemas}
            domains={domains}
            handleOnChangeSchema={(schemaId) => setSelectedSchema(schemaId)}
            handleOnChangeDomain={(domainId) => setSelectedDomain(domainId)}
            selectedSchema={selectedSchema}
          />
          <SchemaPreview
            handleLooksGood={handleLooksGood}
            formComplete={selectedSchema && selectedDomain}
          />
        </div>
      </div>
    </div>
  );
};

export default MappingWithExistingSchema;

const MainMappingForm = ({
  availableSchemas,
  domains,
  handleOnChangeSchema,
  handleOnChangeDomain,
  selectedSchema,
}) => {
  return (
    <div className="col-lg-6 p-lg-5 pt-5">
      <div className="mandatory-fields-notice">
        <small className="form-text text-muted">
          Fields with <span className="text-danger">*</span> are mandatory!
        </small>
      </div>
      <section>
        <div className="form-group">
          <label htmlFor="specification_name">Select the schema</label>
          <select
            name="schema"
            className="form-control"
            required
            value={selectedSchema || ""}
            onChange={(e) => handleOnChangeSchema(e.target.value)}
          >
            {availableSchemas.map(function (schema) {
              return (
                <option key={schema.id} value={schema.id}>
                  {schema.name}
                </option>
              );
            })}
          </select>
        </div>

        <div className="form-group">
          <label>
            Which domain are you uploading?
            <span className="text-danger">*</span>
          </label>

          <div className="desm-radio">
            {domains.map(function (dom) {
              return (
                <div
                  className={
                    "desm-radio-primary" + (dom.spine ? " has-spine" : "")
                  }
                  key={dom.id}
                >
                  <input
                    type="radio"
                    value={dom.id}
                    id={dom.id}
                    name="domain-options-form"
                    onChange={(e) => handleOnChangeDomain(e.target.value)}
                    required={true}
                  />
                  <label htmlFor={dom.id}>{dom.name}</label>
                </div>
              );
            })}
          </div>

          <small className="mt-3 mb-3 float-right">
            Domains in <span className="badge badge-success">green</span> has a
            spine already uploaded
          </small>
        </div>
      </section>
    </div>
  );
};

const SchemaPreview = ({ handleLooksGood, formComplete = false }) => {
  return (
    <div className="col-lg-6 p-lg-5 pt-5 bg-col-secondary">
      <div className="card mb-5">
        <div className="card-header">
          <div className="row">
            <div className="col-6 align-self-center">
              <strong>Preview the selected schema file</strong>
            </div>
            <div className="col-6 text-right">
              <button
                className="btn bg-col-primary col-background ml-2"
                onClick={handleLooksGood}
                disabled={!formComplete}
              >
                Looks Good
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>Here goes the file preview</div>
    </div>
  );
};
