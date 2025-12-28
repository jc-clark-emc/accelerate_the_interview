class TaskMapperService
  def initialize(user)
    @user = user
  end

  def submit_day(day_number, responses)
    case day_number.to_i
    when 1
      process_day_one(responses)
    when 2
      process_day_two(responses)
    else
      raise "Unsupported day: #{day_number}"
    end
  end

  private

  # -----------------------------
  # DAY 1 PROCESSOR
  # -----------------------------
  def process_day_one(responses)
    pref = @user.career_preference || @user.build_career_preference

    pref.assign_attributes(
      target_titles:            responses["target_titles"] || [],
      target_salary_min:        responses.dig("salary", "min"),
      target_salary_ideal:      responses.dig("salary", "ideal"),
      work_location_preference: responses["work_location"],
      max_commute_minutes:      responses["max_commute"],
      must_have_skills:         responses["must_have_skills"] || [],
      nice_to_have_skills:      responses["nice_to_have_skills"] || [],
      non_negotiables:          responses["non_negotiables"] || [],
      role_must_include:        responses["role_must_include"],
      career_summary:           responses["career_summary"]
    )

    pref.save!
    { status: :success, day: 1, career_preference: pref }
  end

  # -----------------------------
  # DAY 2 PROCESSOR
  # -----------------------------
  def process_day_two(responses)
    weights = responses["weights"]
    jobs    = responses["jobs"]

    raise "Missing weights" unless weights.present?
    raise "Missing jobs array" unless jobs.is_a?(Array)

    saved_jobs = jobs.map do |job|
      new_job = @user.job_leads.create!(
        job_title: job["job_title"],
        company: job["company"],
        url: job["url"],
        known_connections: job["known_connections"] || [],
        checks: job["checks"] || {},
        match_score: calculate_match_score(weights, job["checks"])
      )
      new_job
    end

    {
      status: :success,
      day: 2,
      total_jobs: saved_jobs.count,
      jobs: saved_jobs
    }
  end

  # -----------------------------
  # MATCH SCORE CALCULATOR
  # -----------------------------
  def calculate_match_score(weights, checks)
    total = 0

    weights.each do |category, weight|
      # Normalize keys, incoming values could be:
      # true / false / "true" / "false" / 1 / 0 / nil
      checked =
        checks[category.to_s] ||
        checks[category.to_sym]

      checked = checked == true || checked.to_s.downcase == "true"

      total += weight.to_i if checked
    end

    total
  end

end
