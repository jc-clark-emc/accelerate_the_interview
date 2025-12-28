Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
  namespace :api do
    namespace :v1 do
      post "/signup", to: "users#create"
      post "/login", to: "sessions#create"
      delete "/logout", to: "sessions#destroy"
      get "/me", to: "users#me"

      resources :plan_days, only: [:create, :index, :show]
      resources :plan_tasks, only: [:create, :update]
      resource :career_preference, only: [:show, :update]

      post "/plan_days/:day_number/submit", to: "task_responses#submit"
      post "plan_days/2/submit", to: "day_two#submit"


    end
  end

end
