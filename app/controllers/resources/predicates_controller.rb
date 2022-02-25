# frozen_string_literal: true

###
# @description: Return Json predicates by slug
###
class Resources::PredicatesController < ApplicationController
  def show
    predicate = Predicate.find_by_slug!(params[:slug])

    render json: predicate.to_json_ld
  end
end
