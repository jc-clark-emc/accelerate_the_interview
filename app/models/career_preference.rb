class CareerPreference < ApplicationRecord
  belongs_to :user

  validates :target_titles, presence: true, on: :update
  validates :career_summary, presence: true, on: :update

end