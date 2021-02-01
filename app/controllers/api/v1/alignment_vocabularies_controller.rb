# frozen_string_literal: true

###
# @description: Place all the actions related to vocabulariy mappings
###
class Api::V1::AlignmentVocabulariesController < ApplicationController
  ###
  # @description: Returns the vocabulary mapping for a specific alignment,
  #   with its concepts
  ###
  def show
    alignment = Alignment.find(params[:id])

    @vocabulary = alignment.vocabulary ||= AlignmentVocabulary.create!(
      alignment_id: alignment.id,
      title: "Vocabulary for #{alignment.uri}"
    )

    render json: @vocabulary, include: {concepts: {include: :mapped_concepts}}
  end
end
