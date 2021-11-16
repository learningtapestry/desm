import React, { Fragment, useEffect, useState } from "react";
import { RemovableTab, TabGroup } from "../utils";
import ConceptSchemesWrapper from "./ConceptSchemesWrapper";
import SchemaFileMetadata from "./SchemaFileMetadata";

const SingleSchemaFileWrapper = (props) => {
  const [schemaFileIdx, setSchemaFileIdx] = useState(props.schemaFileIdx);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    setSchemaFileIdx(props.schemaFileIdx);
  }, [props.schemaFileIdx]);

  return (
    <Fragment>
      <div className="w-100">
        <SchemaFileTabs
          activeTab={activeTab}
          tabClickHandlerMD={() => {
            setActiveTab(0);
          }}
          tabClickHandlerCS={() => {
            setActiveTab(1);
          }}
        />
      </div>
      <div className="col">
        {activeTab === 0 ? (
          <div className="mt-5">
            <SchemaFileMetadata schemaFileIdx={schemaFileIdx} />
          </div>
        ) : (
          <div className="mt-5">
            <ConceptSchemesWrapper schemaFileIdx={schemaFileIdx} />
          </div>
        )}
      </div>
    </Fragment>
  );
};

const SchemaFileTabs = (props) => {
  const { activeTab, tabClickHandlerMD, tabClickHandlerCS } = props;

  return (
    <TabGroup cssClass={"ml-3 mr-3"} controlledSize={false}>
      <RemovableTab
        active={0 === activeTab}
        tabClickHandler={tabClickHandlerMD}
        title={"MetaData"}
        showCloseBtn={false}
      />
      <RemovableTab
        active={1 === activeTab}
        tabClickHandler={tabClickHandlerCS}
        title={"Concept Schemes"}
        showCloseBtn={false}
      />
    </TabGroup>
  );
};

export default SingleSchemaFileWrapper;
