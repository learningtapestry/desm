import React from "react";
import { Link } from "react-router-dom";
import { CenteredRoundedCard } from "../dashboard/configuration-profiles/utils";
import TopNav from "../shared/TopNav";
import TopNavOptions from "../shared/TopNavOptions";

const MappingSwitcher = () => {
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

  return (
    <div className="wrapper">
      <TopNav centerContent={navCenterOptions} />
      <div className="container-fluid container-wrapper">
        <div className="row justify-content-center mt-5">
          <CenteredRoundedCard
            title="Please select an option"
            subtitle={
              <h2 className="text-center mb-5">
                Specify whether you have or not a schema file
              </h2>
            }
          >
            <Link
              to="/new-mapping/upload"
              className="btn btn-dark py-3 my-3 w-100"
            >
              <h3>I have a file to upload</h3>
            </Link>

            <Link
              to="/new-mapping/pick-schema"
              className="btn btn-dark py-3 my-3 w-100"
            >
              <h3>I will use a file from the configuration profile</h3>
            </Link>
          </CenteredRoundedCard>
        </div>
      </div>
    </div>
  );
};

export default MappingSwitcher;
