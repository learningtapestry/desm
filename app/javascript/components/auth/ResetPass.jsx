import React, { Component } from "react";
import TopNav from "../shared/TopNav";
import resetPassword from "../../services/resetPassword";
import AlertNotice from "../shared/AlertNotice";
import TopNavOptions from "../shared/TopNavOptions";
import { Link } from "react-router-dom";
import { toastr as toast } from "react-redux-toastr";
import queryString from "query-string";

class ResetPass extends Component {
  /**
   * Represents the state of this component.
   */
  state = {
    password: "",
    passwordConfirmation: "",
    token: "",
    errors: "",
    working: false,
  };

  /**
   * Controls the password and password confirmation matches
   */
  handlePasswordBlur = () => {
    const { password, passwordConfirmation } = this.state;

    if (
      !_.isEmpty(password) &&
      !_.isEmpty(passwordConfirmation) &&
      password != passwordConfirmation
    ) {
      this.setState({ errors: "Passwords doesn't match" });
      return;
    }

    this.setState({ errors: "" });
  };

  /**
   * Update the component state on every change in the input control in the form
   */
  handleOnChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  /**
   * Send the data prepared in the form to the API service, and expect
   * the result to be shown to the user
   */
  handleSubmit = (event) => {
    const { password, token } = this.state;

    event.preventDefault();

    this.setState({working: true});

    resetPassword(password, token).then((response) => {
      /// Manage the errors
      if (response.error) {
        this.setState({
          errors:
            response.error + "\n. We were not able to reset your password.",
            working: false,
        });
        return;
      }

      /// Reset the errors in state
      this.setState({
        errors: "",
        working: false,
      });

      /// Notify the user
      toast.success(
        "Your password was successfully updated! Please try signing in now."
      );

      /// Redirect the user to home
      this.props.history.push("/");
    });
  };

  /**
   * Configure the options to see at the center of the top navigation bar
   */
  navCenterOptions = () => {
    return <TopNavOptions viewMappings={true} mapSpecification={true} />;
  };

  componentDidMount() {
    /// Get the abstract class name from the query string URL parameters
    let token = queryString.parse(this.props.location.search).token;

    this.setState({ token: token });
  }

  render() {
    /**
     * Elements from state
     */
    const {
      errors,
      password,
      passwordConfirmation,
      token,
      working,
    } = this.state;

    return (
      <React.Fragment>
        <div className="wrapper">
          <TopNav centerContent={this.navCenterOptions} />
          <div className="container-fluid container-wrapper">
            <div className="row mt-5">
              <div className="col-lg-6 mx-auto">
                {errors && <AlertNotice message={errors} />}

                {_.isEmpty(token) ? (
                  <AlertNotice message={"No token provided"} />
                ) : (
                  <div className="card">
                    <div className="card-header">
                      <i className="fa fa-key"></i>
                      <span className="pl-2 subtitle">Reset your password</span>
                      <p>Please type a strong password below.</p>
                    </div>
                    <div className="card-body">
                      <form className="mb-3" onSubmit={this.handleSubmit}>
                        <div className="form-group">
                          <label>
                            New Password
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            autoFocus
                            className="form-control"
                            name="password"
                            onBlur={this.handlePasswordBlur}
                            onChange={this.handleOnChange}
                            placeholder="Please enter your password"
                            required
                            type="password"
                            value={password}
                          />
                        </div>

                        <div className="form-group">
                          <label>
                            Password Confirmation
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            name="passwordConfirmation"
                            onBlur={this.handlePasswordBlur}
                            onChange={this.handleOnChange}
                            placeholder="Please confirm your password"
                            required
                            type="password"
                            value={passwordConfirmation}
                          />
                        </div>

                        <button
                          type="submit"
                          className="btn btn-dark"
                          disabled={!_.isEmpty(errors)}
                        >
                          {working ? <Loader /> : "Reset Password" }
                        </button>
                      </form>
                      <Link className="col-primary" to={"/sign-in"}>
                        Login
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ResetPass;
