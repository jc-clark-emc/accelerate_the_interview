class ApplicationController < ActionController::API
  include Sorcery::Controller

  before_action :require_login

  private

  def not_authenticated
    render json: { error: "Please login" }, status: :unauthorized
  end
end
