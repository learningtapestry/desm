import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentConfigurationProfile,
  setEditCPErrors,
  setSavingCP,
} from "../../../../actions/configurationProfiles";
import updateCP from "../../../../services/updateCP";
import ConfirmDialog from "../../../shared/ConfirmDialog";
import noDataImg from "./../../../../../assets/images/no-data-found.png";

const Agents = () => {
  const currentCP = useSelector((state) => state.currentCP);
  const currentDSOIndex = useSelector((state) => state.currentDSOIndex);
  const getDsos = () => currentCP.structure.standardsOrganizations || [];
  const [agentsData, setAgentsData] = useState([]);
  const [currentAgentIndex, setCurrentAgentIndex] = useState(-1);
  const configurationProfile = useSelector((state) => state.currentCP);
  const [agentFullname, setAgentFullname] = useState("");
  const [agentEmail, setAgentEmail] = useState("");
  const [agentPhone, setAgentPhone] = useState("");
  const [githubHandle, setGithubHandle] = useState("");
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const confirmationMsg = `Please confirm if you really want to remove agent ${agentFullname}`;
  const dispatch = useDispatch();

  const addAgent = () => {
    let localCP = configurationProfile;
    setAgentsData([
      ...agentsData,
      {
        fullname: `Mapper N${agentsData.length + 1}`,
        email: "",
        phone: "",
        githubHandle: "",
      },
    ]);

    localCP.structure.standardsOrganizations[
      currentDSOIndex
    ].dsoAgents = agentsData;

    setCurrentAgentIndex(agentsData.length);
    dispatch(setCurrentConfigurationProfile(localCP));
  };

  const agentButtons = () => {
    return agentsData.map((agent, idx) => {
      return (
        <div className="col mr-3 mt-3" key={idx}>
          <div className="row cursor-pointer" style={{ minWidth: "100px" }}>
            <div
              className={`col-10 bg-dashboard-background ${
                currentAgentIndex === idx
                  ? "col-dashboard-highlight with-shadow"
                  : "col-background"
              } p-2 rounded text-center`}
              style={{
                maxWidth: "150px",
                opacity: "80%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxHeight: "32px",
              }}
              data-toggle="tooltip"
              data-placement="bottom"
              title="Click to view/edit this user's information"
              onClick={() => setCurrentAgentIndex(idx)}
            >
              {agent.fullname}
            </div>
            <div
              className="col-2 bg-dashboard-background col-background p-2 rounded text-center font-weight-bold"
              style={{
                maxWidth: "30px",
                position: "relative",
                right: "5px",
              }}
              data-toggle="tooltip"
              data-placement="bottom"
              title="Click to remove this user"
              onClick={() => {
                setCurrentAgentIndex(idx);
                setConfirmationVisible(true);
              }}
            >
              x
            </div>
          </div>
        </div>
      );
    });
  };

  const buildCpData = () => {
    let localCP = configurationProfile;
    localCP.structure.standardsOrganizations[currentDSOIndex].dsoAgents[
      currentAgentIndex
    ] = {
      fullname: agentFullname,
      email: agentEmail,
      phone: agentPhone,
      githubHandle: githubHandle,
    };

    return localCP;
  };

  const createAgent = () => {
    return (
      <div
        className="col bg-dashboard-background-highlight col-background p-2 rounded text-center mt-3 mr-4 font-weight-bold cursor-pointer"
        style={{ maxWidth: "50px" }}
        onClick={addAgent}
      >
        +
      </div>
    );
  };

  const handleBlur = () => {
    dispatch(setSavingCP(true));

    updateCP(configurationProfile.id, buildCpData()).then((response) => {
      if (response.error) {
        dispatch(setEditCPErrors(response.error));
        dispatch(setSavingCP(false));
        return;
      }

      dispatch(setCurrentConfigurationProfile(response.configurationProfile));
      dispatch(setSavingCP(false));
    });

    updateAgentsData();
  };

  const handleRemoveAgent = () => {
    setConfirmationVisible(false);
    let localCP = configurationProfile;
    localCP.structure.standardsOrganizations[currentDSOIndex].dsoAgents.splice(
      currentAgentIndex,
      1
    );
    setAgentsData(
      localCP.structure.standardsOrganizations[currentDSOIndex].dsoAgents
    );
    setCurrentAgentIndex(0);
    dispatch(setCurrentConfigurationProfile(localCP));
    save();
  };

  const noAgentsData = () => {
    return (
      <Fragment>
        <div className="d-flex align-items-center justify-content-center h-100 w-100">
          <img src={noDataImg} alt="No data found" />
        </div>
        <div className="d-flex align-items-center justify-content-center h-100 w-100">
          <p>
            This DSO does not have any agents yet. You can add an agent clicking
            on the "+" button
          </p>
        </div>
      </Fragment>
    );
  };

  const save = () => {
    dispatch(setSavingCP(true));

    updateCP(configurationProfile.id, configurationProfile).then((response) => {
      if (response.error) {
        dispatch(setEditCPErrors(response.error));
        dispatch(setSavingCP(false));
        return;
      }

      dispatch(setCurrentConfigurationProfile(response.configurationProfile));
      dispatch(setSavingCP(false));
    });
  };

  const selectedAgentInfo = () => {
    return (
      <div className="col">
        <div className="mt-5">
          <label>
            Agent Full Name
            <span className="text-danger">*</span>
          </label>
          <div className="input-group input-group">
            <input
              type="text"
              className="form-control input-lg"
              name="fullname"
              placeholder="The name of this agent"
              value={agentFullname || ""}
              onChange={(event) => {
                setAgentFullname(event.target.value);
              }}
              onBlur={handleBlur}
              autoFocus
            />
          </div>
        </div>

        <div className="mt-5">
          <label>
            Agent Email
            <span className="text-danger">*</span>
          </label>
          <div className="input-group input-group">
            <input
              type="text"
              className="form-control input-lg"
              name="agentEmail"
              placeholder="The email of this agent"
              value={agentEmail || ""}
              onChange={(event) => {
                setAgentEmail(event.target.value);
              }}
              onBlur={handleBlur}
            />
          </div>
        </div>

        <div className="mt-5">
          <label>Agent Phone</label>
          <div className="input-group input-group">
            <input
              type="tel"
              pattern="(-()[0-9]+)+$"
              className="form-control input-lg"
              name="agentPhone"
              placeholder="The phone of this agent"
              value={agentPhone || ""}
              onChange={(event) => {
                setAgentPhone(event.target.value);
              }}
              onBlur={handleBlur}
            />
          </div>
        </div>

        <div className="mt-5">
          <label>GitHub Handle</label>
          <div className="input-group input-group">
            <input
              type="text"
              className="form-control input-lg"
              name="githubHandle"
              placeholder="The github username of this agent"
              value={githubHandle || ""}
              onChange={(event) => {
                setGithubHandle(event.target.value);
              }}
              onBlur={handleBlur}
            />
          </div>
        </div>
      </div>
    );
  };

  const updateAgentsData = () => {
    let data = agentsData;
    data[currentAgentIndex] = {
      fullname: agentFullname,
      email: agentEmail,
      phone: agentPhone,
      githubHandle: githubHandle,
    };

    setAgentsData(data);
  };

  useEffect(() => {
    if (currentAgentIndex < 0) {
      return;
    }

    const agent = agentsData[currentAgentIndex];
    if (agent) {
      setAgentFullname(agent.fullname);
      setAgentEmail(agent.email);
      setAgentPhone(agent.phone);
      setGithubHandle(agent.githubHandle);
    }
  }, [currentAgentIndex, currentDSOIndex]);

  useEffect(() => {
    const { dsoAgents } = getDsos()[currentDSOIndex];
    setAgentsData(dsoAgents);
    setCurrentAgentIndex(dsoAgents.length ? 0 : -1);
  }, [currentDSOIndex]);

  return (
    <div className="col">
      {confirmationVisible && (
        <ConfirmDialog
          onRequestClose={() => setConfirmationVisible(false)}
          onConfirm={handleRemoveAgent}
          visible={confirmationVisible}
        >
          <h2 className="text-center">Attention!</h2>
          <h5 className="mt-3 text-center"> {confirmationMsg}</h5>
        </ConfirmDialog>
      )}
      <div className="row row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 mt-5 ml-3">
        {agentButtons()} {createAgent()}{" "}
      </div>
      <div className="row justify-content-center">
        {agentsData.length ? selectedAgentInfo() : noAgentsData()}
      </div>
    </div>
  );
};

export default Agents;