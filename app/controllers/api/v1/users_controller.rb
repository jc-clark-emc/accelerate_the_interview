class Api::V1::UsersController < ApplicationController
  skip_before_action :require_login, only: [:create]

  def create
    user = User.new(user_params)
    if user.save
      auto_login(user)
      render json: { user: user, message: "Signup successful" }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def me
    if current_user
      render json: current_user
    else
      render json: { error: "Not logged in" }, status: :unauthorized
    end
  end

  private

  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation)
  end
end
