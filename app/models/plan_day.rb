class PlanDay < ApplicationRecord
  belongs_to :user
  has_many :plan_tasks, dependent: :destroy
end
