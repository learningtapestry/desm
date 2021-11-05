# frozen_string_literal: true

class Api::V1::ValidateConfigurationProfileController < ApplicationController
  def validate
    structure_param = JSON.parse(permitted_params[:structure]).to_h
    validation_result =  ConfigurationProfile.validate_structure(structure_param)

    render json: {
      validation: validation_result
    }
  end

  private

  def permitted_params
    params.require(:configuration_profile).permit(:structure)
  end
end
