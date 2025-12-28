class PlanTask < ApplicationRecord
  belongs_to :plan_day
  serialize :inputs, JSON
end
