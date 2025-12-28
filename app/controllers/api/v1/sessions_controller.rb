class Api::V1::SessionsController < ApplicationController
  include Sorcery::Controller

  skip_before_action :require_login, only: [:create]

  def create
    user = User.authenticate(params[:email], params[:password])

    if user
      auto_login(user)  # No CSRF token required
      render json: { message: "Login successful", user: { id: user.id, email: user.email } }, status: :ok
    else
      render json: { error: "Invalid email or password" }, status: :unauthorized
    end
  end

  def destroy
    logout
    render json: { message: "Logged out" }, status: :ok
  end
end
