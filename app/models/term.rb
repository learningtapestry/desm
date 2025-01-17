# frozen_string_literal: true

###
# @description: Represents a node of a specification
###
class Term < ApplicationRecord
  include Slugable

  ###
  # @description: At the time of creation, the organization would be the user's organization.
  #   When adding a synthetic term, the organization is received by param (would be the
  #   organization of the user that's adding the synthetic).
  ###
  belongs_to :organization

  ###
  # @description: The specifications in which this term appears. Can be many
  ###
  has_and_belongs_to_many :specifications

  ###
  # @description: The property for this term, an entity that contains all the rdf property information
  ###
  has_one :property, dependent: :destroy

  ###
  # @description: The skos concept scheme (vocabulary), for this term. It can be many, but in the most
  #   common situations, each term will have 0 or 1 vocabulary
  ###
  has_and_belongs_to_many :vocabularies

  validates :name, presence: true
  validates :raw, presence: true
  validates :slug, presence: true

  ###
  # @description: Accept to update and/or create properties along with terms
  ###
  accepts_nested_attributes_for :property, allow_destroy: true

  ###
  # @description: Include additional information about the specification in
  #   json responses. This overrides the ApplicationRecord as_json method.
  ###
  def as_json(options={})
    super options.merge(methods: %i[organization])
  end

  ###
  # @description: Build and return the uri with the "desm" prefix
  # @return [String]: the desm namespaced uri
  ###
  def desm_uri domain=nil
    "desm-#{organization.name.downcase.strip}-#{domain&.pref_label&.downcase&.strip}:#{uri.split(':').last}"
  end
end
