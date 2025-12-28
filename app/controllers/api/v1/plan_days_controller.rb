module Api
  module V1
    class PlanDaysController < ApplicationController
      before_action :require_login

      def create
        plan_day = current_user.plan_days.create(plan_day_params)
        if plan_day.persisted?
          render json: plan_day, status: :created
        else
          render json: { errors: plan_day.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def index
        render json: current_user.plan_days
      end

      def show
        plan_day = current_user.plan_days.find(params[:id])
        render json: plan_day, include: :plan_tasks
      end

      private

      def plan_day_params
        params.require(:plan_day).permit(:day_number)
      end
    end
  end
end
