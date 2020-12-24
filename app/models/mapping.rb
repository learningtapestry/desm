# frozen_string_literal: true

###
# @description: Represents a mapping, which is the concept of the merge
#   between 2 specifications.
#
#   It's created when the user uploads a specification for a domain which
#   already has a spine (a previous specification was uploaded for it).
###
class Mapping < ApplicationRecord
  ###
  # @description: This will allow to keep track of every change in this model thorugh
  #   the 'audits' method
  ###
  audited
  ###
  # @description: The user that this mapping belongs to
  ###
  belongs_to :user
  ###
  # @description: The specification that was uploaded to create this mapping
  ###
  belongs_to :specification, dependent: :destroy
  ###
  # @description: The specification chosen to map to
  ###
  belongs_to :spine, foreign_key: "spine_id", class_name: :Specification
  ###
  # @description: Each term that conforms the mapping. The terms of the mapping contains informatio
  #   about the type of alignment (predicate), which term from the spine was mapped to which of the
  #   original specification, and more.
  ###
  has_many :terms, class_name: :MappingTerm, dependent: :destroy
  ###
  # @description: The selected terms from the original uploaded specification. The user can select one
  #   ore more terms from it.
  ###
  has_and_belongs_to_many :selected_terms, join_table: :mapping_selected_terms, class_name: :Term
  ###
  # @description: Validates the presence of a name for the mapping
  ###
  validates :name, presence: true
  # The possible status of a mapping
  # 1. "uploaded" It means that there's a specification uploaded but not
  #    terms mapped
  # 2. "in-progress" It means that the user is already mapping terms but
  #    not yet finished mapping
  # 3. "mapped" It means the terms are confirmed as mapped to the spine
  enum status: {uploaded: 0, in_progress: 1, mapped: 2}

  ###
  # @description: The organization that originated this term
  # @return [String]
  ###
  def origin
    user.organization.name
  end

  ###
  # @description: The organization that originated this the spine
  # @return [String]
  ###
  def spine_origin
    spine.user.organization.name
  end

  ###
  # @description: The domain that this mapping is for. It's taken from the
  #   related specification
  # @return [String]
  ###
  def domain
    specification.domain.pref_label
  end

  ###
  # @description: Returns the number of terms that are already mapped
  # @return [Integer]
  ###
  def mapped_terms
    terms.select {|term| term.mapped_terms.count.positive? }.count
  end

  ###
  # @description: Associate the terms to this mapping. NOTE: This method will replace the previous
  #   associated terms, so if you need to add terms, maintaining the previous ones, include the
  #   previous ids in the params.
  #
  # @param [Array] ids: A collection of ids representing the terms that are
  #   going to be added as "selected" to this mapping
  ###
  def update_selected_terms ids
    self.selected_term_ids = ids
  end

  ###
  # @description: Notify the user about changes on the mapping
  ###
  def notify_updated
    involved_users.each {|user|
      MappingMailer.with(mapping: self, user: user).updated.deliver_later
    }
  end

  ###
  # @description: Get the users who worked in this mapping
  ###
  def involved_users
    User.where(id: terms.joins(:audits).select("audits.user_id"))
  end

  ###
  # @description: Include additional information about the mapping in
  #   json responses. This overrides the ApplicationRecord as_json method.
  ###
  def as_json(options={})
    super options.merge(methods: %i[uploaded? mapped? in_progress? origin spine_origin domain mapped_terms])
  end
end