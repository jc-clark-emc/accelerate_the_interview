class CreateResumeProfiles < ActiveRecord::Migration[7.2]
  def change
    create_table :resume_profiles do |t|
      t.references :user, null: false, foreign_key: true

      # Headline + summary
      t.string :headline, null: false, default: ""
      t.text :summary_statement, null: false, default: ""

      # Contact info
      t.jsonb :contact_info, null: false, default: {
        full_name: "",
        email: "",
        phone: "",
        location: "",
        linkedin_url: "",
        portfolio_url: ""
      }

      # Most recent role context
      t.string  :company_name, null: false, default: ""
      t.string  :job_title, null: false, default: ""

      t.integer :start_month
      t.integer :start_year
      t.integer :end_month
      t.integer :end_year
      t.boolean :current_role, default: false

      # Exactly 3 bullets (what / how / resources / impact)
      t.jsonb :recent_role_bullets, null: false, default: []

      t.timestamps
    end

    add_index :resume_profiles, :user_id, unique: true
  end
end

