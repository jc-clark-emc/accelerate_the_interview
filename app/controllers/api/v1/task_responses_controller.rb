class Api::V1::TaskResponsesController < ApplicationController
  before_action :require_login

  def submit
    day_number = params[:day_number].to_i

    # -----------------------------
    # DAY 1 PAYLOAD STRUCTURE
    # -----------------------------
    if day_number == 1
      responses = params[:responses] ||
                  params.dig(:task_response, :responses)

      if responses.nil?
        return render json: { status: :error, message: "Missing responses for Day 1" }, status: 400
      end

      result = TaskMapperService.new(current_user).submit_day(1, responses)

      return render json: { status: :success, day: 1, data: result }
    end

    # -----------------------------
    # DAY 2 PAYLOAD STRUCTURE
    # -----------------------------
    if day_number == 2
      # Raw JSON directly includes weights + jobs at the top level
      responses = {
        "weights" => params[:weights],
        "jobs"    => params[:jobs]
      }

      if responses["weights"].nil? || responses["jobs"].nil?
        return render json: { status: :error, message: "Missing weights or jobs for Day 2" }, status: 400
      end

      result = TaskMapperService.new(current_user).submit_day(2, responses)

      return render json: { status: :success, day: 2, data: result }
    end

    # -----------------------------
    # UNSUPPORTED DAY
    # -----------------------------
    render json: { status: :error, message: "Unsupported day: #{day_number}" }, status: 400

  rescue => e
    render json: {
      status: :error,
      message: e.message,
      backtrace: Rails.env.development? ? e.backtrace : []
    }, status: 500
  end
end
