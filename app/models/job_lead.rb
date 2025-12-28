class JobLead < ApplicationRecord
  belongs_to :user

  validates :job_title, presence: true
  validates :company, presence: true
  validates :url, presence: true

  # Calculates match score using user-defined weights
  def calculate_match_score!(weights)
    score = 0

    checks.each do |key, value|
      next unless weights[key.to_s]   # Ensure the category exists
      score += weights[key.to_s].to_i if value == true
    end

    update!(match_score: score)
  end
end
