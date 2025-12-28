class CreatePlanTasks < ActiveRecord::Migration[7.2]
  def change
    create_table :plan_tasks do |t|
      t.references :plan_day, null: false, foreign_key: true
      t.string :title
      t.text :instructions
      t.text :example
      t.text :user_input

      t.timestamps
    end
  end
end
