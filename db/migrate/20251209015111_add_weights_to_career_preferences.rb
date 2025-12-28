class AddWeightsToCareerPreferences < ActiveRecord::Migration[7.2]
  def change
    add_column :career_preferences, :weights, :jsonb, default: {
      salary: 20,
      work_location: 15,
      commute: 10,
      must_have_skills: 25,
      nice_to_have_skills: 10,
      non_negotiables: 15,
      role_must_include: 5
    }
  end
end
