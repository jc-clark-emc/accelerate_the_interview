class AddArrayFieldsToCareerPreferences < ActiveRecord::Migration[7.2]
  def change
    add_column :career_preferences, :target_titles,       :string, array: true, default: []
    add_column :career_preferences, :must_have_skills,    :string, array: true, default: []
    add_column :career_preferences, :nice_to_have_skills, :string, array: true, default: []
    add_column :career_preferences, :non_negotiables,     :string, array: true, default: []
  end
end
