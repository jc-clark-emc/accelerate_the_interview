class Api::V1::PlanTasksController < ApplicationController
  before_action :require_login

  def update
    task = PlanTask.joins(:plan_day)
                   .where(plan_days: { user_id: current_user.id })
                   .find(params[:id])

    if task.update(task_params)
      render json: task
    else
      render json: { error: task.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def task_params
    params.require(:plan_task).permit(:user_input)
  end
end
