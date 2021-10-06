# frozen_string_literal: true

require "csv"

module Converters
  class CsvParseError; end

  # Converts a CEDS specification to the JSON-LD format
  class Ceds < Base
    ##
    # @param file [#path]
    def initialize(file)
      super

      rows = CSV.read(file.path, header_converters: :symbol, headers: true)

      rows.each do |row|
        next if row.to_h.values.all?(&:blank?)

        build_property(row)
      end
    end

    def self.read(_path)
      reader = CSV.read(file.path, header_converters: :symbol, headers: true)
      raise CsvParseError unless reader.valid?

      true
    end

    private

    ##
    # Builds an `skos:Concept` from a CEDS option.
    #
    # @param option [String]
    # @param scheme_id [String]
    # @param technical_name [String]
    # @return [Hash]
    def build_concept(option, scheme_id, technical_name)
      head, *tail = option.split(/-/)
      label = head.strip
      definition = tail.any? ? tail.join("-").strip : label

      concept = {
        "@id": build_desm_uri("#{technical_name}#{label}"),
        "@type": "skos:Concept",
        "skos:prefLabel": label,
        "skos:definition": {"en": definition},
        "skos:inScheme": scheme_id
      }

      resources << concept
      concept
    end

    ##
    # Builds an `skos:ConceptScheme` from a CEDS option set.
    #
    # @param row [CSV::Row]
    # @return [Hash, nil]
    def build_concept_scheme(row)
      options = (row[:option_set] || "").split("\n")
      return if options.size < 2

      element_name = row.fetch(:element_name)
      technical_name = row.fetch(:technical_name)
      scheme_id = build_desm_uri("#{technical_name}OptionSet")

      concept_ids = options.map do |option|
        build_concept(option, scheme_id, technical_name).fetch(:@id)
      end

      {
        "@id": scheme_id,
        "@type": "skos:ConceptScheme",
        "dct:title": "#{element_name} Option Set",
        "dct:description": "Option set for the CEDS element #{element_name}",
        "skos:hasTopConcept": concept_ids
      }
    end

    ##
    # Builds an `rdf:Class` from a CEDS entity.
    #
    # @param entity [String]
    # @return [Hash]
    def build_domain_class(entity)
      {
        "@id": build_desm_uri(entity.upcase_first),
        "@type": "rdf:Class",
        "rdfs:label": "CEDS #{entity}"
      }
    end

    ##
    # Builds an `rdf:Property` and related resources from a CEDS element.
    #
    # @param row [CSV::Row]
    # @return [Hash]
    def build_property(row)
      concept_scheme = fetch_concept_scheme(row)
      entity = row.fetch(:entity)
      global_id = row.fetch(:global_id)
      return unless global_id.present?

      property = {
        "@id": build_desm_uri("#{entity}_#{global_id}"),
        "@type": "rdf:Property",
        "rdfs:label": row.fetch(:element_name),
        "rdfs:comment": row[:definition],
        "desm:valueSpace": concept_scheme&.slice(:@id),
        "rdfs:domain": fetch_domain_class(entity).slice(:@id),
        "rdfs:range": concept_scheme ? "skos:Concept" : "rdfs:Literal",
        "rdfs:subPropertyOf": "https://ceds.ed.gov/element/#{global_id}"
      }

      resources << property
      property
    end
  end
end
