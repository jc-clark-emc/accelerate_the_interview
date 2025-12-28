class User < ApplicationRecord
  authenticates_with_sorcery!

  has_one :career_preference, dependent: :destroy
  has_many :plan_days, dependent: :destroy
  has_many :job_leads, dependent: :destroy

  attr_accessor :password_confirmation
  validates :password, confirmation: true
  validates :email, presence: true, uniqueness: true

  after_create :create_plan_days
  after_create :create_default_career_preference

  # Create an empty preference record for all new users
  def create_default_career_preference
    CareerPreference.create!(
      user: self,
      target_titles: [],
      career_summary: ""
    )
  end


  def create_plan_days
    PLAN_TEMPLATE.each do |day_data|
      day = self.plan_days.create!(
        day_number: day_data[:day_number],
        title: day_data[:title]
      )

      day_data[:tasks].each do |task|
        day.plan_tasks.create!(
          title: task[:title],
          instructions: task[:instructions],
          example: task[:example],
          user_input: ""
        )
      end
    end
  end
end
