class CreateJobLeads < ActiveRecord::Migration[7.2]
  def change
    create_table :job_leads do |t|
      t.references :user, null: false, foreign_key: true

      # Basic job info
      t.string :job_title, null: false
      t.string :company, null: false
      t.string :url, null: false
      t.string :known_connections, array: true, default: []

      # Users check YES/NO for each category
      t.jsonb :checks, default: {
        salary: false,
        work_location: false,
        commute: false,
        must_have_skills: false,
        nice_to_have_skills: false,
        non_negotiables: false,
        role_must_include: false
      }

      # Final match score after applying weights
      t.integer :match_score, default: 0

      t.timestamps
    end
  end
end
