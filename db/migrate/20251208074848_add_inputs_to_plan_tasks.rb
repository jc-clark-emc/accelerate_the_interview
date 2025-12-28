class AddInputsToPlanTasks < ActiveRecord::Migration[7.2]
  def change
    add_column :plan_tasks, :inputs, :jsonb
  end
end
