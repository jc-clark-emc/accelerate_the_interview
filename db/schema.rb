# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2025_12_09_015111) do
  create_schema "neon_auth"

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "Account", id: :text, force: :cascade do |t|
    t.text "userId", null: false
    t.text "type", null: false
    t.text "provider", null: false
    t.text "providerAccountId", null: false
    t.text "refresh_token"
    t.text "access_token"
    t.integer "expires_at"
    t.text "token_type"
    t.text "scope"
    t.text "id_token"
    t.text "session_state"
    t.index ["provider", "providerAccountId"], name: "Account_provider_providerAccountId_key", unique: true
  end

  create_table "Blog", id: :serial, force: :cascade do |t|
    t.text "title", null: false
    t.text "metaTitle", null: false
    t.text "metaDescription", null: false
    t.text "urlKey", null: false
    t.text "content", null: false
    t.datetime "datePosted", precision: 3, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.index ["urlKey"], name: "Blog_urlKey_key", unique: true
  end

  create_table "ImportedJob", id: :serial, force: :cascade do |t|
    t.bigint "jobID", null: false
    t.datetime "createdAt", precision: 3, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.text "connectionName", null: false
    t.text "jobTitle", null: false
    t.index ["jobID"], name: "ImportedJob_jobID_key", unique: true
  end

  create_table "JobDisposition", id: :text, force: :cascade do |t|
    t.text "userId", null: false
    t.text "jobTitle", null: false
    t.text "company", null: false
    t.text "status", null: false
    t.datetime "updatedAt", precision: 3, null: false
    t.datetime "createdAt", precision: 3, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.text "jobID"
    t.boolean "isFavorited", default: false, null: false
    t.index ["userId", "jobTitle", "company"], name: "JobDisposition_userId_jobTitle_company_key", unique: true
  end

  create_table "NetworkingDisposition", id: :text, force: :cascade do |t|
    t.text "userId", null: false
    t.text "connectionName", null: false
    t.text "jobTitle", null: false
    t.text "company", null: false
    t.text "status", null: false
    t.datetime "createdAt", precision: 3, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "updatedAt", precision: 3, null: false
    t.text "imageSrc"
    t.text "profileURL"
    t.boolean "isFavorited", default: false, null: false
    t.index ["userId", "connectionName", "jobTitle", "company"], name: "NetworkingDisposition_userId_connectionName_jobTitle_compan_key", unique: true
  end

  create_table "ResumeDisposition", id: :text, force: :cascade do |t|
    t.text "userId", null: false
    t.text "title", null: false
    t.text "status", null: false
    t.datetime "createdAt", precision: 3, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "updatedAt", precision: 3, null: false
    t.index ["userId", "title"], name: "ResumeDisposition_userId_title_key", unique: true
  end

  create_table "ResumeUpload", id: :text, force: :cascade do |t|
    t.text "userId", null: false
    t.text "url", null: false
    t.datetime "uploadedAt", precision: 3, default: -> { "CURRENT_TIMESTAMP" }, null: false
  end

  create_table "Session", id: :text, force: :cascade do |t|
    t.text "sessionToken", null: false
    t.text "userId", null: false
    t.datetime "expires", precision: 3, null: false
    t.index ["sessionToken"], name: "Session_sessionToken_key", unique: true
  end

  create_table "User", id: :text, force: :cascade do |t|
    t.text "username"
    t.text "email"
    t.text "password"
    t.boolean "hasCompletedOnboarding", default: false, null: false
    t.text "jobTitles", array: true
    t.jsonb "onboardingData"
    t.datetime "onboardingCompletedAt", precision: 3
    t.text "firstName"
    t.text "lastName"
    t.text "linkedinUrl"
    t.text "phone"
    t.text "preferredName"
    t.index ["email"], name: "User_email_key", unique: true
    t.index ["username"], name: "User_username_key", unique: true
  end

  create_table "VerificationToken", id: false, force: :cascade do |t|
    t.text "identifier", null: false
    t.text "token", null: false
    t.datetime "expires", precision: 3, null: false
    t.index ["identifier", "token"], name: "VerificationToken_identifier_token_key", unique: true
    t.index ["token"], name: "VerificationToken_token_key", unique: true
  end

  create_table "_prisma_migrations", id: :string, force: :cascade do |t|
    t.string "checksum"
    t.datetime "finished_at"
    t.string "migration_name"
    t.text "logs"
    t.datetime "rolled_back_at"
    t.datetime "started_at"
    t.integer "applied_steps_count"
  end

  create_table "accounts", id: :text, force: :cascade do |t|
    t.text "user_id"
    t.text "type"
    t.text "provider"
    t.text "provider_account_id"
    t.text "refresh_token"
    t.text "access_token"
    t.integer "expires_at"
    t.text "token_type"
    t.text "scope"
    t.text "id_token"
    t.text "session_state"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["provider", "provider_account_id"], name: "index_accounts_on_provider_and_provider_account_id"
  end

  create_table "blacklisted_companies", force: :cascade do |t|
    t.string "name", null: false
    t.string "note"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index "lower((name)::text)", name: "index_blacklisted_companies_on_lower_name", unique: true
  end

  create_table "blogs", id: :serial, force: :cascade do |t|
    t.text "title"
    t.text "meta_title"
    t.text "meta_description"
    t.text "url_key"
    t.text "content"
    t.datetime "date_posted"
  end

  create_table "career_preferences", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.integer "target_salary_min"
    t.integer "target_salary_ideal"
    t.string "work_location_preference"
    t.integer "max_commute_minutes"
    t.text "role_must_include"
    t.text "career_summary"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "target_titles", default: [], array: true
    t.string "must_have_skills", default: [], array: true
    t.string "nice_to_have_skills", default: [], array: true
    t.string "non_negotiables", default: [], array: true
    t.jsonb "weights", default: {"salary"=>20, "commute"=>10, "work_location"=>15, "non_negotiables"=>15, "must_have_skills"=>25, "role_must_include"=>5, "nice_to_have_skills"=>10}
    t.index ["user_id"], name: "index_career_preferences_on_user_id"
  end

  create_table "freebie_people", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.string "phone_number"
    t.string "email", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index "lower((email)::text)", name: "index_freebie_people_on_lower_email", unique: true
  end

  create_table "imported_jobs", id: :serial, force: :cascade do |t|
    t.bigint "job_id"
    t.datetime "created_at"
    t.text "connection_name"
    t.text "job_title"
  end

  create_table "job_dispositions", id: :text, force: :cascade do |t|
    t.text "user_id"
    t.text "job_title"
    t.text "company"
    t.text "status"
    t.datetime "updated_at"
    t.datetime "created_at"
    t.text "job_id"
    t.boolean "is_favorited"
  end

  create_table "job_leads", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "job_title", null: false
    t.string "company", null: false
    t.string "url", null: false
    t.string "known_connections", default: [], array: true
    t.jsonb "checks", default: {"salary"=>false, "commute"=>false, "work_location"=>false, "non_negotiables"=>false, "must_have_skills"=>false, "role_must_include"=>false, "nice_to_have_skills"=>false}
    t.integer "match_score", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_job_leads_on_user_id"
  end

  create_table "networking_dispositions", id: :text, force: :cascade do |t|
    t.text "user_id"
    t.text "connection_name"
    t.text "job_title"
    t.text "company"
    t.text "status"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text "image_src"
    t.text "profile_url"
    t.boolean "is_favorited"
  end

  create_table "plan_days", force: :cascade do |t|
    t.integer "day_number"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_plan_days_on_user_id"
  end

  create_table "plan_tasks", force: :cascade do |t|
    t.bigint "plan_day_id", null: false
    t.string "title"
    t.text "instructions"
    t.text "example"
    t.text "user_input"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.jsonb "inputs"
    t.index ["plan_day_id"], name: "index_plan_tasks_on_plan_day_id"
  end

  create_table "resume_dispositions", id: :text, force: :cascade do |t|
    t.text "user_id"
    t.text "title"
    t.text "status"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "resume_uploads", id: :text, force: :cascade do |t|
    t.text "user_id"
    t.text "url"
    t.datetime "uploaded_at"
  end

  create_table "sessions", id: :text, force: :cascade do |t|
    t.text "session_token"
    t.text "user_id"
    t.datetime "expires"
    t.index ["session_token"], name: "index_sessions_on_session_token", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "email", null: false
    t.string "crypted_password"
    t.string "salt"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  create_table "verification_tokens", id: false, force: :cascade do |t|
    t.text "identifier"
    t.text "token"
    t.datetime "expires"
    t.index ["identifier", "token"], name: "index_verification_tokens_on_identifier_and_token", unique: true
  end

  add_foreign_key "Account", "User", column: "userId", name: "Account_userId_fkey", on_update: :cascade, on_delete: :cascade
  add_foreign_key "JobDisposition", "User", column: "userId", name: "JobDisposition_userId_fkey", on_update: :cascade, on_delete: :restrict
  add_foreign_key "NetworkingDisposition", "User", column: "userId", name: "NetworkingDisposition_userId_fkey", on_update: :cascade, on_delete: :restrict
  add_foreign_key "ResumeDisposition", "User", column: "userId", name: "ResumeDisposition_userId_fkey", on_update: :cascade, on_delete: :restrict
  add_foreign_key "ResumeUpload", "User", column: "userId", name: "ResumeUpload_userId_fkey", on_update: :cascade, on_delete: :restrict
  add_foreign_key "Session", "User", column: "userId", name: "Session_userId_fkey", on_update: :cascade, on_delete: :cascade
  add_foreign_key "career_preferences", "users"
  add_foreign_key "job_leads", "users"
  add_foreign_key "plan_days", "users"
  add_foreign_key "plan_tasks", "plan_days"
end
