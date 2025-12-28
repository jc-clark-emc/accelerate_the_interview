class Api::V1::CareerPreferencesController < ApplicationController
  before_action :require_login

  def show
    pref = current_user.career_preference

    if pref
      render json: pref
    else
      render json: { message: "No career preference found" }
    end
  end

  def update
    pref = current_user.career_preference || current_user.build_career_preference

    if pref.update(career_preference_params)
      render json: pref
    else
      render json: { errors: pref.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def career_preference_params
    params.require(:career_preference).permit(
      target_titles: [],
      must_have_skills: [],
      nice_to_have_skills: [],
      non_negotiables: [],
      :target_salary_min,
      :target_salary_ideal,
      :work_location_preference,
      :max_commute_minutes,
      :role_must_include,
      :career_summary
    )
  end
end
