class CreatePlanDays < ActiveRecord::Migration[7.2]
  def change
    create_table :plan_days do |t|
      t.integer :day_number
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
