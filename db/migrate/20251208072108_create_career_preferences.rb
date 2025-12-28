class CreateCareerPreferences < ActiveRecord::Migration[7.2]
  def change
    create_table :career_preferences do |t|
      t.references :user, null: false, foreign_key: true

      t.integer :target_salary_min
      t.integer :target_salary_ideal
      t.string  :work_location_preference
      t.integer :max_commute_minutes

      # ARRAY FIELDS
      t.string :target_titles,       array: true, default: []
      t.string :must_have_skills,    array: true, default: []
      t.string :nice_to_have_skills, array: true, default: []
      t.string :non_negotiables,     array: true, default: []

      t.text :role_must_include
      t.text :career_summary

      t.timestamps
    end
  end
end
