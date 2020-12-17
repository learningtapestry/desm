# frozen_string_literal: true

class AddPasswordResetColumnsToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :reset_password_token, :string, unique: true
    add_column :users, :reset_password_sent_at, :datetime
  end
end
