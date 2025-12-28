class Api::V1::DayTwoController < ApplicationController
  before_action :require_login

  def submit
    user = current_user
    pref = user.career_preference

    # Save custom weights
    if params[:weights].present?
      pref.update!(weights: params[:weights])
    end

    weights = pref.weights
    created_jobs = []

    params[:jobs].each do |job|
      jl = user.job_leads.create!(
        job_title: job[:job_title],
        company: job[:company],
        url: job[:url],
        known_connections: job[:known_connections] || [],
        checks: job[:checks] || {}
      )

      jl.calculate_match_score!(weights)
      created_jobs << jl
    end

    render json: {
      status: "success",
      total_jobs: created_jobs.size,
      jobs: created_jobs
    }
  end
end
