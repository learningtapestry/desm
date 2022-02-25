# frozen_string_literal: true

require "rails_helper"

describe Domain, type: :model do
  it "has a valid factory" do
    expect(FactoryBot.build(:domain_set)).to be_valid
  end

  it { should validate_presence_of(:source_uri) }
  it { should validate_presence_of(:pref_label) }
end
