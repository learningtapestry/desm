import React from "react";
import ProgressReportBar from "../shared/ProgressReportBar";
import Pluralize from "pluralize";

/**
 * Props
 * @param {String} organizationName
 * @param {Object} domain
 * @param {Array} selectedMappingTerms
 * @param {Boolean} hideMappedSelectedTerms
 * @param {Function} setHideMappedSelectedTerms
 * @param {Array} mappingSelectedTerms
 * @param {Array} mappedSelectedTerms
 * @param {String} mappingSelectedTermsInputValue
 * @param {Function} filterMappingSelectedTermsOnChange
 */
const MappingTermsHeaders = (props) => {
  const {
    organizationName,
    domain,
    selectedMappingTerms,
    hideMappedSelectedTerms,
    mappedSelectedTerms,
    mappingSelectedTerms,
    mappingSelectedTermsInputValue,
    filterMappingSelectedTermsOnChange,
    setHideMappedSelectedTerms,
  } = props;

  return (
    <div className="border-bottom desm-col-header">
      <div className="row">
        <div className="col-6">
          <p>
            <strong>{organizationName + " > "}</strong>
            {domain}
          </p>
        </div>
        <div className="col-6">
          <p className="float-right">
            <strong>{selectedMappingTerms.length}</strong>{" "}
            {Pluralize("property", selectedMappingTerms.length) + " selected"}
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-8">
          <div className="custom-control custom-checkbox mb-3">
            <input
              type="checkbox"
              className="custom-control-input desm-custom-control-input cursor-pointer"
              id="hideMappingElems"
              checked={hideMappedSelectedTerms}
              onChange={(e) =>
                setHideMappedSelectedTerms(!hideMappedSelectedTerms)
              }
            />
            <label className="custom-control-label cursor-pointer" htmlFor="hideMappingElems">
              Hide Mapped Elements
            </label>
          </div>
        </div>
        <div
          className="col-4"
          style={{
            position: "relative",
            bottom: "1rem",
          }}
        >
          <ProgressReportBar
            maxValue={mappingSelectedTerms.length}
            currentValue={mappedSelectedTerms.length}
            messageReport="Mapped"
            cssClass="bg-col-on-primary"
          />
        </div>
      </div>
      <div className="row">
        <div className="col form-group input-group-has-icon">
          <span className="fa fa-search form-control-feedback"></span>
          <input
            type="text"
            className="form-control"
            placeholder="Find Element / Property"
            value={mappingSelectedTermsInputValue}
            onChange={filterMappingSelectedTermsOnChange}
          />
        </div>
      </div>
    </div>
  );
};

export default MappingTermsHeaders;